
DROP INDEX IF EXISTS uk_active_vehicle;
DROP INDEX IF EXISTS uk_active_driver;


CREATE UNIQUE INDEX uk_active_vehicle
ON eg_vehicle_driver_mapping(vehicle_id)
WHERE status = 'ACTIVE';


CREATE UNIQUE INDEX uk_active_driver
ON eg_vehicle_driver_mapping(driver_id)
WHERE status = 'ACTIVE';

