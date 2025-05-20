import { BadRequestException, Injectable } from '@nestjs/common';
import { AnalysesRepository } from '@domain/repositories/analyses/analyses.repository';
import { ResultValueAA } from '@domain/entities/analyses/analyses.entity';
import { IAnalysisResponse } from '@domain/interfaces/analyses/analyses.response.interfaces';
import { MultipartFile } from '@fastify/multipart';
import * as XLSX from 'xlsx';
import { FindCompanyByIdUseCase } from '../company/find-company-by-id.use-case';
import { FindAnalysisTypeByNameUseCase } from '../analysis-type/find-analysis-type-by-name.use-case';
import { FindExistingAnalysisUseCase } from './find-existing-analysis.use-case';
export interface ICreateAAAnalysisData {
  analysisDate: string | { value: string };
  file: MultipartFile;
}

@Injectable()
export class CreateAAAnalysesUseCase {
  constructor(
    private readonly analysesRepository: AnalysesRepository,
    private readonly findCompanyByIdUseCase: FindCompanyByIdUseCase,
    private readonly findAnalysisTypeByNameUseCase: FindAnalysisTypeByNameUseCase,
    private readonly findExistingAnalysisUseCase: FindExistingAnalysisUseCase,
  ) {}

  async execute(
    analysisData: ICreateAAAnalysisData,
    companyId: string,
  ): Promise<IAnalysisResponse[]> {
    try {
      await this.findCompanyByIdUseCase.execute(companyId);

      const dateValue =
        (analysisData.analysisDate as any)?.value || analysisData.analysisDate;
      const analysisDate = new Date(dateValue);

      if (isNaN(analysisDate.getTime())) {
        throw new BadRequestException(
          'La fecha de análisis debe estar en formato ISO (YYYY-MM-DDTHH:mm:ssZ)',
        );
      }

      const validExtensions = ['.txt', '.csv', '.xls', '.xlsx'];
      const hasValidExtension = validExtensions.some((ext) =>
        analysisData.file.filename?.toLowerCase().endsWith(ext),
      );

      if (!hasValidExtension) {
        throw new BadRequestException(
          `Tipo de archivo inválido. Extensiones permitidas: ${validExtensions.join(', ')}`,
        );
      }

      const fileContent = await this.processFile(analysisData.file);
      const analyses = this.parseAAFileContent(fileContent);

      const results: IAnalysisResponse[] = [];

      for (const analysis of analyses) {
        const analysisType =
          await this.findAnalysisTypeByNameUseCase.execute('AA');

        const existingAnalysis = await this.findExistingAnalysisUseCase.execute(
          analysisType.id,
          analysis.sampleId,
        );

        if (existingAnalysis) {
          throw new BadRequestException(
            'La muestra ya tiene un análisis AA activo',
          );
        }

        const result = await this.analysesRepository.createAAAnalyses({
          sampleId: analysis.sampleId,
          analysisDate,
          resultValue: analysis.resultValue,
        });
        results.push(result);
      }

      return results;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Error al procesar el análisis AA',
      );
    }
  }

  private parseAAFileContent(
    content: string,
  ): { sampleId: string; resultValue: ResultValueAA }[] {
    const lines = content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length < 2) {
      throw new BadRequestException(
        'El archivo debe contener al menos un encabezado y un registro',
      );
    }

    const headers = lines[0].split('\t').map((h) => h.trim());
    const results: { sampleId: string; resultValue: ResultValueAA }[] = [];

    for (let i = 1; i < lines.length; i++) {
      const fields = lines[i].split('\t').map((f) => f.trim());

      if (fields.length < 8) {
        continue;
      }

      const sampleId = fields[1];
      const auValue = fields[fields.length - 1]
        ?.replace(/["\(\)mg\/L]/g, '')
        .trim();

      if (!auValue || auValue === '' || !sampleId || sampleId === '') {
        continue;
      }

      if (
        sampleId.toUpperCase().includes('BLANCO') ||
        sampleId.toUpperCase().includes('PATRON') ||
        sampleId.toUpperCase().includes('STANDAR')
      ) {
        continue;
      }

      results.push({
        sampleId,
        resultValue: {
          status: fields[4] || '',
          dataset: fields[5] || '',
          method: fields[6] || '',
          au: auValue,
        },
      });
    }

    if (results.length === 0) {
      throw new BadRequestException(
        'No se encontraron datos válidos en el archivo',
      );
    }

    return results;
  }

  private async processFile(file: MultipartFile): Promise<string> {
    const fileBuffer = await file.toBuffer();
    let fileContent = '';

    if (
      file.filename?.toLowerCase().endsWith('.xlsx') ||
      file.filename?.toLowerCase().endsWith('.xls')
    ) {
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      fileContent = XLSX.utils.sheet_to_csv(worksheet, {
        FS: '\t',
        blankrows: false,
        rawNumbers: true,
      });
    } else {
      fileContent = fileBuffer
        .toString('utf8')
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n');
    }

    if (!fileContent) {
      throw new BadRequestException('No se pudo leer el contenido del archivo');
    }

    fileContent = fileContent
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join('\n');

    return fileContent;
  }
}
