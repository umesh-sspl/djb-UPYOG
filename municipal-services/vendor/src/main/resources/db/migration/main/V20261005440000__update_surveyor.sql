-- Add to eg_surveyor a new column supervisor_id to store the ID of the supervisor for each surveyor. This will allow us to link surveyors to their supervisors and enable better management and reporting of surveyor activities.
ALTER TABLE eg_surveyor
    ADD COLUMN IF NOT EXISTS supervisor_id CHARACTER VARYING(256);

CREATE INDEX idx_surveyor_supervisor ON eg_surveyor(supervisor_id);