ALTER TABLE upyog_rs_water_tanker_booking_details
ADD COLUMN IF NOT EXISTS application_type VARCHAR(255);


ALTER TABLE upyog_rs_water_tanker_booking_details_auditdetails
ADD COLUMN IF NOT EXISTS application_type VARCHAR(255);


