-- Existing accounts have no recoverable plaintext password. After this migration,
-- require affected users to reset their password before they can sign in.
-- The columns remain nullable only to preserve those existing accounts; all newly
-- registered victim and counselor accounts receive a non-null scrypt hash.
ALTER TABLE victims ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
ALTER TABLE counselors ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
