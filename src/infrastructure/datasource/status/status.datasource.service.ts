import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@core/prisma/prisma.service';
import { Status } from '@prisma/client';

@Injectable()
export class StatusDataSourceService {
  constructor(private readonly prisma: PrismaService) {}

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
