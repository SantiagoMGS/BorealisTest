import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@core/prisma/prisma.service';
import { City } from '@prisma/client';

@Injectable()
export class CityDataSourceService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Busca una ciudad por su ID
   * @param id ID de la ciudad
   * @returns La ciudad encontrada
   * @throws NotFoundException si no se encuentra la ciudad
   */
  async findById(id: string): Promise<City> {
    const city = await this.prisma.city.findUnique({
      where: { id },
      include: {
        department: true,
      },
    });

    if (!city) {
      throw new NotFoundException(`Ciudad con ID ${id} no encontrada`);
    }

    return city;
  }
}
