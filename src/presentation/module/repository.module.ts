import { Module } from '@nestjs/common';
import {
  PrismaActionRepository,
  PrismaApplicationRepository,
  PrismaCompanyRepository,
  PrismaResourceRepository,
  PrismaRolePermissionRepository,
  PrismaRoleRepository,
  PrismaSubResourceRepository,
  PrismaUserRepository,
} from 'src/infrastructure/prisma';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { TOKENS } from './tokens.constants';


@Module({
  providers: [
    PrismaService,
    {
      provide: TOKENS.USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    {
      provide: TOKENS.ROLE_REPOSITORY,
      useClass: PrismaRoleRepository,
    },
    {
      provide: TOKENS.RESOURCE_REPOSITORY,
      useClass: PrismaResourceRepository,
    },
    {
      provide: TOKENS.COMPANY_REPOSITORY,
      useClass: PrismaCompanyRepository,
    },
    {
      provide: TOKENS.ACTION_REPOSITORY,
      useClass: PrismaActionRepository,
    },
    {
      provide: TOKENS.ROLE_PERMISSION_REPOSITORY,
      useClass: PrismaRolePermissionRepository,
    },
    {
      provide: TOKENS.APPLICATION_REPOSITORY,
      useClass: PrismaApplicationRepository,
    },
    {
      provide: TOKENS.SUBRESOURCE_REPOSITORY,
      useClass: PrismaSubResourceRepository,
    },
  ],
  exports: [
    PrismaService,
    TOKENS.USER_REPOSITORY,
    TOKENS.ROLE_REPOSITORY,
    TOKENS.RESOURCE_REPOSITORY,
    TOKENS.COMPANY_REPOSITORY,
    TOKENS.ACTION_REPOSITORY,
    TOKENS.ROLE_PERMISSION_REPOSITORY,
    TOKENS.APPLICATION_REPOSITORY,
    TOKENS.SUBRESOURCE_REPOSITORY,
  ],
})
export class RepositoryModule {} 