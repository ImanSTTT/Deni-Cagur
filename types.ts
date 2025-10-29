export enum RequestStatus {
  Fulfilled = 'Terpenuhi',
  Pending = 'Belum',
}

export enum EvidenceValidity {
  Valid = 'Valid',
  NeedsImprovement = 'Perlu Perbaikan',
}

export interface AuditProject {
  id: string;
  name: string;
}

export interface Permintaan {
  id: string;
  tanggal: string;
  unit: string;
  deskripsi: string;
  tenggat: string;
  waktu?: string;
  pic: string;
  auditProjectId: string;
  buktiTerkait: string[];
  status: RequestStatus;
  pemenuhan?: string;
}

export interface Bukti {
  id: string;
  kategori: string;
  deskripsi: string;
  link: string;
  unit: string;
  pic: string;
  tglDiterima: string;
  validitas: EvidenceValidity;
  catatan: string;
  prmTerkait?: string;
  filename?: string;
}