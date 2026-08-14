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
    const documents = await pool.query<Document>(
      `
        SELECT * FROM documents
        WHERE tenant_id = $1
      `,
      [tenant_id]
    )

    console.log('documents: ', documents);

    return documents.rows
  }
};
