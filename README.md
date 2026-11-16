# Performance Process PEA (พอร์ทัลองค์กรรัฐวิสาหกิจ)

เว็บพอร์ทัลสำหรับองค์กรรัฐวิสาหกิจ (การไฟฟ้าส่วนภูมิภาค - PEA) เพื่อให้แต่ละแผนกเข้ามาอัปเดต "Process การทำงาน" และ "ผลงานของแผนก" หน้าบ้านเปิดให้บุคลากรและบุคคลทั่วไปเข้าอ่าน และมีระบบหลังบ้านสำหรับเจ้าหน้าที่แผนกเพื่อบริหารจัดการข้อมูล

---

## 🚀 จุดเด่นและฟังก์ชันหลัก (Key Features)

1. **หน้าบ้าน (Frontend - Multi-Page Application)**
   - **หน้าแรก (`index.html`):** แบนเนอร์ Topographic ม่วง-ทอง ทางการ (Theme A), แถบค้นหา, การ์ดเลือกแผนก, ข่าวสารและประกาศล่าสุด, เอกสารเผยแพร่ล่าสุด
   - **หน้ารายละเอียดแผนก (`department.html?dept=...`):** ภาพรวมภารกิจ, ตัวชี้วัดสำคัญ (Metrics), พันธกิจ 6 ด้าน, รายการกระบวนการทำงานและผลงาน (Block Reader), ข่าวสาร, เอกสาร และรายชื่อทีมงาน
   - **คลังเอกสาร (`documents.html`):** ระบบค้นหาและตัวกรองตามแผนก, ปี พ.ศ., หมวดหมู่ (คู่มือ, แบบฟอร์ม, รายงาน, คำสั่ง) พร้อมตารางดาวน์โหลดที่รองรับ Responsive (ตารางบน Desktop / การ์ดบน Mobile)

2. **หลังบ้านและระบบจัดการข้อมูล (`admin.html`)**
   - **Authentication:** รองรับการเข้าสู่ระบบด้วย Google ผ่าน Firebase Authentication
   - **Role-Based Access Control (RBAC):**
     - `super_admin`: จัดการข้อมูลได้ทุกแผนก, นำเข้า Mock Data เริ่มต้น
     - `editor`: จัดการได้เฉพาะแผนกของตนเอง
   - **Block-Based Content Editor:** เพิ่ม/แก้ไขบทความด้วย Block (ย่อหน้า, กล่องเน้นข้อความ, รูปภาพ, รายการ)
   - **Department & Document Management:** อัปเดตข้อมูลภาพรวมแผนก ตัวชี้วัด พันธกิจ และคลังเอกสาร

3. **ความปลอดภัยและเสถียรภาพ (Security & Integrity)**
   - ป้องกัน XSS ด้วย `escapeHtml()` และ `sanitizeUrl()` ทุกจุดที่แสดงผล
   - อัปเกรดระบบเก็บข้อมูลเป็น **Firebase Firestore** พร้อมระบบ Fallback ไปยัง `mock-data.js` เมื่อออฟไลน์หรือยังไม่มีข้อมูล
   - Automated Unit Test Suite ด้วย `node:test` ผ่าน 25/25 เคส

---

## 🛠️ Tech Stack

- **Runtime:** Node.js (ES Modules, `type: module`)
- **Server:** Express (`server.js` บน Port 3001 สำหรับ Local, รองรับ `process.env.PORT`)
- **Frontend:** Vanilla JavaScript (ESM ผ่าน Google CDN), HTML5, Tailwind CSS
- **Database & Auth:** Firebase Firestore, Firebase Authentication
- **Testing:** Node.js Built-in Test Runner (`node:test`, `node:assert/strict`)
- **Containerization:** Docker (`Dockerfile`, `node:20-slim`) พร้อมขึ้น Google Cloud Run

---

## 📂 โครงสร้างโปรเจกต์ (Project Structure)

```
performance-process-pea/
├── .github/
│   └── workflows/              # GitHub Actions สำหรับ CI/CD Firebase Hosting
├── md/
│   ├── project.md              # ข้อมูลสรุปสถาปัตยกรรมระบบ
│   └── update.md               # บันทึกการเปลี่ยนแปลง
├── public/                     # ไฟล์ส่วน Frontend (Static Assets)
│   ├── index.html              # หน้าแรกของพอร์ทัล
│   ├── department.html         # หน้ารายละเอียดแผนก
│   ├── documents.html          # หน้าคลังเอกสาร
│   ├── admin.html              # หน้าหลังบ้านจัดการข้อมูล
│   └── js/
│       ├── firebase-config.js  # ตั้งค่าเชื่อมต่อ Firebase Modular SDK
│       ├── firestore-service.js# Data Access Layer & CRUD Firestore
│       ├── renderer.js         # Block Engine & ฟังก์ชันป้องกัน XSS
│       ├── mock-data.js        # ข้อมูลจำลองและชุดข้อมูลเริ่มต้น
│       ├── admin.js            # ตรรกะจัดการหลังบ้านและ Auth
│       ├── department.js       # ตรรกะแสดงผลหน้ารายละเอียดแผนก
│       └── documents.js        # ตรรกะค้นหาและกรองคลังเอกสาร
├── tests/
│   └── portal.test.js          # Automated Unit Tests (25 เคส)
├── Dockerfile                  # คอนเทนเนอร์สำหรับ Deploy ขึ้น Cloud Run
├── firebase.json               # การตั้งค่า Firebase Hosting
├── firestore.rules             # กฎความปลอดภัย Firestore (RBAC)
├── package.json
├── server.js                   # Express Server
└── README.md
```

---

## 💻 การติดตั้งและรันใช้งาน (Getting Started)

### 1. ติดตั้ง Dependencies & ตั้งค่าการเชื่อมต่อ
```bash
npm install

# คัดลอกแม่แบบการตั้งค่า Firebase สำหรับใช้งานในเครื่อง (ไฟล์นี้จะไม่ถูก Push ขึ้น Git)
cp public/js/firebase-credentials.example.js public/js/firebase-credentials.js
# จากนั้นเปิด public/js/firebase-credentials.js เพื่อใส่ค่า Config จาก Firebase Console
```

### 2. รัน Unit Tests
```bash
npm test
```

### 3. รันเซิร์ฟเวอร์แบบ Local
```bash
npm start
# หรือสำหรับ Hot-Reload ระหว่างพัฒนา
npm run dev
```
เปิดบราวเซอร์ไปที่:
- หน้าบ้าน: [http://localhost:3001/](http://localhost:3001/)
- หลังบ้าน: [http://localhost:3001/admin.html](http://localhost:3001/admin.html)

---

## 🐳 การรันผ่าน Docker

```bash
# Build Image
docker build -t performance-process-pea .

# Run Container
docker run -p 8080:8080 performance-process-pea
```

---

## ☁️ การ Deploy ขึ้น Firebase Hosting

```bash
firebase deploy --only hosting,firestore:rules
```
