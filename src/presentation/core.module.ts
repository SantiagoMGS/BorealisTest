import { Module } from '@nestjs/common';
import {
  CompanyModule,
  ResourceModule,
  RoleModule,
  UserModule,
  WebhookModule,
} from './module';

/**
 * Módulo principal de la aplicación que organiza la funcionalidad core.
 * 
 * Este módulo sigue el patrón de Feature Modules, donde cada funcionalidad
 * está encapsulada en su propio módulo. Esto mejora:
 * - Mantenibilidad: cada módulo tiene su propia responsabilidad
 * - Testabilidad: los módulos pueden probarse de forma aislada
 * - Escalabilidad: es más fácil agregar nuevas funcionalidades
 */
@Module({
  imports: [
    UserModule,
    RoleModule,
    ResourceModule,
    CompanyModule,
    WebhookModule,
  ],
  exports: [
    UserModule,
    RoleModule,
    ResourceModule,
    CompanyModule,
    WebhookModule,
  ],
})
export class CoreModule {}
