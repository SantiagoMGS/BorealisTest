import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { getCurrentCompanyId } from '../services/request-context.service';

interface CompanyFilterConfig {
  modelsToFilter: string[];
  modelsWithDirectCompanyId: string[];
  readOperations: string[];
}

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  private readonly config: CompanyFilterConfig = {
    modelsToFilter: [
      'Supplier',
      'Reception',
      'Sample',
      'SubSample',
      'Analysis',
      'Barrenado',
      'CompanySupplier',
      'SupplierMiningTitle',
      'SupplierReceptionOrigin',
    ],
    modelsWithDirectCompanyId: ['Reception', 'CompanySupplier'],
    readOperations: [
      'findMany',
      'findFirst',
      'findUnique',
      'count',
      'aggregate',
    ],
  };

  constructor() {
    super();
    this.setupMiddleware();
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  /**
   * Configura middleware para filtrado automático por compañía
   */
  private setupMiddleware() {
    this.$use(async (params, next) => {
      const companyId = getCurrentCompanyId();

      if (!companyId || !this.shouldApplyCompanyFilter(params.model || '')) {
        return next(params);
      }

      if (this.isReadOperation(params.action)) {
        this.applyCompanyFilter(params, companyId);
      }

      return next(params);
    });
  }

  /**
   * Determina si una operación es de lectura
   */
  private isReadOperation(action: string): boolean {
    return this.config.readOperations.includes(action);
  }

  /**
   * Aplica el filtro de compañía según el modelo
   */
  private applyCompanyFilter(
    params: Prisma.MiddlewareParams,
    companyId: string,
  ): void {
    this.logger.debug(
      `Aplicando filtro de compañía (${companyId}) a ${params.model}.${params.action}`,
    );

    if (!params.args) params.args = {};
    if (!params.args.where) params.args.where = {};

    const model = params.model || '';

    if (this.hasDirectCompanyIdField(model)) {
      this.applyDirectCompanyFilter(params, companyId);
    } else {
      this.applyIndirectCompanyFilter(params, companyId, model);
    }
  }

  /**
   * Aplica filtro para modelos con companyId directo
   */
  private applyDirectCompanyFilter(
    params: Prisma.MiddlewareParams,
    companyId: string,
  ): void {
    params.args.where.companyId = companyId;
  }

  /**
   * Aplica filtro para modelos con relaciones indirectas
   */
  private applyIndirectCompanyFilter(
    params: Prisma.MiddlewareParams,
    companyId: string,
    model: string,
  ): void {
    const filterMap: Record<
      string,
      (params: Prisma.MiddlewareParams, companyId: string) => void
    > = {
      Supplier: (p, id) => {
        p.args.where.companies = { some: { companyId: id } };
      },
      SubSample: (p, id) => {
        p.args.where.Sample = { reception: { companyId: id } };
      },
      Analysis: (p, id) => {
        p.args.where.sample = { reception: { companyId: id } };
      },
      SupplierMiningTitle: (p, id) => {
        p.args.where.supplier = { companies: { some: { companyId: id } } };
      },
      SupplierReceptionOrigin: (p, id) => {
        p.args.where.supplier = { companies: { some: { companyId: id } } };
      },
      Sample: (p, id) => {
        p.args.where.reception = { companyId: id };
      },
    };

    const filterFunction = filterMap[model];
    if (filterFunction) {
      filterFunction(params, companyId);
    }
  }

  /**
   * Determina si un modelo debe ser filtrado por compañía
   */
  private shouldApplyCompanyFilter(model: string): boolean {
    return this.config.modelsToFilter.includes(model);
  }

  /**
   * Determina si un modelo tiene un campo companyId directo
   */
  private hasDirectCompanyIdField(model: string): boolean {
    return this.config.modelsWithDirectCompanyId.includes(model);
  }
}
