
CREATE UNIQUE INDEX uk_vehicle_mapping_vehicle
ON eg_vehicle_driver_mapping(vehicle_id);

CREATE UNIQUE INDEX uk_vehicle_driver
ON eg_vehicle_driver_mapping(driver_id);



