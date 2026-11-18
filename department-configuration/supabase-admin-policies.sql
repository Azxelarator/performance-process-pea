-- ============================================================
-- RLS Write Policies สำหรับระบบ Admin Panel
-- รันใน Supabase SQL Editor หลังจากตั้งค่า Google OAuth เรียบร้อยแล้ว
-- ============================================================

-- 1. ให้สิทธิ์ INSERT/UPDATE/DELETE แก่ผู้ใช้ที่ล็อกอินแล้ว (authenticated role)
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- 2. Departments: ผู้ที่ล็อกอินแล้ว สามารถแก้ไขข้อมูลแผนกได้
CREATE POLICY "Authenticated users can insert departments"
  ON departments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update departments"
  ON departments FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete departments"
  ON departments FOR DELETE TO authenticated USING (true);

-- 3. Documents: ผู้ที่ล็อกอินแล้ว สามารถจัดการเอกสารได้
CREATE POLICY "Authenticated users can insert documents"
  ON documents FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update documents"
  ON documents FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete documents"
  ON documents FOR DELETE TO authenticated USING (true);

-- 4. Articles: ผู้ที่ล็อกอินแล้ว สามารถจัดการบทความได้
CREATE POLICY "Authenticated users can insert articles"
  ON articles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update articles"
  ON articles FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete articles"
  ON articles FOR DELETE TO authenticated USING (true);

-- 5. Announcements: ผู้ที่ล็อกอินแล้ว สามารถจัดการประกาศได้
CREATE POLICY "Authenticated users can insert announcements"
  ON announcements FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update announcements"
  ON announcements FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete announcements"
  ON announcements FOR DELETE TO authenticated USING (true);

-- 6. Staff: ผู้ที่ล็อกอินแล้ว สามารถจัดการข้อมูลบุคลากรได้
CREATE POLICY "Authenticated users can insert staff"
  ON staff FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update staff"
  ON staff FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete staff"
  ON staff FOR DELETE TO authenticated USING (true);

-- 7. User Permissions: ผู้ที่ล็อกอินแล้ว สามารถจัดการสิทธิ์ได้
CREATE POLICY "Authenticated users can insert user_permissions"
  ON user_permissions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update user_permissions"
  ON user_permissions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete user_permissions"
  ON user_permissions FOR DELETE TO authenticated USING (true);
