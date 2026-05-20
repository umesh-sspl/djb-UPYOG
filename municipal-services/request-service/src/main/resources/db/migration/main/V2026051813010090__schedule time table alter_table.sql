ALTER TABLE eg_fixed_point_time_table
ADD COLUMN IF NOT EXISTS fixed_point_name VARCHAR(255);

ALTER TABLE eg_fixed_point_time_table
ADD COLUMN IF NOT EXISTS fixed_point_id VARCHAR(255);

