import { Prisma } from '@prisma/client';

type CompanySupplierSeed = {
  companyName: string;
  supplierName: string;
};

export const companySupplierInitialData: CompanySupplierSeed[] = [
  // QUINTANA - 12 proveedores en total
  { companyName: 'QUINTANA', supplierName: 'Minería Los Andes S.A.S' },
  {
    companyName: 'QUINTANA',
    supplierName: 'Carlos Pérez - Minero Independiente',
  },
  { companyName: 'QUINTANA', supplierName: 'Cooperativa Minera del Pacífico' },
  { companyName: 'QUINTANA', supplierName: 'Extracción Minerales del Cauca' },
  { companyName: 'QUINTANA', supplierName: 'Minerales del Valle S.A.S' },
  {
    companyName: 'QUINTANA',
    supplierName: 'Exportadora de Metales Preciosos Ltda.',
  },
  { companyName: 'QUINTANA', supplierName: 'Juan Martínez - Minero Artesanal' },
  { companyName: 'QUINTANA', supplierName: 'Asociación Minera del Chocó' },
  {
    companyName: 'QUINTANA',
    supplierName: 'Luisa Fernández - Joyería Artesanal',
  },
  {
    companyName: 'QUINTANA',
    supplierName: 'Pedro Ramírez - Comerciante de Oro',
  },

  // Proveedores compartidos entre QUINTANA y COLOMBIAN MINT (2)
  { companyName: 'QUINTANA', supplierName: 'Consorcio Minero Andino' },
  { companyName: 'QUINTANA', supplierName: 'Gold Mining International Corp.' },

  // COLOMBIAN MINT - 8 proveedores en total (incluyendo 2 compartidos con QUINTANA ya listados)
  { companyName: 'COLOMBIAN MINT', supplierName: 'Consorcio Minero Andino' }, // Compartido con QUINTANA
  {
    companyName: 'COLOMBIAN MINT',
    supplierName: 'Gold Mining International Corp.',
  }, // Compartido con QUINTANA
  { companyName: 'COLOMBIAN MINT', supplierName: 'Sofia Rodriguez - Joyería' },
  {
    companyName: 'COLOMBIAN MINT',
    supplierName: 'Ana Gómez - Artesanías en Oro',
  },
  { companyName: 'COLOMBIAN MINT', supplierName: 'Minerales del Caribe S.A.' },
  {
    companyName: 'COLOMBIAN MINT',
    supplierName: 'Cooperativa Minera de Antioquia',
  },

  // Proveedor compartido entre COLOMBIAN MINT y MONA MINAS (1)
  {
    companyName: 'COLOMBIAN MINT',
    supplierName: 'Inversiones Mineras del Sur',
  },

  // MONA MINAS - 5 proveedores en total
  { companyName: 'MONA MINAS', supplierName: 'Inversiones Mineras del Sur' }, // Compartido con COLOMBIAN MINT
  {
    companyName: 'MONA MINAS',
    supplierName: 'Diego Torres - Exportador Independiente',
  },
  { companyName: 'MONA MINAS', supplierName: 'Metales y Aleaciones S.A.S' },
  {
    companyName: 'MONA MINAS',
    supplierName: 'María Valencia - Procesadora de Minerales',
  },

  // Proveedor compartido entre MONA MINAS y QUINTANA (1)
  {
    companyName: 'MONA MINAS',
    supplierName: 'Juan Martínez - Minero Artesanal',
  }, // Compartido con QUINTANA
];
