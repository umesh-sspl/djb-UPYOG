ALTER TABLE eg_vendor_auditlog
    ADD COLUMN IF NOT EXISTS zone_ids            JSONB,
    ADD COLUMN IF NOT EXISTS cluster_ids         JSONB,
    ADD COLUMN IF NOT EXISTS contract_start_date BIGINT,
    ADD COLUMN IF NOT EXISTS contract_end_date   BIGINT;

