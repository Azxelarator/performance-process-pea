# UPDATE & BACKLOG PLAN

สรุปสถานะการอัปเดตระบบและการพัฒนาฟีเจอร์เพิ่มเติมสำหรับโปรเจกต์ `performance-process-pea`

## Status & Architecture Updates (อัปเดตล่าสุด)
- **Deployment Status**: ย้ายระบบขึ้นออนไลน์บน **Firebase Hosting** (`https://performance-process-pea-9a2c.web.app`) ทำงานในรูปแบบ JAMstack / Serverless 100%
- **Database & Auth**: เชื่อมต่อ **Cloud Firestore** และ **Firebase Authentication (Google Sign-In)** เรียบร้อยแล้ว พร้อมระบบนำเข้าข้อมูลตั้งต้น (Mock Data Seed)
- **Security & RBAC**: บังคับใช้ `firestore.rules` คัดกรองสิทธิ์ผ่าน Collection `users` (`super_admin` / `editor`) พร้อมระบบป้องกัน XSS (`escapeHtml`, `sanitizeUrl`) ใน `renderer.js`

## Planned Features (แผนการพัฒนาฟีเจอร์ในอนาคต)

### 1. แผนผังโครงสร้างบุคลากรและบทบาทหน้าที่ (Org Chart & Staff Roles)
- **เป้าหมาย**: แสดงตำแหน่งงานของเจ้าพนักงานเพื่อระบุว่าใครทำหน้าที่อะไร มีบทบาทอย่างไร และส่งผลกระทบ/เชื่อมโยงต่อกระบวนการทำงานของแผนกอย่างไร
- **ขอบเขตการทำงาน**:
  - แผนผังแสดงความเชื่อมโยงสายงาน (Visual Org Chart / Relationship Node) ประจำแต่ละแผนก
  - การ์ดข้อมูลบุคลากรรายบุคคล (รูปภาพ, ชื่อ-นามสกุล, ตำแหน่ง, หน้าที่รับผิดชอบ, ข้อมูลติดต่อ Contact)
  - แท็บจัดการข้อมูลบุคลากรในหน้าแอดมิน (`admin.html`) ให้แอดมินประจำแผนกสามารถเพิ่ม/แก้ไข/ลบเจ้าหน้าที่ได้

### 2. ระบบประกาศส่วนกลางและการจัดวางตำแหน่ง (Global Announcements & Banner)
- **เป้าหมาย**: ให้ข่าวสารและประกาศจากทุกแผนกกระจายถึงกันอย่างทั่วถึง เพื่อให้แผนกอื่นสามารถนำข้อมูลไปวางแผนงานของตนเองได้
- **ขอบเขตการทำงาน**:
  - ปรับตำแหน่งการแสดงผลประกาศให้อยู่ในตำแหน่งส่วนบน (Top Priority Banner) ของหน้าเว็บหลักเพื่อเพิ่มความโดดเด่น
  - ระบบรวมประกาศส่วนกลาง (Global Announcement Hub) ที่ดึงประกาศจากทุกแผนกมารวมแสดงในหน้าแรก ไม่จำกัดอยู่เฉพาะในหน้าแผนกย่อย

## ไฟล์ที่มีผลกระทบในการพัฒนาถัดไป (Impact Files)
- `public/admin.html` & `public/js/admin.js` — เพิ่มแท็บจัดการบุคลากร (Org Chart Editor) และแท็บจัดการประกาศส่วนกลาง
- `public/department.html` & `public/js/department.js` — เพิ่มส่วนแสดงผลแผนผังองค์กรและข้อมูลติดต่อเจ้าหน้าที่
- `public/index.html` — ปรับ Layout ตำแหน่งแสดงผลประกาศขึ้นส่วนบนสุดของหน้าพอร์ทัล
- `public/js/firestore-service.js` — เพิ่มฟังก์ชัน CRUD สำหรับ Collection `staff` และดึงข้อมูลประกาศแบบ Global Query

## กฎการพัฒนาต่อเนื่อง
- คงหลักการ fallback ไปยัง `mock-data.js` หากฐานข้อมูล Firestore ยังไม่มีข้อมูลบุคลากร
- ข้อมูลบุคลากรและรูปภาพทั้งหมดต้องผ่าน `escapeHtml()` และ `sanitizeUrl()` เพื่อป้องกัน XSS
- รัน `node --test` ตรวจสอบ Integrity ก่อน Deploy ขึ้น Firebase Hosting ทุกครั้ง