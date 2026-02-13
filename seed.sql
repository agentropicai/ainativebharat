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
   '[{"name": "Life OS", "description": "Processes conversations, extracts tasks"}, {"name": "Code Agent", "description": "Autonomous development agent"}, {"name": "Watcher", "description": "Monitors Gmail + WhatsApp, pushes alerts"}]',
   NULL, 0, true);

-- Generation 1 (enabled by Ashish)
INSERT INTO founders (id, name, company, city, agents, mentor_id, generation, verified) VALUES
  ('00000000-0000-0000-0000-000000000002', 'Rahul', 'FinStack', 'Mumbai',
   '[{"name": "GST Invoice Agent", "description": "Auto-generates GST invoices from orders"}, {"name": "Reconciliation Bot", "description": "Matches bank statements to invoices"}, {"name": "Compliance Checker", "description": "Flags regulatory issues in filings"}]',
   '00000000-0000-0000-0000-000000000001', 1, true),

  ('00000000-0000-0000-0000-000000000003', 'Priya', 'ShopEasy', 'Delhi',
   '[{"name": "Inventory Tracker", "description": "Monitors stock levels across warehouses"}, {"name": "Customer Support Bot", "description": "Handles L1 support queries"}, {"name": "Returns Processor", "description": "Auto-processes return requests"}]',
   '00000000-0000-0000-0000-000000000001', 1, true),

  ('00000000-0000-0000-0000-000000000004', 'Vikram', 'BuildRight', 'Pune',
   '[{"name": "Site Monitor", "description": "Tracks construction progress via photos"}, {"name": "Material Estimator", "description": "Estimates material needs from blueprints"}, {"name": "Vendor Coordinator", "description": "Manages vendor communications"}]',
   '00000000-0000-0000-0000-000000000001', 1, true);

-- Generation 2 (enabled by Gen 1)
INSERT INTO founders (id, name, company, city, agents, mentor_id, generation, verified) VALUES
  ('00000000-0000-0000-0000-000000000005', 'Ananya', 'EduBridge', 'Hyderabad',
   '[{"name": "Curriculum Builder", "description": "Generates personalized learning paths"}, {"name": "Assessment Grader", "description": "Auto-grades subjective answers"}, {"name": "Parent Updater", "description": "Sends weekly progress to parents"}]',
   '00000000-0000-0000-0000-000000000002', 2, true),

  ('00000000-0000-0000-0000-000000000006', 'Karthik', 'AgriTech Solutions', 'Chennai',
   '[{"name": "Crop Advisor", "description": "Recommends crops based on soil data"}, {"name": "Market Price Tracker", "description": "Tracks mandi prices in real-time"}, {"name": "Weather Alert Agent", "description": "Pushes weather warnings to farmers"}]',
   '00000000-0000-0000-0000-000000000002', 2, true),

  ('00000000-0000-0000-0000-000000000007', 'Meera', 'HealthFirst', 'Bangalore',
   '[{"name": "Appointment Scheduler", "description": "Manages doctor appointments + reminders"}, {"name": "Lab Report Analyzer", "description": "Summarizes lab reports for patients"}, {"name": "Follow-up Agent", "description": "Ensures post-visit care compliance"}]',
   '00000000-0000-0000-0000-000000000003', 2, true),

  ('00000000-0000-0000-0000-000000000008', 'Arjun', 'LegalEase', 'Mumbai',
   '[{"name": "Contract Reviewer", "description": "Flags risky clauses in contracts"}, {"name": "Case Research Bot", "description": "Finds relevant case law"}, {"name": "Filing Deadline Tracker", "description": "Tracks court filing deadlines"}]',
   '00000000-0000-0000-0000-000000000003', 2, true),

  ('00000000-0000-0000-0000-000000000009', 'Sneha', 'TravelKaro', 'Jaipur',
   '[{"name": "Itinerary Planner", "description": "Creates custom travel itineraries"}, {"name": "Price Watcher", "description": "Monitors flight + hotel prices"}, {"name": "Review Aggregator", "description": "Summarizes hotel reviews"}]',
   '00000000-0000-0000-0000-000000000004', 2, true),

  ('00000000-0000-0000-0000-000000000010', 'Deepak', 'FoodChain', 'Ahmedabad',
   '[{"name": "Order Optimizer", "description": "Batches and routes delivery orders"}, {"name": "Menu Pricer", "description": "Dynamic pricing based on demand"}, {"name": "Quality Checker", "description": "Monitors food quality ratings"}]',
   '00000000-0000-0000-0000-000000000004', 2, true);

-- Generation 3 (enabled by Gen 2)
INSERT INTO founders (id, name, company, city, agents, mentor_id, generation, verified) VALUES
  ('00000000-0000-0000-0000-000000000011', 'Riya', 'StyleBox', 'Delhi',
   '[{"name": "Trend Spotter", "description": "Identifies fashion trends from social media"}, {"name": "Size Recommender", "description": "Predicts customer sizes from data"}, {"name": "Restock Alert", "description": "Alerts when bestsellers run low"}]',
   '00000000-0000-0000-0000-000000000005', 3, true),

  ('00000000-0000-0000-0000-000000000012', 'Nikhil', 'PropTech India', 'Gurgaon',
   '[{"name": "Lead Qualifier", "description": "Scores and qualifies property leads"}, {"name": "Virtual Tour Agent", "description": "Schedules and follows up on tours"}, {"name": "Document Collector", "description": "Gathers buyer documents automatically"}]',
   '00000000-0000-0000-0000-000000000005', 3, true),

  ('00000000-0000-0000-0000-000000000013', 'Kavya', 'MediaMint', 'Bangalore',
   '[{"name": "Content Calendar", "description": "Plans social media content weekly"}, {"name": "Analytics Reporter", "description": "Generates performance reports"}, {"name": "Hashtag Optimizer", "description": "Suggests optimal hashtags per post"}]',
   '00000000-0000-0000-0000-000000000006', 3, true),

  ('00000000-0000-0000-0000-000000000014', 'Suresh', 'FleetManage', 'Coimbatore',
   '[{"name": "Route Optimizer", "description": "Calculates most efficient delivery routes"}, {"name": "Driver Tracker", "description": "Monitors driver locations + ETA"}, {"name": "Fuel Monitor", "description": "Tracks fuel consumption anomalies"}]',
   '00000000-0000-0000-0000-000000000006', 3, true),

  ('00000000-0000-0000-0000-000000000015', 'Pooja', 'HRFlow', 'Pune',
   '[{"name": "Resume Screener", "description": "Shortlists candidates from applications"}, {"name": "Onboarding Bot", "description": "Guides new hires through onboarding"}, {"name": "Leave Manager", "description": "Processes leave requests automatically"}]',
   '00000000-0000-0000-0000-000000000007', 3, true),

  ('00000000-0000-0000-0000-000000000016', 'Amit', 'PayFlow', 'Hyderabad',
   '[{"name": "Invoice Chaser", "description": "Follows up on overdue invoices"}, {"name": "Expense Categorizer", "description": "Auto-categorizes business expenses"}, {"name": "Cash Flow Predictor", "description": "Forecasts cash flow weekly"}]',
   '00000000-0000-0000-0000-000000000007', 3, true),

  ('00000000-0000-0000-0000-000000000017', 'Divya', 'GreenEnergy', 'Chennai',
   '[{"name": "Solar Calculator", "description": "Estimates solar savings for leads"}, {"name": "Installation Scheduler", "description": "Manages installation timelines"}, {"name": "Maintenance Alerter", "description": "Monitors panel performance"}]',
   '00000000-0000-0000-0000-000000000008', 3, true),

  ('00000000-0000-0000-0000-000000000018', 'Rohan', 'CloudKitchen', 'Mumbai',
   '[{"name": "Demand Forecaster", "description": "Predicts daily order volumes"}, {"name": "Supplier Orderer", "description": "Auto-orders from suppliers"}, {"name": "Waste Tracker", "description": "Minimizes food waste with data"}]',
   '00000000-0000-0000-0000-000000000009', 3, true),

  ('00000000-0000-0000-0000-000000000019', 'Lakshmi', 'TextileTech', 'Surat',
   '[{"name": "Design Generator", "description": "Creates textile patterns from trends"}, {"name": "Order Tracker", "description": "Tracks bulk order status"}, {"name": "Quality Inspector", "description": "Flags defects in production"}]',
   '00000000-0000-0000-0000-000000000009', 3, true),

  ('00000000-0000-0000-0000-000000000020', 'Sanjay', 'PharmAssist', 'Lucknow',
   '[{"name": "Prescription Validator", "description": "Checks drug interactions"}, {"name": "Stock Manager", "description": "Manages medicine inventory + expiry"}, {"name": "Delivery Coordinator", "description": "Manages medicine delivery logistics"}]',
   '00000000-0000-0000-0000-000000000010', 3, true);
