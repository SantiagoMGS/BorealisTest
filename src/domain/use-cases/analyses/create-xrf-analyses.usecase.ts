import { AnalysesRepository } from '@domain/repositories/analyses/analyses.repository';
import { Injectable, BadRequestException } from '@nestjs/common';
import { IAnalysisEntity } from '@domain/entities/analyses/analyses.entity';
import { IAnalysisResponse } from '@domain/interfaces/analyses/analyses.response.interfaces';
import * as XLSX from 'xlsx';
import { MultipartFile } from '@fastify/multipart';
import { AnalysesMapper } from '@presentation/controllers/analyses/mappers/analyses.mapper';

export interface ICreateXRFAnalysisData {
  sampleId: string | { value: string };
  analysisDate: string | { value: string };
  file: MultipartFile;
}

@Injectable()
export class CreateXRFAnalysesUseCase {
  constructor(private readonly analysesRepository: AnalysesRepository) {}

  async execute(
    analysisData: ICreateXRFAnalysisData,
    companyId: string,
  ): Promise<IAnalysisResponse> {
    try {
      // Procesar y validar la fecha
      const dateValue =
        (analysisData.analysisDate as any)?.value || analysisData.analysisDate;
      const analysisDate = new Date(dateValue);
      if (isNaN(analysisDate.getTime())) {
        throw new BadRequestException(
          'La fecha de análisis debe estar en formato ISO (YYYY-MM-DDTHH:mm:ssZ)',
        );
      }

      // Validar extensión del archivo
      const validExtensions = ['.txt', '.csv', '.xls', '.xlsx'];
      const hasValidExtension = validExtensions.some((ext) =>
        analysisData.file.filename?.toLowerCase().endsWith(ext),
      );

      if (!hasValidExtension) {
        throw new BadRequestException(
          `Tipo de archivo inválido. Extensiones permitidas: ${validExtensions.join(', ')}`,
        );
      }

      // Procesar el archivo
      const fileContent = await this.processFile(analysisData.file);

      // Extraer el sampleId
      const sampleId =
        (analysisData.sampleId as any)?.value || analysisData.sampleId;

      // Usar el mapper para crear la entidad
      const analysisEntity = AnalysesMapper.toEntityXRF({
        sampleId,
        analysisDate: analysisDate.toISOString(),
        resultValue: fileContent,
      });

      // Verificar que resultValue es un array
      if (!Array.isArray(analysisEntity.resultValue)) {
        throw new BadRequestException('Formato de datos XRF inválido');
      }

      // Crear un solo análisis con todos los resultados
      const analysis: IAnalysisEntity = {
        sampleId: analysisEntity.sampleId,
        analysisDate: analysisEntity.analysisDate,
        resultValue: analysisEntity.resultValue, // Guardamos todo el array de resultados
      };

      // Crear el análisis en la base de datos
      return await this.analysesRepository.createXRFAnalyses(
        analysis,
        companyId,
      );
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
      // Para archivos de texto
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
