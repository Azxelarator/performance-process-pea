import * as fs from 'node:fs';
import { ANNOUNCEMENTS, ARTICLES, DEPARTMENTS, DOCUMENTS, STAFF } from '../lib/mock-data.ts';

function esc(val) {
  if (val === null || val === undefined) return '';
  return String(val).replace(/'/g, "''");
}

let sql = '-- Seed Data for PEA Department Configuration\n\n';

// 1. Departments
sql += '-- 1. Departments\n';
for (const d of DEPARTMENTS) {
  const stats = JSON.stringify(d.stats || []).replace(/'/g, "''");
  const missions = JSON.stringify(d.missions || []).replace(/'/g, "''");
  const contact = JSON.stringify(d.contact || {}).replace(/'/g, "''");
  const heroDesc = esc(d.heroDescription);
  const overTitle = esc(d.overviewTitle);
  const overText = esc(d.overviewText);
  const name = esc(d.name);
  const shortName = esc(d.shortName);
  const nameEn = esc(d.nameEn);

  sql += `INSERT INTO departments (id, name, short_name, name_en, hero_description, overview_title, overview_text, stats, missions, contact)
VALUES ('${d.id}', '${name}', '${shortName}', '${nameEn}', '${heroDesc}', '${overTitle}', '${overText}', '${stats}'::jsonb, '${missions}'::jsonb, '${contact}'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  name_en = EXCLUDED.name_en,
  hero_description = EXCLUDED.hero_description,
  overview_title = EXCLUDED.overview_title,
  overview_text = EXCLUDED.overview_text,
  stats = EXCLUDED.stats,
  missions = EXCLUDED.missions,
  contact = EXCLUDED.contact;\n\n`;
}

// 2. Documents
sql += '-- 2. Documents\n';
for (const doc of DOCUMENTS) {
  const title = esc(doc.title);
  const pubAt = doc.publishedAt ? `'${doc.publishedAt}'` : 'now()';
  sql += `INSERT INTO documents (department_id, title, category, year, file_type, file_size, file_url, downloads, published_at)
VALUES ('${doc.department}', '${title}', '${doc.category}', '${doc.year}', '${doc.fileType}', '${doc.fileSize}', '${doc.fileUrl}', ${doc.downloads || 0}, ${pubAt});\n`;
}
sql += '\n';

// 3. Articles
sql += '-- 3. Articles\n';
for (const a of ARTICLES) {
  const title = esc(a.title);
  const blocks = JSON.stringify(a.blocks || []).replace(/'/g, "''");
  const upAt = a.updatedAt ? `'${a.updatedAt}'` : 'now()';
  sql += `INSERT INTO articles (department_id, category, title, blocks, updated_at)
VALUES ('${a.department}', '${a.category}', '${title}', '${blocks}'::jsonb, ${upAt});\n`;
}
sql += '\n';

// 4. Announcements
sql += '-- 4. Announcements\n';
for (const ann of ANNOUNCEMENTS) {
  const title = esc(ann.title);
  sql += `INSERT INTO announcements (department_id, type, title, announcement_date)
VALUES ('${ann.department}', '${ann.type}', '${title}', CURRENT_DATE);\n`;
}
sql += '\n';

// 5. Staff
sql += '-- 5. Staff\n';
for (const s of STAFF) {
  const name = esc(s.name);
  const pos = esc(s.position);
  const role = esc(s.role);
  sql += `INSERT INTO staff (department_id, name, position, role, email, phone, photo_url)
VALUES ('${s.department}', '${name}', '${pos}', '${role}', '${esc(s.email)}', '${esc(s.phone)}', '${esc(s.photoUrl)}');\n`;
}

fs.writeFileSync('supabase-seed.sql', sql, 'utf8');
console.log('Successfully generated supabase-seed.sql');
