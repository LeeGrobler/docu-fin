import { pool } from "../db";
import type { Document, DocumentStatus } from "../types/Document";

function convertDocumentsToPublic(documents: Document[]) {
  return documents.map((document) => ({
    id: document.id,
    tenantId: document.tenant_id,
    identifier: document.identifier,
    title: document.title,
    status: document.status,
    createdAt: document.created_at,
    updatedAt: document.updated_at
  }))
}

export const documentService = {
  listDocumentsByTenantId: async (tenantId: string, search?: string) => {
    const documents = await pool.query<Document>(
      `
        SELECT id, tenant_id, identifier, title, status, created_at, updated_at
        FROM documents
        WHERE tenant_id = $1
          AND ($2::text IS NULL OR title ILIKE '%' || $2 || '%')
      `,
      [tenantId, search ?? null]
    )

    return convertDocumentsToPublic(documents.rows)
  },

  updateDocumentStatus: async (
    tenantId: string,
    documentId: string,
    newStatus: DocumentStatus
  ) => {
    const result = await pool.query<Document>(
      `
        UPDATE documents
        SET status = $1, updated_at = NOW()
        WHERE id = $2 AND tenant_id = $3
        RETURNING id, tenant_id, identifier, title, status, created_at, updated_at
      `,
      [newStatus, documentId, tenantId]
    )

    const updatedDocument = result.rows[0]
    return updatedDocument ? convertDocumentsToPublic([updatedDocument])[0] : undefined
  }
};
