export const DOCUMENT_STATUSES = ['draft', 'awaiting_signature', 'signed'] as const;

export type DocumentStatus = (typeof DOCUMENT_STATUSES)[number];

export type Document = {
  id: string;
  tenant_id: string;
  identifier: string;
  title: string;
  status: DocumentStatus;
  created_at: Date;
  updated_at: Date;
};

export function isDocumentStatus(value: unknown): value is DocumentStatus {
  return typeof value === 'string' && DOCUMENT_STATUSES.includes(value as DocumentStatus);
}