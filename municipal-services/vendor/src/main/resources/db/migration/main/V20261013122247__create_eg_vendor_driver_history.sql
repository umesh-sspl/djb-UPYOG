CREATE TABLE IF NOT EXISTS eg_vendor_driver_history
(
    id character varying(64) NOT NULL,

    vendor_id character varying(64),

    driver_id character varying(64),

    vendordriverstatus character varying(64),

    createdby character varying(64),

    createdtime bigint,

    lastmodifiedby character varying(64),

    lastmodifiedtime bigint,

    CONSTRAINT eg_vendor_driver_history_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_vendor_driver_history_vendor
ON eg_vendor_driver_history(vendor_id);

CREATE INDEX IF NOT EXISTS idx_vendor_driver_history_driver
ON eg_vendor_driver_history(driver_id);
