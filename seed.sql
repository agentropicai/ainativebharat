-- AI Native Bharat — Seed Data
-- Run this against your Supabase database after creating the founders table

-- Schema
CREATE TABLE IF NOT EXISTS founders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  city TEXT,
  agents JSONB DEFAULT '[]',
  mentor_id UUID REFERENCES founders(id),
  generation INT DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_founders_mentor ON founders(mentor_id);
CREATE INDEX IF NOT EXISTS idx_founders_verified ON founders(verified);

-- Use fixed UUIDs so mentor_id references work
-- Generation 0 (Root)
INSERT INTO founders (id, name, company, city, agents, mentor_id, generation, verified) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Ashish', 'Agentropic', 'Bangalore',
   '[{"name": "Life OS", "description": "Processes conversations, extracts tasks and follow-ups"}, {"name": "Code Agent", "description": "Autonomous development agent that ships features end-to-end"}, {"name": "Watcher", "description": "Monitors Gmail + WhatsApp, pushes important items proactively"}]',
   NULL, 0, true);

-- Generation 1 (enabled by Ashish)
INSERT INTO founders (id, name, company, city, agents, mentor_id, generation, verified) VALUES
  ('00000000-0000-0000-0000-000000000002', 'Pratik', 'Accel', 'Bangalore',
   '[{"name": "Pitch Tuning", "description": "AI agent that gives feedback on startup pitches"}, {"name": "Gmail Automation", "description": "Triages and drafts responses to email automatically"}, {"name": "Personal Assistant", "description": "Manages schedule, tasks, and communications"}]',
   '00000000-0000-0000-0000-000000000001', 1, true);
