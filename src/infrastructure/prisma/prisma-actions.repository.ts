import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { IActionRepository } from 'src/core/domain/repositories/action.repository';
import { Action } from 'src/core/domain/entities/action.entity';

@Injectable()
export class PrismaActionRepository implements IActionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createActions(actions: Action[]): Promise<Action[]> {
    try {
      await this.prisma.action.createMany({
        data: actions.map((action) => ({
          name: action.name,
          level: action.level,
        })),
        skipDuplicates: true, // ✅ Evita errores si la acción ya existe
      });

      // Recuperamos las acciones recién creadas para retornarlas
      return await this.prisma.action.findMany({
        where: {
          name: { in: actions.map((action) => action.name) },
        },
      });
    } catch (error) {
      throw new ConflictException('Algunas acciones ya existen.');
    }
  }

  async findByName(name: string): Promise<Action | null> {
    return this.prisma.action.findUnique({ where: { name } });
  }
}
