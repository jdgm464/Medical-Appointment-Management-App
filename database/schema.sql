-- Esquema PostgreSQL para turnos médicos

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE appointment_status AS ENUM (
  'scheduled',
  'checked_in',
  'in_service',
  'completed',
  'no_show',
  'cancelled'
);

CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name VARCHAR(120) NOT NULL,
  phone VARCHAR(40) NOT NULL,
  email VARCHAR(160) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  reason TEXT NOT NULL,
  status appointment_status NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  queue_number INTEGER
);

CREATE INDEX IF NOT EXISTS appointments_date_idx ON appointments (date);
CREATE INDEX IF NOT EXISTS appointments_status_idx ON appointments (status);
