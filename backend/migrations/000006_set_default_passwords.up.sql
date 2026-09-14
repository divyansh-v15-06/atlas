-- Migration: Set default passwords for deployment
-- Admin: admin*123
-- All faculty accounts: fac*123

-- Update default admin user password
UPDATE users 
SET password_hash = '$2a$10$geepfLXbBOnpFmUh0FUqY.ozUtdj6B4y/G5N7qA59MeoUL2L0Rzoe'
WHERE email = 'admin@nith.ac.in';

-- Update all faculty accounts
UPDATE users 
SET password_hash = '$2a$10$NkXIIu/dHZsBCyE4TsgJcOSrzctmqz00qwXSIhW6mmmrvKeUaI7GC'
WHERE email != 'admin@nith.ac.in';

