import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IAuthUser } from '@domain/entities/auth';

/**
 * Decorador que extrae el usuario autenticado de la solicitud.
 * Opcionalmente, puede extraer una propiedad específica del usuario.
 *
 * @param property Propiedad opcional del usuario a extraer
 * @returns El usuario completo o la propiedad especificada
 *
 * @example
 * // Obtener el usuario completo
 * @CurrentUser() user: IAuthUser
 *
 * @example
 * // Obtener solo el ID del usuario
 * @CurrentUser('id') userId: string
 */
export const CurrentUser = createParamDecorator(
  (property: keyof IAuthUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as IAuthUser;

    return property ? user?.[property] : user;
  },
);
