-- =====================================================================================
-- ⚠️ INSTRUCTIONS:
-- 1. Go to your Supabase Dashboard > SQL Editor.
-- 2. Paste the content of this file and click "Run".
-- 3. This will create the Schema "House-Management" and all necessary tables.
-- 4. IT WILL ALSO RESET THE USERS TABLE to default 'popa' user.
-- =====================================================================================

-- 1. Create the custom Schema
CREATE SCHEMA IF NOT EXISTS "House-Management";

-- 2. Create Tables within the Schema

-- Table: Users
CREATE TABLE IF NOT EXISTS "House-Management"."Users" (
    "id" text PRIMARY KEY,
    "username" text NOT NULL,
    "password" text,
    "role" text,
    "name" text,
    "created_at" timestamp with time zone DEFAULT now()
);

-- Table: Buildings
CREATE TABLE IF NOT EXISTS "House-Management"."Buildings" (
    "id" text PRIMARY KEY,
    "name" text,
    "created_at" timestamp with time zone DEFAULT now()
);

-- Table: Floors
CREATE TABLE IF NOT EXISTS "House-Management"."Floors" (
    "id" text PRIMARY KEY,
    "number" integer,
    "name" text,
    "buildingId" text REFERENCES "House-Management"."Buildings"("id") ON DELETE CASCADE,
    "created_at" timestamp with time zone DEFAULT now()
);

-- Table: Rooms
CREATE TABLE IF NOT EXISTS "House-Management"."Rooms" (
    "id" text PRIMARY KEY,
    "number" text,
    "type" text,
    "floorId" text REFERENCES "House-Management"."Floors"("id") ON DELETE CASCADE,
    "created_at" timestamp with time zone DEFAULT now()
);

-- Table: Residents
CREATE TABLE IF NOT EXISTS "House-Management"."Residents" (
    "id" text PRIMARY KEY,
    "name" text,
    "roomId" text REFERENCES "House-Management"."Rooms"("id") ON DELETE SET NULL,
    "roomNumber" text,
    "created_at" timestamp with time zone DEFAULT now()
);

-- Table: Bills
CREATE TABLE IF NOT EXISTS "House-Management"."Bills" (
    "id" text PRIMARY KEY,
    "roomId" text REFERENCES "House-Management"."Rooms"("id") ON DELETE CASCADE,
    "roomNumber" text,
    "month" text,
    "waterUnits" numeric DEFAULT 0,
    "waterPrice" numeric DEFAULT 0,
    "electricityUnits" numeric DEFAULT 0,
    "electricityPrice" numeric DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT now()
);

-- 3. (Optional) Enable RLS (Row Level Security) if you want to restrict access
-- For this setup, we will allow public access (service role/anon key) to keep it simple as per request.
-- But we ensure RLS is enabled on tables to follow best practices, 
-- and add a policy to allow all operations for now.

ALTER TABLE "House-Management"."Users" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for all users" ON "House-Management"."Users" FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE "House-Management"."Buildings" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for all users" ON "House-Management"."Buildings" FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE "House-Management"."Floors" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for all users" ON "House-Management"."Floors" FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE "House-Management"."Rooms" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for all users" ON "House-Management"."Rooms" FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE "House-Management"."Residents" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for all users" ON "House-Management"."Residents" FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE "House-Management"."Bills" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for all users" ON "House-Management"."Bills" FOR ALL USING (true) WITH CHECK (true);

-- 4. Grant Usage on Schema to anon and service_role
GRANT USAGE ON SCHEMA "House-Management" TO anon, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA "House-Management" TO anon, service_role;

-- 5. RESET USERS (Added per request)
TRUNCATE TABLE "House-Management"."Users";

INSERT INTO "House-Management"."Users" (id, username, password, role, name)
VALUES 
('admin-popa', 'popa', 'popa', 'ADMIN', 'ผู้ดูแลระบบสูงสุด');
