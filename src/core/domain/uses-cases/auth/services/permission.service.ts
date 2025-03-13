import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class PermissionService {
  constructor(private readonly prisma: PrismaService) {}

  async getPermissions(resourceName: string, actionName: string) {
    const resource = await this.prisma.resource.findUnique({
      where: { name: resourceName },
    });

    if (!resource) throw new NotFoundException(`Resource '${resourceName}' not found`);

    const action = await this.prisma.action.findUnique({
      where: { name: actionName },
    });

    if (!action) throw new NotFoundException(`Action '${actionName}' not found`);

    return { resource: resource.name, action: action.name };
  }
}
