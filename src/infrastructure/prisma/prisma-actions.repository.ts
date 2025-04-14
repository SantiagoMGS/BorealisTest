import { ConflictException, Injectable } from '@nestjs/common';
import { Action } from 'src/core/domain/entities';
import { IActionRepository } from 'src/core/domain/repositories/action.repository';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaActionRepository implements IActionRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(action: Action): Promise<Action> {
    try {

      const created = await this.prisma.action.create({
        data: {
          name: action.name,
          level: action.level,
        },
      });

      return {
        id: created.id,
        name: created.name,
        level: created.level,
      };
    } catch (error) {
      throw new ConflictException(`La acción "${action.name}" ya existe.`);
    }
  }

  async update(id: string, data: Partial<Action>): Promise<Action> {
    const updated = await this.prisma.action.update({
      where: { id },
      data,
    });

    return {
      id: updated.id,
      name: updated.name,
      level: updated.level,
    };
  }

  async delete(id: string): Promise<void> {
    await this.prisma.action.delete({ where: { id } });
  }

  async findByName(name: string): Promise<Action | null> {
    const found = await this.prisma.action.findUnique({ where: { name } });
    return found
      ? {
        id: found.id,
        name: found.name,
        level: found.level,
      }
      : null;
  }
}
