# department-configuration

พอร์ทัลข่าวสาร ประกาศ และเอกสารของหน่วยงาน การไฟฟ้าส่วนภูมิภาค
Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Firebase (Firestore, Auth)

## เริ่มต้นใช้งาน

```bash
npm install
cp .env.example .env.local   # ใส่ค่า Firebase web config
npm run dev                  # http://localhost:3001
```

ถ้าไม่ใส่ `.env.local` หรือ Firestore ว่าง/เชื่อมไม่ได้ ระบบจะใช้ข้อมูลจำลองใน `lib/mock-data.ts`

## คำสั่ง

| คำสั่ง | ใช้ทำอะไร |
| --- | --- |
| `npm run dev` | รันโหมดพัฒนา |
| `npm run build` / `npm start` | build และรัน production |
| `npm run lint` | ESLint |
| `npm test` | เทส (Node >= 22.18) |

## โครงสร้าง

| เส้นทาง | หน้าที่ |
| --- | --- |
| `app/page.tsx` | หน้าแรก |
| `app/(site)/departments/[id]` | หน้าแผนก |
| `app/(site)/documents` | คลังเอกสาร ค้นหา/กรอง |
| `app/admin` | ระบบหลังบ้าน (Google Sign-In + สิทธิ์ super_admin / editor) |
| `lib/repository.ts` | อ่าน/เขียน Firestore + fallback เป็น mock data |
| `lib/data.ts` | cache การอ่านข้อมูลฝั่ง server (`'use cache'`) |
| `components/` | UI ที่ใช้ร่วมกัน |

## สิทธิ์ผู้ดูแล

สิทธิ์อยู่ใน collection `users` ของ Firestore โดยใช้อีเมลตัวพิมพ์เล็กเป็น document id:

```json
{ "email": "name@example.com", "role": "super_admin", "departmentId": "all" }
```

`role: "editor"` จัดการได้เฉพาะแผนกที่ระบุใน `departmentId`
