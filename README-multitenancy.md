# Implementación de Multitenancy en Borealis

Este documento explica la solución implementada para manejar el multitenancy (aislamiento de datos por compañía) en la aplicación Borealis.

## 1. Visión General

La aplicación utiliza un enfoque de "multitenancy mediante filtros" donde:

- Cada entidad relacionada con compañías incluye un filtro automático
- El filtrado ocurre a nivel de middleware de Prisma
- Se aprovecha el token JWT existente que contiene `companyId`

## 2. Componentes Principales

### 2.1 Contexto de Solicitud

El `RequestContextService` mantiene el contexto del usuario actual para cada solicitud HTTP.

```typescript
// src/core/services/request-context.service.ts
@Injectable({ scope: Scope.DEFAULT })
export class RequestContextService {
  private readonly asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

  // Métodos para establecer y obtener el contexto
}
```

### 2.2 Interceptor de Contexto

El `TenantContextInterceptor` captura los datos del usuario del token JWT y los almacena en el contexto.

```typescript
// src/core/interceptores/tenant-context.interceptor.ts
@Injectable()
export class TenantContextInterceptor implements NestInterceptor {
  // Extrae userId, companyId y roleId del token JWT
}
```

### 2.3 Middleware de Prisma

El middleware en `PrismaService` agrega automáticamente el filtro por compañía a todas las consultas de Prisma.

```typescript
// src/core/prisma/prisma.service.ts
this.$use(async (params, next) => {
  const companyId = getCurrentCompanyId();

  if (companyId && shouldApplyCompanyFilter(params.model)) {
    // Aplicar filtro de compañía según el modelo
  }

  return next(params);
});
```

### 2.4 Arquitectura Hexagonal

Se implementa un puerto `ICurrentTenantPort` que define cómo se accede a la información del tenant.

```typescript
// src/domain/ports/common/current-tenant.port.ts
export interface ICurrentTenantPort {
  getCompanyId(): string | undefined;
  getUserId(): string | undefined;
  getRoleId(): string | undefined;
}
```

## 3. Filtrado por Modelo

El middleware de Prisma aplica diferentes estrategias de filtrado según el tipo de modelo:

### 3.1 Modelos con relación directa

Para modelos como `Reception` o `CompanySupplier` que tienen un campo `companyId` directo:

```typescript
params.args.where.companyId = companyId;
```

### 3.2 Modelos con relación indirecta

Para `Supplier` que se relaciona a través de `CompanySupplier`:

```typescript
params.args.where.companies = {
  some: {
    companyId: companyId,
  },
};
```

### 3.3 Modelos con relaciones anidadas

Para `SubSample` o `Analysis` que tienen relaciones más profundas:

```typescript
params.args.where.subSample = {
  Sample: {
    reception: {
      companyId: companyId,
    },
  },
};
```

## 4. Uso en Controladores y Repositorios

Los controladores y repositorios no necesitan cambios: el filtrado es automático y transparente.

```typescript
@Get()
async findAll(): Promise<SupplierResponseDto[]> {
  // No es necesario pasar companyId, el filtrado es automático
  const suppliers = await this.findAllSuppliersUseCase.execute();
  return suppliers;
}
```

## 5. Ventajas

1. **Transparencia**: Los desarrolladores no necesitan preocuparse por el filtrado
2. **DRY**: No hay duplicación de código de filtrado
3. **Seguridad**: Imposible olvidar aplicar el filtro por compañía
4. **Mantenibilidad**: Cambios en el filtrado solo se hacen en un lugar
5. **Rendimiento**: Se aprovecha el token JWT existente

## 6. Seguridad Reforzada

El sistema utiliza una arquitectura de múltiples capas para garantizar la seguridad:

1. **JWT con companyId**: El token ya contiene la información del tenant
2. **Contexto de solicitud**: Cada solicitud mantiene su propio contexto aislado
3. **Middleware Prisma**: Filtrado automático a nivel de base de datos
4. **Inyección vía Clean Architecture**: Principio de Inversión de Dependencias
