# performance-process-pea

เว็บพอร์ทัลองค์กรของการไฟฟ้าส่วนภูมิภาค (PEA) สำหรับจัดการ Process การทำงานและผลงานของแต่ละแผนก

## Tech Stack
- Backend: Node.js + Express (server.js, พอร์ต 3001)
- Frontend: Vanilla JS + Tailwind CSS (โฟลเดอร์ public/)
- Database/Auth: Firebase Firestore + Firebase Auth (Google Sign-In)
- Deploy: Docker (node:20-slim) และ GitHub Actions → Firebase Hosting
- Test: node:test + assert (tests/portal.test.js)

## โครงสร้างไฟล์

### Root
- `server.js` — Express เสิร์ฟไฟล์ static จาก public/
- `package.json` — สคริปต์ start, dev, test
- `firebase.json` — Hosting public folder = public
- `.firebaserc` — Project ID: performance-process-pea-9a2c
- `firestore.rules` — กฎความปลอดภัย Firestore (RBAC)
- `Dockerfile` — node:20-slim, production deps, เปิดพอร์ต 8080
- `.github/workflows/` — firebase-hosting-merge.yml (push main), firebase-hosting-pull-request.yml (preview PR)

### public/ (หน้าเว็บ)
- `index.html` — หน้าแรก (Hero, รายชื่อแผนก, ประกาศล่าสุด, เอกสารแนะนำ)
- `admin.html` — หลังบ้าน (Auth, Block Editor, จัดการบทความ/เอกสาร/แผนก)
- `department.html` — รายละเอียดแผนก (อ่านจาก ?dept=xxx)
- `documents.html` — คลังเอกสาร (ค้นหา, กรองตามแผนก/ปี/หมวดหมู่)

### public/js/ (โค้ดหลัก)
- `firebase-config.js` — ตั้งค่าเชื่อมต่อ Firebase (ผ่าน CDN)
- `firestore-service.js` — CRUD 4 collection: departments, articles, documents, announcements + RBAC + seed mock data
- `renderer.js` — แปลง JSON Blocks เป็น HTML (paragraph, callout, image, list) + escapeHtml, sanitizeUrl กัน XSS
- `mock-data.js` — ข้อมูลจำลอง ใช้เป็น fallback เมื่อ Firestore ว่างหรือ error
- `admin.js` — Google Sign-In, เช็กสิทธิ์ (super_admin/editor), เพิ่ม/แก้ไข/ลบข้อมูล
- `department.js` — แสดงผลหน้าแผนก
- `documents.js` — ค้นหาและกรองเอกสาร (debounce, หลายเงื่อนไข)

### tests/
- `portal.test.js` — ทดสอบ XSS, Block Rendering, UI Components, Mock Data, Schema
- `package.json` — "type": "module"

## กฎสำคัญของระบบ
- สิทธิ์: super_admin จัดการได้ทั้งหมด / editor แก้ไขเฉพาะแผนกตัวเอง / คนทั่วไปอ่านอย่างเดียว
- ทุกข้อความที่แสดงบนหน้าเว็บต้องผ่าน escapeHtml(), ทุก URL ต้องผ่าน sanitizeUrl()
- ถ้า Firestore ว่างหรือ error ให้ fallback ไปใช้ mock-data.js

## วิธีทำงานกับ AI (กันกิน token)
- อ่านไฟล์นี้ก่อน ห้ามไล่อ่านทั้งโปรเจกต์
- อ่านเฉพาะไฟล์ที่เกี่ยวกับงานที่สั่ง
- ทำทีละเรื่อง ไม่แก้หลายไฟล์ที่ไม่เกี่ยวกัน
- แก้เสร็จให้รัน node --test ก่อนรายงานผล