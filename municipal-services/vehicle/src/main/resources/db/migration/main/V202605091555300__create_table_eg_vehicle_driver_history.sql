

CREATE TABLE IF NOT EXISTS eg_vehicle_driver_history (
    id varchar(64),
    vehicle_id varchar(64),
    driver_id varchar(64),
    status varchar(64),
    createdby varchar(64),
    createdtime bigint,
    lastmodifiedby varchar(64),
    lastmodifiedtime bigint
);


CREATE INDEX index_id_eg_vehicle_driver_history ON eg_vehicle_driver_history
(id);

CREATE INDEX index_vehicle_id_eg_vehicle_driver_history ON eg_vehicle_driver_history
(vehicle_id);

CREATE INDEX index_driver_id_eg_vehicle_driver_history ON eg_vehicle_driver_history
(driver_id);
