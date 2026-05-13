-- =========================================
-- SUPERVISOR TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS eg_supervisor (
                               id                  CHARACTER VARYING(256) PRIMARY KEY,
                               name                CHARACTER VARYING(128),
                               tenantid            CHARACTER VARYING(64)  NOT NULL,
                               vendor_id           CHARACTER VARYING(256) NOT NULL,
                               mobile_no           CHARACTER VARYING(20)  NOT NULL,
                               assigned_zone_id    CHARACTER VARYING(64),
                               additionaldetails   JSONB,
                               owner_id            CHARACTER VARYING(64)  NOT NULL,
                               description         CHARACTER VARYING(256),
                               status              CHARACTER VARYING(64)  NOT NULL,
                               createdby           CHARACTER VARYING(64)  NOT NULL,
                               lastmodifiedby      CHARACTER VARYING(64),
                               createdtime         BIGINT                 NOT NULL,
                               lastmodifiedtime    BIGINT
);

ALTER TABLE eg_supervisor
    ADD CONSTRAINT uq_eg_supervisor_mobile_tenant UNIQUE (mobile_no, tenantid);

CREATE INDEX idx_supervisor_tenant ON eg_supervisor(tenantid);
CREATE INDEX idx_supervisor_vendor ON eg_supervisor(vendor_id);
CREATE INDEX idx_supervisor_mobile ON eg_supervisor(mobile_no);
CREATE INDEX idx_supervisor_status ON eg_supervisor(status);
CREATE INDEX idx_supervisor_zone   ON eg_supervisor(assigned_zone_id);
CREATE INDEX idx_supervisor_owner  ON eg_supervisor(owner_id);

-- =========================================
-- SURVEYOR TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS eg_surveyor (
                             id                  CHARACTER VARYING(256) PRIMARY KEY,
                             name                CHARACTER VARYING(128),
                             tenantid            CHARACTER VARYING(64)  NOT NULL,
                             vendor_id           CHARACTER VARYING(256) NOT NULL,
                             mobile_no           CHARACTER VARYING(20)  NOT NULL,
                             additionaldetails   JSONB,
                             owner_id            CHARACTER VARYING(64)  NOT NULL,
                             description         CHARACTER VARYING(256),
                             status              CHARACTER VARYING(64)  NOT NULL,
                             createdby           CHARACTER VARYING(64)  NOT NULL,
                             lastmodifiedby      CHARACTER VARYING(64),
                             createdtime         BIGINT                 NOT NULL,
                             lastmodifiedtime    BIGINT
);

ALTER TABLE eg_surveyor
    ADD CONSTRAINT uq_eg_surveyor_mobile_tenant UNIQUE (mobile_no, tenantid);

CREATE INDEX idx_surveyor_tenant ON eg_surveyor(tenantid);
CREATE INDEX idx_surveyor_vendor ON eg_surveyor(vendor_id);
CREATE INDEX idx_surveyor_mobile ON eg_surveyor(mobile_no);
CREATE INDEX idx_surveyor_status ON eg_surveyor(status);
CREATE INDEX idx_surveyor_owner  ON eg_surveyor(owner_id);

-- =========================================
-- TEAM MAPPING
-- =========================================
CREATE TABLE IF NOT EXISTS eg_vendor_team_mapping (
                                        id               CHARACTER VARYING(256) PRIMARY KEY,
                                        tenantid         CHARACTER VARYING(64)  NOT NULL,
                                        vendor_id        CHARACTER VARYING(256) NOT NULL,
                                        supervisor_id    CHARACTER VARYING(256) NOT NULL,
                                        surveyor_id      CHARACTER VARYING(256) NOT NULL,
                                        status           CHARACTER VARYING(64)  NOT NULL,
                                        createdby        CHARACTER VARYING(64)  NOT NULL,
                                        lastmodifiedby   CHARACTER VARYING(64),
                                        createdtime      BIGINT                 NOT NULL,
                                        lastmodifiedtime BIGINT,
                                        CONSTRAINT fk_team_supervisor FOREIGN KEY (supervisor_id) REFERENCES eg_supervisor(id),
                                        CONSTRAINT fk_team_surveyor   FOREIGN KEY (surveyor_id)   REFERENCES eg_surveyor(id)
);

CREATE UNIQUE INDEX uq_active_team_mapping
    ON eg_vendor_team_mapping(supervisor_id, surveyor_id)
    WHERE status = 'ACTIVE';

CREATE INDEX idx_team_tenant     ON eg_vendor_team_mapping(tenantid);
CREATE INDEX idx_team_vendor     ON eg_vendor_team_mapping(vendor_id);
CREATE INDEX idx_team_supervisor ON eg_vendor_team_mapping(supervisor_id);
CREATE INDEX idx_team_surveyor   ON eg_vendor_team_mapping(surveyor_id);
CREATE INDEX idx_team_status     ON eg_vendor_team_mapping(status);

-- =========================================
-- VENDOR ENHANCEMENT
-- =========================================
ALTER TABLE eg_vendor
    ADD COLUMN IF NOT EXISTS zone_ids            JSONB,
    ADD COLUMN IF NOT EXISTS cluster_ids         JSONB,
    ADD COLUMN IF NOT EXISTS contract_start_date BIGINT,
    ADD COLUMN IF NOT EXISTS contract_end_date   BIGINT;