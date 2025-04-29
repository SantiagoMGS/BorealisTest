import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@core/prisma/prisma.service';
import { Status } from '@prisma/client';

@Injectable()
export class StatusDataSourceService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Busca un estado por su nombre
   * @param name Nombre del estado
   * @returns El estado encontrado
   * @throws NotFoundException si no se encuentra el estado
   */
  async findByName(name: string): Promise<Status> {
    const status = await this.prisma.status.findUnique({
      where: { name },
    });

    if (!status) {
      throw new NotFoundException(`No se encontró el estado "${name}"`);
    }

    return status;
  }
}
