export interface IAnalysisEntity {
  sampleId: string;
  analysisDate: Date;
  resultValue: ResultValueDH | ResultValueXRF[] | ResultValueLW | ResultValueAA;
  analysisTypeId?: string;
}

export interface ResultValueDH {
  dryWeight: number;
}

export interface ResultValueXRF {
  readingNo: string;
  time: Date;
  type: string;
  duration: string;
  units: string;
  sequence: string;
  res: string;
  eScale: string;
  shapeTime: string;
  sample: string;
  location: string;
  inspector: string;
  misc: string;
  note: string;
  flags: string;
  mo: string;
  moError: string;
  zr: string;
  zrError: string;
  sr: string;
  srError: string;
  u: string;
  uError: string;
  rb: string;
  rbError: string;
  th: string;
  thError: string;
  pb: string;
  pbError: string;
  au: string;
  auError: string;
  se: string;
  seError: string;
  as: string;
  asError: string;
  hg: string;
  hgError: string;
  zn: string;
  znError: string;
  w: string;
  wError: string;
  cu: string;
  cuError: string;
  ni: string;
  niError: string;
  co: string;
  coError: string;
  fe: string;
  feError: string;
  mn: string;
  mnError: string;
  sb: string;
  sbError: string;
  sn: string;
  snError: string;
  cd: string;
  cdError: string;
  pd: string;
  pdError: string;
  ag: string;
  agError: string;
  bal: string;
  balError: string;
  nb: string;
  nbError: string;
  bi: string;
  biError: string;
  re: string;
  reError: string;
  ta: string;
  taError: string;
  hf: string;
  hfError: string;
  cr: string;
  crError: string;
  v: string;
  vError: string;
  ti: string;
  tiError: string;
  sc: string;
  scError: string;
  ca: string;
  caError: string;
  k: string;
  kError: string;
  s: string;
  sError: string;
  ba: string;
  baError: string;
  te: string;
  teError: string;
  al: string;
  alError: string;
  p: string;
  pError: string;
  si: string;
  siError: string;
  cl: string;
  clError: string;
  mg: string;
  mgError: string;
}

export interface ResultValueLW {
  time: number;
  endDateTime?: Date;
}

export interface ResultValueAA {
  status: string;
  dataset: string;
  method: string;
  au: string;
}
