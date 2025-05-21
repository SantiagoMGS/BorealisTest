import { AnalysesRepository } from '@domain/repositories/analyses/analyses.repository';
import { Injectable, BadRequestException } from '@nestjs/common';
import { IAnalysisEntity } from '@domain/entities/analyses/analyses.entity';
import { IAnalysisResponse } from '@domain/interfaces/analyses/analyses.response.interfaces';
import * as XLSX from 'xlsx';
import { MultipartFile } from '@fastify/multipart';
import { AnalysesMapper } from '@presentation/controllers/analyses/mappers/analyses.mapper';
import { FindAnalysisTypeByNameUseCase } from '../analysis-type/find-analysis-type-by-name.use-case';
import { FindExistingAnalysisUseCase } from './find-existing-analysis.use-case';
import { FindCompanyByIdUseCase } from '../company/find-company-by-id.use-case';
export interface ICreateXRFAnalysisData {
  sampleId: string | { value: string };
  analysisDate: string | { value: string };
  file: MultipartFile;
}

@Injectable()
export class CreateXRFAnalysesUseCase {
  constructor(
    private readonly analysesRepository: AnalysesRepository,
    private readonly findAnalysisTypeByNameUseCase: FindAnalysisTypeByNameUseCase,
    private readonly findExistingAnalysisUseCase: FindExistingAnalysisUseCase,
    private readonly findCompanyByIdUseCase: FindCompanyByIdUseCase,
  ) {}

  async execute(
    analysisData: ICreateXRFAnalysisData,
    companyId: string,
  ): Promise<IAnalysisResponse> {
    try {
      const company = await this.findCompanyByIdUseCase.execute(companyId);
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

      const sampleId =
        (analysisData.sampleId as any)?.value || analysisData.sampleId;

      const analysisEntity = AnalysesMapper.toEntityXRF({
        sampleId,
        analysisDate: analysisDate.toISOString(),
        resultValue: fileContent,
      });

      if (!Array.isArray(analysisEntity.resultValue)) {
        throw new BadRequestException('Formato de datos XRF inválido');
      }

      const analysis: IAnalysisEntity = {
        sampleId: analysisEntity.sampleId,
        analysisDate: analysisEntity.analysisDate,
        resultValue: analysisEntity.resultValue,
      };
      const analysisType =
        await this.findAnalysisTypeByNameUseCase.execute('XRF');

      const existingAnalysis = await this.findExistingAnalysisUseCase.execute(
        analysisType.id,
        analysis.sampleId,
      );

      if (existingAnalysis) {
        throw new BadRequestException(
          'La muestra ya tiene un análisis XRF activo',
        );
      }

      return await this.analysesRepository.createXRFAnalyses(analysis);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Error al procesar el análisis XRF',
      );
    }
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
      fileContent = XLSX.utils.sheet_to_csv(worksheet, { FS: '\t' });
    } else {
      const encodings: BufferEncoding[] = ['utf8', 'latin1', 'ascii'];
      for (const encoding of encodings) {
        fileContent = fileBuffer.toString(encoding);
        if (!fileContent.includes('')) {
          break;
        }
      }
    }

    if (!fileContent) {
      throw new BadRequestException('No se pudo leer el contenido del archivo');
    }

    return fileContent;
  }
}
