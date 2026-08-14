import { pool } from "../db";

export type Document = {
  id: string;
  tenant_id: string;
  identifier: string;
  title: string;
  status: 'draft' | 'awaiting_signature' | 'signed';
  created_at: Date;
  updated_at: Date;
};

export const documentService = {
  listDocumentsByTenantId: async (tenant_id: string) => {
    const documentPromise = await pool.query<Document>(
      `
        SELECT * FROM documents
        WHERE tenant_id = $1
      `,
      [tenant_id]
    )

    const documents = documentPromise.rows.map((document) => ({
      id: document.id,
      tenantId: document.tenant_id,
      identifier: document.identifier,
      title: document.title,
      status: document.status,
      createdAt: document.created_at,
      updatedAt: document.updated_at
    }))

    return documents
  }
};
