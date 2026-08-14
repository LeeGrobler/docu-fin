
INSERT INTO tenants (name)
VALUES ('Acme Finance');

INSERT INTO users (tenant_id, email, password_hash)
VALUES (
  (SELECT id FROM tenants WHERE name = 'Acme Finance'),
  'admin@acme-finance.test',
  '<hash_goes_here>'
);

INSERT INTO documents (tenant_id, identifier, title, status)
VALUES
  (
    (SELECT id FROM tenants WHERE name = 'Acme Finance'),
    'DOC-2026-0001',
    'Sample Funding Agreement',
    'draft'
  ),
  (
    (SELECT id FROM tenants WHERE name = 'Acme Finance'),
    'DOC-2026-0002',
    'Quarterly Tax Pack',
    'awaiting_signature'
  ),
  (
    (SELECT id FROM tenants WHERE name = 'Acme Finance'),
    'DOC-2026-0003',
    'Signed Audit Representation Letter',
    'signed'
  );
