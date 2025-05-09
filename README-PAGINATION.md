# Guía de Paginación

## Descripción

Este sistema de paginación proporciona una manera estandarizada y reutilizable para implementar paginación en todos los endpoints de la API siguiendo los principios de Clean Architecture.

La respuesta paginada tiene esta estructura:

```json
{
  "success": true,
  "statusCode": 200,
  "timestamp": "2023-10-25T12:34:56.789Z",
  "path": "/api/recursos",
  "message": "Datos recuperados exitosamente",
  "data": {
    "items": [
      // Los elementos de la colección
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

## Componentes

El sistema de paginación incluye:

1. **DTOs y interfaces**:

   - `PaginationDto`: Para recibir y validar parámetros de paginación en controladores
   - `IPaginationOptions`: Para definir opciones de paginación internamente
   - `IPaginatedData`: Para estructurar la respuesta paginada

2. **Utilidades**:

   - `PaginationHelper`: Clase con métodos para crear respuestas paginadas

3. **Interceptores**:

   - `PaginatedResponseInterceptor`: Para formatear respuestas paginadas automáticamente

4. **Decoradores**:
   - `@Paginated()`: Para aplicar a controladores que devuelven datos paginados

## Uso en Controladores

### 1. Definir el controlador con paginación

```typescript
import { Controller, Get, Query } from '@nestjs/common';
import { PaginationDto, Paginated } from '../shared';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Paginated() // 👈 Aplica el decorador @Paginated()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.userService.findAll(paginationDto);
  }
}
```

### 2. Implementar el servicio con paginación

```typescript
import { Injectable } from '@nestjs/common';
import { PaginationDto, PaginationHelper, IPaginatedData } from '../shared';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(paginationDto: PaginationDto): Promise<IPaginatedData<User>> {
    const { page, limit } = paginationDto;

    // Opción 1: Si ya tienes todos los datos en memoria
    const allUsers = await this.userRepository.findAll();
    return PaginationHelper.createPaginatedResponse(allUsers, { page, limit });

    // Opción 2: Si ya tienes los datos paginados desde la base de datos
    // const totalUsers = await this.userRepository.count();
    // const users = await this.userRepository.findPaginated(page, limit);
    // return PaginationHelper.createPaginatedResponseFromItems(users, totalUsers, { page, limit });
  }
}
```

### 3. Implementar la paginación en tu repositorio

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { User } from './entities/user.entity';
import { IPaginationOptions } from '../shared';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findPaginated(page: number, limit: number): Promise<User[]> {
    const skip = (page - 1) * limit;
    return this.prisma.user.findMany({
      skip,
      take: limit,
    });
  }

  async count(filters = {}): Promise<number> {
    return this.prisma.user.count({
      where: filters,
    });
  }
}
```

## Uso de PaginationHelper

### Para paginar datos en memoria

```typescript
import { PaginationHelper, IPaginationOptions } from '../shared';

const allItems = [];
const options: IPaginationOptions = { page: 2, limit: 10 };

// Crea una respuesta paginada automáticamente
const paginatedResult = PaginationHelper.createPaginatedResponse(
  allItems,
  options,
);
```

### Para paginar cuando ya tienes los datos paginados

```typescript
import { PaginationHelper, IPaginationOptions } from '../shared';

const items = [
  /* array con los elementos ya paginados */
];
const totalItems = 100; // El total de elementos sin paginar
const options: IPaginationOptions = { page: 2, limit: 10 };

// Crea una respuesta paginada con los elementos ya paginados
const paginatedResult = PaginationHelper.createPaginatedResponseFromItems(
  items,
  totalItems,
  options,
);
```

## Personalización

### Cambiar límite por defecto

Para cambiar el límite por defecto (actualmente 10), modifica el valor en `PaginationDto`:

```typescript
// src/shared/dtos/paginator.dto.ts
export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number = 20; // Cambia el valor por defecto aquí
}
```

### Añadir filtros adicionales

Puedes extender `PaginationDto` para incluir filtros específicos:

```typescript
import { PaginationDto } from '../shared';
import { IsOptional, IsString } from 'class-validator';

export class UserPaginationDto extends PaginationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;
}
```

Y luego usarlo en tu controlador:

```typescript
@Get()
@Paginated()
async findAll(@Query() filters: UserPaginationDto) {
  return this.userService.findAll(filters);
}
```

## Consideraciones de Rendimiento

- Para colecciones pequeñas, puedes usar `createPaginatedResponse` que pagina en memoria.
- Para grandes volúmenes de datos, usa `createPaginatedResponseFromItems` con consultas paginadas directamente en la base de datos.
- Considera añadir índices en las columnas usadas frecuentemente para ordenar y filtrar.

## Integración con Frontend

El frontend debe enviar las solicitudes con los parámetros:

```
GET /api/users?page=2&limit=15
```

Y puede usar la información de `meta` para implementar controles de paginación:

```typescript
// Ejemplo React
function Pagination({ meta }) {
  return (
    <div>
      <button disabled={!meta.hasPreviousPage}>
        Anterior
      </button>
      <span>
        Página {meta.page} de {meta.totalPages}
      </span>
      <button disabled={!meta.hasNextPage}>
        Siguiente
      </button>
    </div>
  );
}
```
