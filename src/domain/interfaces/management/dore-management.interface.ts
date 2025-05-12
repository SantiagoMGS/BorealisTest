export interface IDoreDropdownData {
  suppliers: ISupplier[];
  dores: IDore[];
  batchNumbers: string[];
  receptionOrigins: IReceptionOrigin[];
}
export interface ISupplier {
  id: string;
  name: string;
}

export interface IDore {
  id: string;
  code: number;
}

export interface IReceptionOrigin {
  id: string;
  name: string;
}

/**
 * Interfaz para la respuesta de operaciones con gestión de dorés
 */
export interface IDoreManagementResponse {
  id: string;
  batchNumber: string | null;
  receptionDate: Date;
  observation: string | null;
  dore: Array<{
    id: string;
    code: number;
    receivedWeight: number | any; // Usando any para compatibilidad con Decimal de Prisma
    status: {
      id: string;
      name: string;
    };
  }>;
  supplier: {
    id: string;
    name: string;
  };
  receptionOrigin: {
    id: string;
    name: string;
  };
}
