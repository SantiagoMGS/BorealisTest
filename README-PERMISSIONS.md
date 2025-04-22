# Guía de Implementación de Permisos

Este documento describe cómo implementar y garantizar permisos en la aplicación utilizando el sistema de permisos escalonados.

## Funcionamiento General

El sistema de permisos se basa en tres entidades principales:

1. **Roles**: Asignados a los usuarios en el contexto de una empresa.
2. **Subrecursos**: Partes específicas de la aplicación que se desean proteger.
3. **Acciones**: Operaciones que se pueden realizar en un subrecurso, con niveles jerárquicos:
   - `read`: nivel 1
   - `create`: nivel 2
   - `update`: nivel 3
   - `delete`: nivel 4 (el nivel más alto)

Un rol puede tener asignado **sólo un nivel de acción** por cada subrecurso. Este nivel de acción otorga automáticamente todos los permisos de niveles inferiores (por ejemplo, un permiso de `delete` nivel 4, también permite `read`, `create`, y `update`).

## Configuración de Permisos

### 1. Esquema de Base de Datos

La tabla `RolePermission` tiene un constraint único en `roleId` y `subresourceId` para garantizar que un rol solo pueda tener una acción por subrecurso:

```prisma
model RolePermission {
  roleId        String   @db.Uuid
  actionId      String   @db.Uuid
  subresourceId String   @db.Uuid
  // ... otros campos ...

  @@id([roleId, actionId, subresourceId])
  @@unique([roleId, subresourceId]) // Limita a una acción por rol y subrecurso
}
```

### 2. Decoradores para Controladores y Rutas

Utiliza el decorador `RequireSubresource` para especificar a qué subrecurso corresponde un controlador o una ruta específica:

```typescript
// A nivel de controlador (aplica a todas las rutas)
@Controller('resource')
@UseGuards(AuthGuard('internal'), PermissionGuard)
@RequireSubresource('resource')
export class ResourceController {
  // ...
}

// A nivel de método (para rutas específicas con diferente subrecurso)
@Patch('special-action')
@RequireSubresource('resource-special')
@UseGuards(PermissionGuard)
async specialAction() {
  // ...
}
```

### 3. Guard de Permisos

El `PermissionGuard` determina automáticamente:

1. El subrecurso (desde el decorador o la URL)
2. La acción requerida (desde el método HTTP)
3. El nivel de permiso del usuario actual

## Ejemplo Práctico

### Configuración de un Nuevo Controlador

```typescript
import { RequireSubresource } from 'src/core/domain/uses-cases/auth/decorators/permissions.decorator';
import { PermissionGuard } from 'src/core/domain/uses-cases/auth/guards/permission.guard';

@ApiTags('Products')
@Controller('product')
@UseGuards(AuthGuard('internal'), PermissionGuard)
@RequireSubresource('product')
export class ProductController {
  
  @Post()
  // No se requiere decorador adicional, hereda 'product' del controlador
  // y la acción 'create' se determina automáticamente del método HTTP
  async createProduct(@Body() dto: CreateProductDto) {
    // ...
  }
  
  @Get()
  // Acción 'read' automáticamente determinada del método HTTP GET
  async getAllProducts() {
    // ...
  }
  
  @Delete(':id')
  // Acción 'delete' automáticamente determinada del método HTTP DELETE
  async deleteProduct(@Param('id') id: string) {
    // ...
  }
  
  @Patch('special/:id')
  // Aquí especificamos un subrecurso diferente
  @RequireSubresource('product-special')
  async specialProductAction(@Param('id') id: string) {
    // Requiere permisos para 'product-special'
  }
}
```

## Asignación de Permisos a Roles

Al asignar permisos a roles, siempre asigna **el nivel más alto de acción** que debería tener el rol para un subrecurso específico. Por ejemplo:

- Para un rol que solo debe ver: asigna `read` (nivel 1)
- Para un rol que debe gestionar completamente: asigna `delete` (nivel 4)

La validación de permisos en el `PermissionGuard` garantizará que los niveles de acción se comparen correctamente.

## Consideraciones Importantes

1. **Nombres de Subrecursos**: Es crucial que los nombres utilizados en el decorador `RequireSubresource` coincidan exactamente con los nombres de subrecursos existentes en la base de datos. 
   - Por ejemplo, usar `@RequireSubresource('Gestión de usuarios')` en lugar de `@RequireSubresource('user')`.
   - Si no existe el subrecurso, la autorización fallará.

2. **Creación de Subrecursos**: Todos los subrecursos utilizados con el decorador `RequireSubresource` deben existir previamente en la base de datos.

3. **Nomenclatura de Subrecursos**: Utiliza nombres descriptivos y consistentes para tus subrecursos, siguiendo el patrón existente.

4. **Verificación Manual**: Si necesitas verificar permisos manualmente (fuera de los guards), utiliza el `PermissionService`.

5. **Rutas Anidadas**: Para controladores con rutas anidadas complejas, asigna cuidadosamente los subrecursos a cada ruta.

## Subrecursos Actuales

La aplicación incluye estos subrecursos predefinidos:

- 'Gestión de usuarios' - Para las operaciones CRUD de usuarios
- 'Permisos' - Para gestión de permisos
- 'Gestión de compañías' - Para operaciones CRUD de compañías
- 'Branding' - Para personalización de compañías
- 'Gestión de roles' - Para operaciones CRUD de roles
- 'Asignación de roles' - Para asignar roles a usuarios
- 'Gestión de proveedores' - Para operaciones CRUD de proveedores
- 'Gestión de lotes' - Para operaciones CRUD de lotes
- 'Gestión de muestras' - Para operaciones CRUD de muestras
- 'Resultados' - Para gestión de resultados
- 'Gestión de aplicaciones' - Para operaciones CRUD de aplicaciones
- 'Asignación de aplicaciones' - Para asignar aplicaciones
- 'Indicadores' - Para visualización de indicadores
- 'Reportes' - Para gestión de reportes

Si necesitas un nuevo subrecurso, debes agregarlo a `prisma/data/subresources.data.ts` y ejecutar el seed. 