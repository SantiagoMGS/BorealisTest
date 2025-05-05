import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@core/prisma/prisma.service';
import { ReceptionType } from '@prisma/client';

@Injectable()
export class ReceptionTypeDataSourceService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Busca un tipo de recepción por su ID
   * @param id ID del tipo de recepción
   * @returns El tipo de recepción encontrado
   * @throws NotFoundException si no se encuentra el tipo de recepción
   */
  async findById(id: string): Promise<ReceptionType> {
    const receptionType = await this.prisma.receptionType.findUnique({
      where: { id },
    });

    if (!receptionType) {
      throw new NotFoundException(
        `No se encontró el tipo de recepción con ID ${id}`,
      );
    }

    return receptionType;
  }

  /**
   * Busca un tipo de recepción por su nombre
   * @param name Nombre del tipo de recepción
   * @returns El tipo de recepción encontrado
   * @throws NotFoundException si no se encuentra el tipo de recepción
   */
  async findByName(name: string): Promise<ReceptionType> {
    const receptionType = await this.prisma.receptionType.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
        isActive: true,
      },
    });

    if (!receptionType) {
      throw new NotFoundException(
        `No se encontró el tipo de recepción con nombre ${name}`,
      );
    }

    return receptionType;
  }
}
