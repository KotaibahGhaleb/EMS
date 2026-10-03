-- Production schema for "Share Emergency Status with Relatives" (مسار)

CREATE TABLE emergency_sessions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id        UUID NOT NULL,
  hospital_id       UUID NOT NULL,
  status            VARCHAR(32) NOT NULL,
  current_step      VARCHAR(32) NOT NULL,
  room_number       VARCHAR(16),
  eta_minutes       INT,
  started_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at          TIMESTAMPTZ
);

CREATE TABLE emergency_share_sessions (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  emergency_session_id    UUID NOT NULL REFERENCES emergency_sessions(id) ON DELETE CASCADE,
  share_token             VARCHAR(64) NOT NULL UNIQUE,
  shared_with_phone       VARCHAR(32) NOT NULL,
  shared_with_phone_e164  VARCHAR(20) NOT NULL,
  patient_display_name    VARCHAR(120) NOT NULL,
  hospital_name           VARCHAR(200) NOT NULL,
  triage_status_label     VARCHAR(120) NOT NULL,
  current_step            VARCHAR(32) NOT NULL,
  patient_status          VARCHAR(32) NOT NULL,
  room_number             VARCHAR(16),
  eta_minutes             INT NOT NULL DEFAULT 0,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at              TIMESTAMPTZ NOT NULL,
  revoked_at              TIMESTAMPTZ,
  last_synced_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_emergency_share_token ON emergency_share_sessions (share_token);
CREATE INDEX idx_emergency_share_expires ON emergency_share_sessions (expires_at);
CREATE INDEX idx_emergency_share_phone ON emergency_share_sessions (shared_with_phone_e164);

CREATE TABLE emergency_patient_consent_audit (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  emergency_session_id    UUID NOT NULL REFERENCES emergency_sessions(id) ON DELETE CASCADE,
  consented_at            TIMESTAMPTZ NOT NULL,
  policy_version          VARCHAR(32) NOT NULL,
  purpose                 VARCHAR(32) NOT NULL DEFAULT 'patient_ed_share',
  user_agent              TEXT,
  ip_address              INET,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_patient_consent_audit_session ON emergency_patient_consent_audit (emergency_session_id);

CREATE TABLE emergency_share_notifications (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_session_id      UUID NOT NULL REFERENCES emergency_share_sessions(id) ON DELETE CASCADE,
  channel               VARCHAR(16) NOT NULL CHECK (channel IN ('sms', 'whatsapp')),
  provider              VARCHAR(32),
  provider_message_id   VARCHAR(128),
  sent_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  status                VARCHAR(16) NOT NULL DEFAULT 'sent'
);
