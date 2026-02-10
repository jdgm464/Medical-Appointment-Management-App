-- Datos de ejemplo para importar

INSERT INTO appointments (
  id,
  patient_name,
  phone,
  email,
  date,
  time,
  reason,
  status,
  created_at,
  queue_number
) VALUES
  (
    '6b2f1e90-8fcb-4a47-8f5a-1f2db3f02e3e',
    'Ana Pérez',
    '11-5555-1234',
    'ana.perez@example.com',
    CURRENT_DATE,
    '09:30',
    'Consulta clínica',
    'scheduled',
    NOW() - INTERVAL '2 hours',
    NULL
  ),
  (
    'c9f7c4b6-8b2a-4f4a-8f42-65b3a3b4f8d8',
    'Juan Gómez',
    '11-5555-5678',
    'juan.gomez@example.com',
    CURRENT_DATE,
    '10:00',
    'Control pediátrico',
    'checked_in',
    NOW() - INTERVAL '90 minutes',
    1
  ),
  (
    '1a3b2c7a-4b5e-4a6d-9b2a-0d33f1a0c7aa',
    'Lucía Fernández',
    '11-5555-9012',
    'lucia.fernandez@example.com',
    CURRENT_DATE,
    '10:30',
    'Dermatología',
    'in_service',
    NOW() - INTERVAL '60 minutes',
    2
  ),
  (
    'ea3b0ed7-0ef5-4b1e-9b1c-23e2a32cc1d2',
    'Marcos Díaz',
    '11-5555-3456',
    'marcos.diaz@example.com',
    CURRENT_DATE,
    '11:00',
    'Odontología',
    'completed',
    NOW() - INTERVAL '3 hours',
    NULL
  ),
  (
    '9c8c9f44-2b2c-4f3d-9b9e-5a7b1b8e9a10',
    'Sofía Núñez',
    '11-5555-7890',
    'sofia.nunez@example.com',
    CURRENT_DATE,
    '11:30',
    'Cardiología',
    'no_show',
    NOW() - INTERVAL '4 hours',
    NULL
  );
