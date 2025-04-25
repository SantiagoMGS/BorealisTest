import { Injectable, Scope } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

// Interfaz para el contexto de ejecución
export interface RequestContext {
  userId?: string;
  companyId?: string;
  roleId?: string;
}

@Injectable({ scope: Scope.DEFAULT })
export class RequestContextService {
  private readonly asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

  /**
   * Ejecuta una función dentro de un contexto específico
   * @param context Contexto de la solicitud (userId, companyId, roleId)
   * @param callback Función a ejecutar
   * @returns Resultado de la función
   */
  run<T>(context: RequestContext, callback: () => Promise<T>): Promise<T> {
    return this.asyncLocalStorage.run(context, callback);
  }

  /**
   * Obtiene el contexto actual
   * @returns Contexto de la solicitud o undefined si no hay contexto
   */
  getContext(): RequestContext | undefined {
    return this.asyncLocalStorage.getStore();
  }

  /**
   * Obtiene el ID de la compañía del contexto actual
   * @returns ID de la compañía o undefined
   */
  getCompanyId(): string | undefined {
    return this.getContext()?.companyId;
  }

  /**
   * Obtiene el ID del usuario del contexto actual
   * @returns ID del usuario o undefined
   */
  getUserId(): string | undefined {
    return this.getContext()?.userId;
  }

  /**
   * Obtiene el ID del rol del contexto actual
   * @returns ID del rol o undefined
   */
  getRoleId(): string | undefined {
    return this.getContext()?.roleId;
  }
}

// Variable global para acceder al contexto desde cualquier lugar
let requestContextProvider: RequestContextService | null = null;

/**
 * Establece el proveedor de contexto
 * @param provider Servicio de contexto
 */
export function setRequestContextProvider(provider: RequestContextService) {
  requestContextProvider = provider;
}

/**
 * Obtiene el ID de la compañía actual
 * @returns ID de la compañía o undefined
 */
export function getCurrentCompanyId(): string | undefined {
  return requestContextProvider?.getCompanyId();
}

/**
 * Obtiene el ID del usuario actual
 * @returns ID del usuario o undefined
 */
export function getCurrentUserId(): string | undefined {
  return requestContextProvider?.getUserId();
}

/**
 * Obtiene el ID del rol actual
 * @returns ID del rol o undefined
 */
export function getCurrentRoleId(): string | undefined {
  return requestContextProvider?.getRoleId();
}
