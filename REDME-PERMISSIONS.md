# Sistema de Permisos Escalonados

Este documento explica el sistema de permisos escalonados implementado en la aplicación Borealis, su arquitectura y cómo utilizarlo.

## 📋 Índice

1. [Conceptos básicos](#conceptos-básicos)
2. [Arquitectura](#arquitectura)
3. [Implementación](#implementación)
4. [Flujo de verificación de permisos](#flujo-de-verificación-de-permisos)
5. [Cómo usar el sistema](#cómo-usar-el-sistema)
6. [Consideraciones para la base de datos](#consideraciones-para-la-base-de-datos)
7. [Caché y rendimiento](#caché-y-rendimiento)

## Conceptos básicos

El sistema de permisos utiliza un enfoque escalonado basado en tres entidades principales:

1. **Subresource**: Representa un recurso del sistema (usuarios, proveedores, etc.) relacionado con un controlador específico.
2. **Action**: Representa operaciones (create, read, update, delete) con un nivel jerárquico.
3. **RolePermission**: Relaciona un rol con un subrecurso y una acción específica.

### Sistema escalonado

El sistema implementa una jerarquía de permisos basada en niveles:

- **READ** (Nivel 1): Permiso para leer/consultar datos
- **CREATE** (Nivel 2): Permiso para crear nuevos registros
- **UPDATE** (Nivel 3): Permiso para actualizar registros existentes
- **DELETE** (Nivel 4): Permiso para eliminar registros

Si un rol tiene un permiso de nivel superior (por ejemplo, DELETE - nivel 4), automáticamente tiene todos los permisos de nivel inferior (READ, CREATE, UPDATE). Esto simplifica la administración de permisos y evita tener que asignar múltiples permisos para cada operación.

## Arquitectura

El sistema sigue los principios de Clean Architecture y arquitectura hexagonal:

### 1. Dominio (Domain)

- **Entidades**:

  - `IActionEntity`: Define acciones y sus niveles jerárquicos
  - `ISubresourceEntity`: Define subrecursos relacionados con controladores
  - `IRolePermissionEntity`: Relaciona roles, subrecursos y acciones

- **Puertos (Interfaces)**:
  - `IPermissionsPort`: Define métodos para verificar permisos
  - `PermissionsRepository`: Define operaciones para acceder a datos de permisos

### 2. Infraestructura (Infrastructure)

- **Repositorios**:
  - `PermissionsRepositoryImpl`: Implementa el repositorio de permisos
- **Servicios**:
  - `PermissionsService`: Implementa la lógica de verificación de permisos con caché
- **Datasource**:

  - `PermissionsDataSource`: Acceso directo a la base de datos para permisos

- **Guard**:
  - `PermissionsGuard`: Guard de NestJS que verifica permisos en las solicitudes

### 3. Presentación (Presentation)

- **Decoradores**:
  - `@RequirePermission()`: Decorador para marcar controladores/métodos que requieren verificación de permisos

## Implementación

### JwtStrategy

El sistema utiliza la estrategia JWT para autenticación. El token JWT debe contener:

```json
{
  "sub": "userId",
  "companyId": "companyId",
  "roleId": "roleId",
  "iat": 1609459200,
  "exp": 1609545600
}
```

La estrategia JWT extrae estos valores y los incluye en el objeto `request.user`.

### Decorador RequirePermission

El decorador `@RequirePermission()` marca controladores o métodos específicos que requieren verificación de permisos:

```typescript
@RequirePermission('NombreDelControlador')
```

El nombre del controlador se usa para buscar el subrecurso correspondiente en la base de datos.

### PermissionsGuard

El guard:

1. Extrae el nombre del controlador desde los metadatos del decorador
2. Determina la acción basada en el método HTTP:
   - GET → read (nivel 1)
   - POST → create (nivel 2)
   - PUT/PATCH → update (nivel 3)
   - DELETE → delete (nivel 4)
3. Extrae companyId y roleId del usuario autenticado
4. Verifica si el rol tiene el permiso necesario

### PermissionsService

El servicio:

1. Mantiene un caché de subrecursos y sus controladores asociados
2. Mantiene un caché de resultados de verificación de permisos
3. Verifica si un rol tiene permiso para una acción específica en un controlador
4. Implementa la lógica de permisos escalonados

## Flujo de verificación de permisos

1. **Solicitud HTTP**: El cliente envía una solicitud con un token JWT válido que contiene `roleId` y `companyId`.

2. **JwtAuthGuard**: Verifica la autenticación y extrae los datos del usuario.

3. **PermissionsGuard**:

   - Extrae el controlador objetivo usando el decorador `@RequirePermission()`.
   - Determina la acción requerida basada en el método HTTP.
   - Extrae `roleId` y `companyId` del usuario autenticado.

4. **PermissionsService**:

   - Busca el subrecurso correspondiente al controlador en el caché.
   - Determina el nivel de acción requerido.
   - Verifica si el rol tiene el nivel de permiso requerido.
   - Almacena el resultado en caché para futuras verificaciones.

5. **Resultado**:
   - Si tiene permiso: la solicitud continúa.
   - Si no tiene permiso: devuelve un error 403 Forbidden.

## Cómo usar el sistema

### 1. Configuración del módulo

Asegúrate de importar el `PermissionsModule` en los módulos donde se utilizará:

```typescript
@Module({
  imports: [PermissionsModule],
  // ...
})
export class TuModulo {}
```

### 2. Aplicar decoradores y guards

#### A nivel de controlador (afecta a todos los métodos)

```typescript
@Controller('recursos')
@RequirePermission(RecursosController.name)
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RecursosController {
  // ...
}
```

#### A nivel de método (solo afecta a un método específico)

```typescript
@Controller('recursos')
export class RecursosController {
  @Get()
  @RequirePermission(RecursosController.name)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  findAll() {
    // ...
  }
}
```

#### Con nombre de controlador personalizado

```typescript
@Controller('recursos')
@RequirePermission('RecursoPersonalizado')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RecursosController {
  // ...
}
```

### 3. Asegurar que el token JWT incluya roleId y companyId

El token JWT debe incluir `roleId` y `companyId` para que el sistema funcione correctamente. Esto se configura típicamente en el servicio de autenticación al generar el token.

## Consideraciones para la base de datos

La base de datos debe tener las siguientes tablas:

1. **subresource**: Almacena los recursos y su relación con controladores

   - id (UUID)
   - name (string)
   - controller (string) - Nombre del controlador relacionado
   - active (boolean)

2. **action**: Almacena las acciones y sus niveles

   - id (UUID)
   - name (string) - 'read', 'create', 'update', 'delete'
   - level (int) - 1, 2, 3, 4 respectivamente
   - active (boolean)

3. **role_permission**: Relaciona roles con subrecursos y acciones
   - id (UUID)
   - roleId (UUID) - Foreign key a tabla de roles
   - subresourceId (UUID) - Foreign key a tabla de subrecursos
   - actionId (UUID) - Foreign key a tabla de acciones
   - active (boolean)

## Caché y rendimiento

El sistema implementa dos niveles de caché:

1. **Caché de subrecursos**: Carga todos los subrecursos al iniciar la aplicación, relacionando cada controlador con su subrecurso correspondiente.

2. **Caché de verificaciones**: Almacena los resultados de las verificaciones de permisos usando una clave compuesta por `roleId:companyId:controller:action`.

Esto mejora significativamente el rendimiento al evitar consultas repetidas a la base de datos para las mismas verificaciones de permisos.

---

## Ejemplo completo de uso

1. **Configurar el módulo**:

```typescript
// supplier.module.ts
@Module({
  imports: [PermissionsModule],
  controllers: [SupplierController],
  // ...
})
export class SupplierModule {}
```

2. **Aplicar decoradores y guards**:

```typescript
// supplier.controller.ts
@ApiTags('Proveedores')
@Controller('suppliers')
@RequirePermission(SupplierController.name)
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class SupplierController {
  // ...

  @Post()
  async create(@Body() createDto: CreateDto) {
    // Este método requiere permiso CREATE (nivel 2)
    // ...
  }

  @Get()
  async findAll() {
    // Este método requiere permiso READ (nivel 1)
    // ...
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    // Este método requiere permiso DELETE (nivel 4)
    // ...
  }
}
```

3. **Asegurar que el token contenga los datos necesarios**:

```typescript
// En el servicio que genera tokens
const payload = {
  sub: userId,
  companyId: companyId,
  roleId: roleId,
};

const token = this.jwtService.sign(payload);
```

4. **Verificar que la estrategia JWT incluya los campos**:

```typescript
// jwt.strategy.ts
return {
  ...userFromDatabase,
  companyId: payload.companyId,
  roleId: payload.roleId,
};
```
