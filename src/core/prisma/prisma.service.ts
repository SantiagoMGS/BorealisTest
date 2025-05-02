import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { getCurrentCompanyId } from '../services/request-context.service';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

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
      // Obtenemos el companyId del contexto
      const companyId = getCurrentCompanyId();

      // Si no hay companyId o el modelo no debe filtrarse, continuamos sin modificar
      if (!companyId || !this.shouldApplyCompanyFilter(params.model || '')) {
        return next(params);
      }

      // Solo aplicamos filtros a operaciones de lectura
      if (
        ['findMany', 'findFirst', 'findUnique', 'count', 'aggregate'].includes(
          params.action,
        )
      ) {
        // Iniciamos logging para debug
        this.logger.debug(
          `Aplicando filtro de compañía (${companyId}) a ${params.model}.${params.action}`,
        );

        // Inicializar where si no existe
        if (!params.args) params.args = {};
        if (!params.args.where) params.args.where = {};

        // Aplicar filtro según el modelo
        if (this.hasDirectCompanyIdField(params.model || '')) {
          // Para modelos con campo companyId directo
          params.args.where.companyId = companyId;
        } else if (params.model === 'Supplier') {
          // Para proveedores que se relacionan a través de CompanySupplier
          params.args.where.companies = {
            some: {
              companyId: companyId,
            },
          };
        } else if (
          params.model === 'SubSample' ||
          params.model === 'Analysis'
        ) {
          // Para modelos relacionados indirectamente a través de Reception
          // Usamos una operación más compleja aquí
          if (params.model === 'SubSample') {
            params.args.where.Sample = {
              reception: {
                companyId: companyId,
              },
            };
          } else if (params.model === 'Analysis') {
            params.args.where.subSample = {
              Sample: {
                reception: {
                  companyId: companyId,
                },
              },
            };
          }
        } else if (params.model === 'SupplierMiningTitle') {
          // Para títulos mineros que se relacionan con Supplier
          params.args.where.supplier = {
            companies: {
              some: {
                companyId: companyId,
              },
            },
          };
        } else if (params.model === 'SupplierReceptionOrigin') {
          // Para la relación entre proveedores y orígenes de recepción
          params.args.where.supplier = {
            companies: {
              some: {
                companyId: companyId,
              },
            },
          };
        }
      }

      return next(params);
    });
  }

  /**
   * Determina si un modelo debe ser filtrado por compañía
   */
  private shouldApplyCompanyFilter(model: string): boolean {
    const modelsToFilter = [
      'Supplier',
      'Reception',
      'Sample',
      'SubSample',
      'Analysis',
      'Barrenado',
      'CompanySupplier',
      'SupplierMiningTitle',
      'SupplierReceptionOrigin',
    ];
    return modelsToFilter.includes(model);
  }

  /**
   * Determina si un modelo tiene un campo companyId directo
   */
  private hasDirectCompanyIdField(model: string): boolean {
    const modelsWithDirectCompanyId = ['Reception', 'CompanySupplier'];
    return modelsWithDirectCompanyId.includes(model);
  }
}
