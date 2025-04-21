# 🧱 Clean Architecture + NestJS (con CQRS y separación de repositorios)

Este esquema está basado en los principios de **Clean Architecture**, **SOLID**, **DRY**, y patrones como **CQRS**, con una separación explícita entre operaciones de **lectura** y **escritura** usando interfaces `IReadRepository` y `IWriteRepository`.

## 📂 Estructura general del proyecto

```
src/
├ core/                         # Infraestructura transversal y utilidades globales
│ ├ config/                    # Archivos de configuración y variables de entorno
│ ├ decorators/               # Decoradores personalizados (e.g. CurrentUser)
│ ├ filters/                  # Filtros globales para manejo de errores
│ ├ interceptores/            # Interceptores para transformación de respuestas
│ ├ prisma/                   # Integración con Prisma ORM
│ ├ services/                 # Servicios genéricos reutilizables
│ └ core.module.ts            # Módulo central de Core

├ domain/                      # Lógica de negocio pura (sin dependencias técnicas)
│ ├ entities/                # Entidades del dominio por contexto
│ ├ interfaces/             # Contratos internos (respuestas, modelos base)
│ ├ ports/                  # Puertos (interfaces) de comunicación con infraestructura
│ ├ repositories/           # Interfaces específicas de acceso a datos (repositorios)
│ └ use-cases/              # Casos de uso organizados por contexto

├ infrastructure/              # Implementación de puertos usando tecnologías específicas
│ ├ datasource/              # Acceso concreto a la base de datos (ORMs, APIs, etc.)
│ ├ repositories/            # Implementaciones de los repositorios definidos en `domain/`
│ ├ services/                # Servicios técnicos como generación de tokens, encriptación, etc.
│ ├ guards/                  # Guards de autenticación/autorización
│ └ strategies/              # Estrategias para Passport, JWT, OAuth, etc.

├ presentation/                # Adaptadores de entrada (como HTTP)
│ └ controllers/            # Controladores HTTP por contexto (e.g. auth, user)
│   ├ dtos/                 # DTOs para entrada/salida de datos en los endpoints
│   ├ entities/             # Entidades para exposición (solo si difieren del dominio)
│   ├ mappers/              # Transformación entre DTOs y entidades del dominio
│   └ *.controller.ts       # Definición de rutas y orquestación de casos de uso

├ shared/                      # Código común reutilizable entre módulos
│ ├ constants/               # Constantes globales del sistema
│ ├ models/                  # Modelos genéricos como `ApiResponseDto`
│ └ common.module.ts         # Módulo para exportar funcionalidades compartidas

├ app.module.ts                # Módulo raíz de la aplicación
└ main.ts                      # Punto de entrada del servidor (bootstrap de Nest)
```

---

## 🧩 Detalle por capa

### 📁 `core/`

> Contiene herramientas globales reutilizables en todo el proyecto:

- **Configuración** de entornos (`envs.ts`)
- **Decoradores** personalizados (`current-user.decorator.ts`)
- **Filtros de excepciones**
- **Interceptors**
- **Módulo y servicio Prisma**
- **Servicios comunes** (como `HttpResponseService`)

---

### 📁 `domain/`

> Contiene las reglas del negocio puras, independientes de frameworks:

- `entities/`: Entidades del dominio como `Login`, `AuthSession`
- `interfaces/`: Contratos internos, como estructuras de respuesta
- `ports/`: Puertos (interfaces) que definen qué necesita el dominio
- `repositories/`: Contratos para acceso a datos
- `use-cases/`: Casos de uso como `login.use-case.ts`, `get-permissions-by-company.use-case.ts`

---

### 📁 `infrastructure/`

> Adaptadores que implementan los puertos definidos en `domain/`.

- `datasource/`: Acceso directo a tecnologías como base de datos (ej. Prisma)
- `repositories/`: Implementaciones de los repositorios definidos en `domain/repositories`
- `services/`: Servicios técnicos (ej. generación de tokens)
- `guards/` y `strategies/`: Seguridad (JWT, roles, etc.)

---

### 📁 `presentation/`

> Adaptadores de entrada como HTTP Controllers y todo lo relacionado con ellos.

- `controllers/`: Definición de endpoints y orquestación de casos de uso
- `dtos/`: Estructuras de entrada y salida de datos para las rutas
- `entities/`: Representaciones orientadas a transporte si son necesarias
- `mappers/`: Transformaciones entre entidades, DTOs y modelos del dominio
- `modules/`: Módulos por contexto (ej. `auth.module.ts`)

✅ En esta estructura los **DTOs están en `presentation`** porque representan **contratos HTTP** directamente usados por controladores, y está bien que incluyan validaciones (`class-validator`).

---

### 📁 `shared/`

> Utilidades comunes reutilizables:

- `constants/`: Constantes compartidas
- `models/`: Modelos de respuesta genéricos como `ApiResponseDto`
- `common.module.ts`: Módulo para importar en otros contextos

---

## 🧪 Ejemplo de flujo (login)

1. **Controller** (`auth.controller.ts`) recibe un `LoginDto`.
2. **Mapper** (`login.mapper.ts`) convierte el DTO a una entidad o comando del dominio.
3. **UseCase** (`login.use-case.ts`) ejecuta la lógica con ayuda de:
   - **Puertos** definidos en `domain/ports/`
   - **Repositorios** definidos en `domain/repositories/`
4. **RepositoryImpl** (`login.repository-impl.service.ts`) usa un **Datasource** para interactuar con Prisma.
5. El resultado se **mapea de nuevo** y se devuelve como `LoginResponseDto`.

---

## 🔍 Componentes de la Arquitectura

### 📌 **Controller**

- **Responsabilidad**:
  - Es la puerta de entrada del mundo exterior (HTTP).
  - Orquesta la ejecución de casos de uso.
- **Debe contener**:
  - Validaciones ligeras (idealmente usando pipes).
  - Llamadas a casos de uso.
  - Conversión de respuestas en DTOs.
- **No debe contener**:
  - Lógica de negocio.
  - Lógica de persistencia ni transformación de entidades.

```ts
@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.createUserUseCase.execute(dto);
    return UserMapper.toResponseDto(user);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<UserResponseDto | null> {
    const user = await this.getUserUseCase.execute(id);
    return user ? UserMapper.toResponseDto(user) : null;
  }
}
```

### 📌 **UseCase**

- **Responsabilidad**:
  - Contiene lógica de negocio específica de una acción o proceso.
  - Orquesta entidades y puertos (interfaces).
- **Debe contener**:
  - Reglas de negocio.
  - Coordinación entre repositorios, validaciones de dominio.
- **No debe contener**:
  - Código de acceso a datos o dependencias de frameworks.

```ts
// application/use-cases/create-user.usecase.ts
export class CreateUserUseCase {
  constructor(private readonly userWriteRepo: IUserWriteRepository) {}

  async execute(dto: CreateUserDto): Promise<User> {
    const user = new User(dto.name, dto.email);
    return await this.userWriteRepo.save(user);
  }
}

// application/use-cases/get-user.usecase.ts
export class GetUserUseCase {
  constructor(private readonly userReadRepo: IUserReadRepository) {}

  async execute(id: string): Promise<User | null> {
    return await this.userReadRepo.findById(id);
  }
}
```

### 📌 **Repository (Puerto)**

- **Responsabilidad**:
  - Define contratos que deben cumplir los adaptadores de infraestructura.
  - Separa la lógica de negocio del detalle técnico.
- **Debe contener**:
  - Firmas de métodos para persistencia o lectura.
  - Tipado estricto.
- **No debe contener**:
  - Lógica de implementación.

```ts
// domain/ports/user-read.repository.ts
export interface IUserReadRepository {
  findById(id: string): Promise<User | null>;
}

// domain/ports/user-write.repository.ts
export interface IUserWriteRepository {
  save(user: User): Promise<User>;
}
```

### 📌 **RepositoryImpl (Adaptador)**

- **Responsabilidad**:
  - Implementa los contratos definidos por los puertos (`IUserReadRepository`, `IUserWriteRepository`).
  - Usa datasources para acceder a tecnologías específicas (ORM, APIs, etc.).
- **Debe contener**:
  - Transformaciones entre entidades de dominio y modelos persistentes.
- **No debe contener**:
  - Lógica de negocio.

```ts
// infrastructure/repositories/user.repository.impl.ts
@Injectable()
export class UserRepositoryImpl
  implements IUserReadRepository, IUserWriteRepository
{
  constructor(private readonly datasource: UserDatasource) {}

  async findById(id: string): Promise<User | null> {
    const entity = await this.datasource.findById(id);
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async save(user: User): Promise<User> {
    const entity = UserMapper.toPersistence(user);
    const saved = await this.datasource.save(entity);
    return UserMapper.toDomain(saved);
  }
}
```

### 📌 **Datasource**

- **Responsabilidad**:
  - Se comunica directamente con la fuente de datos (ej. base de datos, API externa, archivo plano).
  - Representa la capa más baja, enfocada solo en acceso a datos.
- **Debe contener**:
  - Consultas, mutaciones, llamadas ORM/API.
- **No debe contener**:
  - Transformaciones a entidades de dominio.
  - Reglas de negocio o validaciones complejas.

```ts
// infrastructure/datasources/user.datasource.ts
@Injectable()
export class UserDatasource {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<UserEntity | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async save(entity: UserEntity): Promise<UserEntity> {
    return this.prisma.user.create({ data: entity });
  }
}
```

### 📌 **Mapper**

- **Responsabilidad**:
  - Transforma datos entre capas:
    - `Domain <-> Persistence`
    - `Domain <-> DTO (para controllers)`
- **Debe contener**:
  - Métodos puros y estáticos o independientes del estado.
- **No debe contener**:
  - Lógica de negocio.
  - Acceso a datos o inyecciones de dependencias.

```ts
// infrastructure/mappers/user.mapper.ts
export class UserMapper {
  static toDomain(entity: UserEntity): User {
    return new User(entity.name, entity.email, entity.id);
  }

  static toPersistence(domain: User): UserEntity {
    return {
      id: domain.id,
      name: domain.name,
      email: domain.email,
    };
  }

  static toResponseDto(domain: User): UserResponseDto {
    return {
      id: domain.id,
      name: domain.name,
      email: domain.email,
    };
  }
}
```

### 📌 **DTOs (Data Transfer Objects)**

- **Responsabilidad**:
  - Representan estructuras de datos para entrada (`request`) y salida (`response`) en las interfaces como los controladores.
- **Debe contener**:
  - Propiedades simples y tipadas.
  - Opcionalmente validaciones usando decorators (`class-validator`).
- **No debe contener**:
  - Lógica de negocio.
  - Métodos ni referencias a entidades del dominio.

```ts
// interfaces/dtos/create-user.dto.ts
export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;
}
```
