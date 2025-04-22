# Estándares de Git y Herramientas – Proyecto Aurum - Borealis

## Objetivo de la Reunión

Definir y acordar los estándares para el manejo de Git y herramientas relacionadas en el proyecto **Aurum - Borealis**.

---

## Acuerdos Establecidos

### 1. Estructura de Ramas

- **Rama principal:** `main` (producción)
- **Rama de desarrollo:** `develop` (integración)
- **Ramas de características:** `feature/nombre-funcionalidad`
- **Ramas de corrección de errores:** `bugfix/nombre-error`
- **Ramas de lanzamiento:** `release/v1.x.x`
- **Ramas de corrección urgente:** `hotfix/nombre-error`

---

### 2. Flujo de Trabajo (GitFlow)

1. Todo desarrollo nuevo se inicia desde la rama `develop`.
2. Para cada funcionalidad se crea una rama `feature/nombre-funcionalidad`.
3. Al completar la funcionalidad, se solicita un Pull Request hacia `develop`.
4. Los lanzamientos se preparan en ramas `release/v1.x.x`.
5. Las correcciones urgentes en producción se realizan en ramas `hotfix`.

---

### 3. Convenciones de Mensajes de Commit

Los mensajes de commit deben seguir el formato:

```
tipo(alcance): descripción breve

descripción detallada (opcional)
```

**Tipos permitidos:**

- `feat`: Nueva funcionalidad
- `fix`: Corrección de errores
- `docs`: Cambios en documentación
- `style`: Cambios de formato (espacios, indentación, etc.)
- `refactor`: Cambios en el código que no corrigen errores ni añaden funcionalidades
- `test`: Adición o modificación de pruebas
- `chore`: Cambios en el proceso de construcción o herramientas auxiliares

---

### 4. Pull Requests

- Todo Pull Request requiere al menos **una revisión aprobada**.
- El desarrollador que crea el PR **no puede ser quien lo apruebe**.
- La descripción del PR debe detallar los cambios realizados.

---

### 5. Etiquetas y Versionado

- Se utilizará **versionado semántico**: `MAJOR.MINOR.PATCH`.
- Cada release a producción debe etiquetarse siguiendo el formato: `v1.0.0`.
- Las etiquetas deben incluir **notas detalladas** de los cambios realizados.

---

### 6. Herramientas Adicionales

- **Linting:** `eslint`
- **CI/CD:** `Azure Pipelines`
- **Revisión de código:** `SonarQube`

---

## Responsabilidades

- **Revisión de Pull Requests:** Rotativo entre todos los miembros.
- **Gestión de releases:** `Fabio Sanchez`
- **Resolución de conflictos de merge:** `Anggy Ruiz`
