# Sistema de Permisos Basado en Niveles de Acción

Esta aplicación implementa un sistema de permisos jerárquico basado en roles, donde cada rol puede tener acceso a diferentes subrecursos con diferentes niveles de acción.

## Estructura de Permisos

### Niveles de Acción

Los permisos se basan en niveles de acción jerárquicos:

| Nivel | Acción | Descripción                                   | Incluye                         |
| ----- | ------ | --------------------------------------------- | ------------------------------- |
| 1     | READ   | Solo lectura                                  | Solo READ                       |
| 2     | CREATE | Crear nuevos registros                        | READ + CREATE                   |
| 3     | UPDATE | Modificar registros existentes                | READ + CREATE + UPDATE          |
| 4     | DELETE | Eliminar registros y todas las demás acciones | READ + CREATE + UPDATE + DELETE |

### Componentes Principales

- **Subrecurso**: Representa una funcionalidad específica de la aplicación a la que se puede asignar un permiso.
- **Rol**: Conjunto de permisos que determina qué puede hacer un usuario.
- **RolePermission**: Relación entre un rol, un subrecurso y una acción permitida.

## Uso de Decoradores

### 1. `RequireSubresource`

Define el subrecurso que requiere el controlador o método específico:

```typescript
@Controller('supplier')
@RequireSubresource('supplier-management')
export class SupplierController {
  // ...
}
```

### 2. `RequireActionLevel`

Permite especificar un nivel de acción personalizado para un método:

```typescript
@Post('approve')
@RequireActionLevel(3) // Requiere nivel UPDATE
async approveSupplier(@Param('id') id: string) {
  // ...
}
```

## Determinación Automática del Nivel de Acción

Si no se especifica un nivel de acción con `@RequireActionLevel`, se determina automáticamente basado en el método HTTP:

- **GET**: Nivel 1 (READ)
- **POST**: Nivel 2 (CREATE)
- **PUT/PATCH**: Nivel 3 (UPDATE)
- **DELETE**: Nivel 4 (DELETE)

## Implementación en Controladores

### Proteger un Controlador Completo:

```typescript
@Controller('supplier')
@UseGuards(JwtAuthGuard, PermissionGuard)
@RequireSubresource('supplier-management')
export class SupplierController {
  // Todos los métodos requieren acceso al subrecurso 'supplier-management'
  // con el nivel de acción determinado por el método HTTP
}
```

### Proteger Métodos Individuales:

```typescript
@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  @Get('basic-report')
  // No usa PermissionGuard, solo requiere autenticación
  async getBasicReport() {
    // ...
  }

  @Get('advanced-report')
  @UseGuards(PermissionGuard)
  @RequireSubresource('advanced-analytics')
  async getAdvancedReport() {
    // Requiere acceso al subrecurso 'advanced-analytics' con nivel READ
  }
}
```

## Consejos para la Asignación de Permisos

1. **Organización de Subrecursos**: Agrupa subrecursos por funcionalidad y asegúrate de que los nombres sean descriptivos.

2. **Asignación de Niveles**: Siempre asigna el nivel más alto que necesita un rol para un subrecurso específico.

3. **Reutilización de Roles**: Crea roles estandarizados para grupos de usuarios con necesidades similares.

4. **Permisos Escalonados**: Recuerda que un usuario con nivel 4 (DELETE) tiene automáticamente todos los permisos de niveles inferiores.

## Ejemplos Prácticos

### Ejemplo: Gestión de Proveedores

```typescript
@Controller('supplier')
@UseGuards(JwtAuthGuard, PermissionGuard)
@RequireSubresource('supplier')
export class SupplierController {
  @Get()
  // Nivel 1 (READ) - Determinado automáticamente
  async getAllSuppliers() {
    // ...
  }

  @Post()
  // Nivel 2 (CREATE) - Determinado automáticamente
  async createSupplier(@Body() dto: CreateSupplierDto) {
    // ...
  }

  @Put(':id')
  // Nivel 3 (UPDATE) - Determinado automáticamente
  async updateSupplier(
    @Param('id') id: string,
    @Body() dto: UpdateSupplierDto,
  ) {
    // ...
  }

  @Delete(':id')
  // Nivel 4 (DELETE) - Determinado automáticamente
  async deleteSupplier(@Param('id') id: string) {
    // ...
  }

  @Post(':id/validate')
  // Acción personalizada que requiere nivel específico
  @RequireActionLevel(3) // Requiere nivel UPDATE
  async validateSupplier(@Param('id') id: string) {
    // ...
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
