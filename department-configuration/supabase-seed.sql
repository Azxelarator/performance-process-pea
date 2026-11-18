-- Seed Data for PEA Department Configuration

-- 1. Departments
INSERT INTO departments (id, name, short_name, name_en, hero_description, overview_title, overview_text, stats, missions, contact)
VALUES ('gis', 'แผนกระบบสารสนเทศภูมิศาสตร์ (GIS)', 'แผนก GIS', 'Geographic Information System (GIS)', 'จัดทำ ดูแล และให้บริการข้อมูลแผนที่และข้อมูลเชิงพื้นที่ เพื่อสนับสนุนการวางแผนและการปฏิบัติงานของหน่วยงาน', 'GIS คืออะไร', 'ระบบสารสนเทศภูมิศาสตร์ (Geographic Information System: GIS) คือระบบคอมพิวเตอร์ที่ใช้ในการจัดเก็บ บันทึก ตรวจสอบ ปรับปรุง จัดการ วิเคราะห์ แสดงผล และเผยแพร่ข้อมูลเชิงพื้นที่ เพื่อให้เห็นความสัมพันธ์ทางภูมิศาสตร์ สนับสนุนการตัดสินใจ และเพิ่มประสิทธิภาพการปฏิบัติงาน', '[{"id":"storage","label":"จัดเก็บ","value":"8","unit":"ชุดข้อมูล"},{"id":"analytics","label":"วิเคราะห์","value":"4","unit":"โครงข่าย"},{"id":"publish","label":"เผยแพร่","value":"23","unit":"เขตพื้นที่"}]'::jsonb, '[{"step":1,"title":"จัดทำและปรับปรุงข้อมูลแผนที่","description":"นำเข้า สำรวจ และปรับปรุงข้อมูลแผนที่ให้เป็นปัจจุบัน"},{"step":2,"title":"ดูแลฐานข้อมูลเชิงพื้นที่","description":"บริหารจัดการระบบฐานข้อมูลเชิงพื้นที่ขององค์กร"},{"step":3,"title":"จัดการส่งข้อมูลเชิงพื้นที่","description":"เชื่อมโยงและบูรณาการข้อมูลเชิงพื้นที่ร่วมกับหน่วยงานอื่น"},{"step":4,"title":"ให้บริการข้อมูลแผนที่","description":"ให้บริการระบบแผนที่ออนไลน์แก่เจ้าหน้าที่และประชาชน"},{"step":5,"title":"สำรวจและจัดเก็บข้อมูลภาคสนาม","description":"นำทีมสำรวจพิกัดและสินทรัพย์ภาคสนามด้วยเครื่องมือ GNSS"},{"step":6,"title":"อบรมและให้คำปรึกษา","description":"ถ่ายทอดความรู้และให้คำปรึกษาการใช้งานระบบแก่ผู้ปฏิบัติงาน"}]'::jsonb, '{"location":"อาคาร 3 ชั้น 4 สำนักงานใหญ่","phone":"02-xxx-xxxx ต่อ 4501","email":"gis_support@pea.co.th","hours":"จันทร์ - ศุกร์ (08:30 - 16:30 น.)"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  name_en = EXCLUDED.name_en,
  hero_description = EXCLUDED.hero_description,
  overview_title = EXCLUDED.overview_title,
  overview_text = EXCLUDED.overview_text,
  stats = EXCLUDED.stats,
  missions = EXCLUDED.missions,
  contact = EXCLUDED.contact;

INSERT INTO departments (id, name, short_name, name_en, hero_description, overview_title, overview_text, stats, missions, contact)
VALUES ('it', 'ฝ่ายเทคโนโลยีสารสนเทศ', 'ฝ่าย IT', 'Information Technology Department', 'พัฒนาระบบเทคโนโลยีสารสนเทศ โครงสร้างพื้นฐานดิจิทัล และดูแลความมั่นคงปลอดภัยไซเบอร์ขององค์กร', 'บทบาทของฝ่าย IT', 'มุ่งมั่นขับเคลื่อนองค์กรสู่ Digital Organization ด้วยการพัฒนาระบบซอฟต์แวร์ คลาวด์คอมพิวติ้ง และระบบโครงข่ายที่มีความปลอดภัยและเสถียรภาพสูงสุด', '[{"id":"storage","label":"ระบบงาน","value":"32","unit":"ระบบ"},{"id":"analytics","label":"Uptime","value":"99.9%","unit":"ความพร้อมใช้"},{"id":"publish","label":"ผู้ใช้งาน","value":"4,500+","unit":"คน"}]'::jsonb, '[{"step":1,"title":"พัฒนาระบบสารสนเทศองค์กร","description":"ออกแบบ พัฒนา และบำรุงรักษาระบบซอฟต์แวร์ตามความต้องการ"},{"step":2,"title":"บริหารโครงสร้างพื้นฐานคลาวด์","description":"ดูแล Data Center ระบบ Cloud และ Server ฟาร์ม"},{"step":3,"title":"รักษาความมั่นคงปลอดภัยไซเบอร์","description":"ป้องกันภัยคุกคามตามมาตรฐาน ISO/IEC 27001"},{"step":4,"title":"สนับสนุนการปฏิบัติงาน Service Desk","description":"ให้บริการช่วยเหลือและแก้ปัญหาไอทีแก่ผู้ใช้งาน"},{"step":5,"title":"บูรณาการข้อมูลและ Open Data","description":"จัดทำสถาปัตยกรรมข้อมูลและ Data Pipeline"},{"step":6,"title":"ส่งเสริมทักษะดิจิทัลบุคลากร","description":"จัดอบรมถ่ายทอดความรู้เครื่องมือและเทคโนโลยีใหม่"}]'::jsonb, '{"location":"อาคาร 2 ชั้น 5 สำนักงานใหญ่","phone":"02-xxx-xxxx ต่อ 1111 (IT Helpdesk)","email":"it_servicedesk@pea.co.th","hours":"บริการ 24 ชั่วโมง"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  name_en = EXCLUDED.name_en,
  hero_description = EXCLUDED.hero_description,
  overview_title = EXCLUDED.overview_title,
  overview_text = EXCLUDED.overview_text,
  stats = EXCLUDED.stats,
  missions = EXCLUDED.missions,
  contact = EXCLUDED.contact;

INSERT INTO departments (id, name, short_name, name_en, hero_description, overview_title, overview_text, stats, missions, contact)
VALUES ('hr', 'ฝ่ายทรัพยากรบุคคล', 'ฝ่าย HR', 'Human Resources Department', 'สรรหา พัฒนา รักษา และยกระดับศักยภาพทุนมนุษย์ขององค์กรให้พร้อมรับการเปลี่ยนแปลงในอนาคต', 'บทบาทของฝ่าย HR', 'เป็นศูนย์กลางในการวางแผนกลยุทธ์ทรัพยากรบุคคล การบริหารค่าตอบแทน สวัสดิการ และการสร้างวัฒนธรรมองค์กรแห่งการเรียนรู้ที่ยั่งยืน', '[{"id":"storage","label":"บุคลากร","value":"1,200","unit":"คน"},{"id":"analytics","label":"หลักสูตรอบรม","value":"48","unit":"หลักสูตร"},{"id":"publish","label":"ความพึงพอใจ","value":"92.5%","unit":"คะแนน"}]'::jsonb, '[{"step":1,"title":"วางแผนอัตรากำลังและสรรหา","description":"กำหนดกรอบอัตรากำลังและสรรหาบุคลากรคุณภาพ"},{"step":2,"title":"พัฒนาขีดความสามารถบุคลากร","description":"จัดทำ Training Roadmap และ Leadership Program"},{"step":3,"title":"บริหารผลการปฏิบัติงาน (PMS)","description":"ประเมิน KPI และสมรรถนะบุคลากรอย่างเป็นธรรม"},{"step":4,"title":"ดูแลสวัสดิการและแรงงานสัมพันธ์","description":"ส่งเสริมสุขภาวะพนักงานและความสัมพันธ์อันดี"},{"step":5,"title":"จัดการระบบฐานข้อมูล HRIS","description":"พัฒนาระบบบริการตนเอง (Employee Self-Service)"},{"step":6,"title":"สืบทอดตำแหน่งและ Talent Management","description":"จัดทำแผนสืบทอดตำแหน่งสำคัญและดูแลกลุ่มศักยภาพสูง"}]'::jsonb, '{"location":"อาคาร 1 ชั้น 2 สำนักงานใหญ่","phone":"02-xxx-xxxx ต่อ 2201-2204","email":"hr_center@pea.co.th","hours":"จันทร์ - ศุกร์ (08:30 - 16:30 น.)"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  name_en = EXCLUDED.name_en,
  hero_description = EXCLUDED.hero_description,
  overview_title = EXCLUDED.overview_title,
  overview_text = EXCLUDED.overview_text,
  stats = EXCLUDED.stats,
  missions = EXCLUDED.missions,
  contact = EXCLUDED.contact;

INSERT INTO departments (id, name, short_name, name_en, hero_description, overview_title, overview_text, stats, missions, contact)
VALUES ('finance', 'ฝ่ายการเงินและบัญชี', 'ฝ่ายการเงิน', 'Finance and Accounting Department', 'บริหารจัดการการเงิน งบประมาณ และบัญชีอย่างมีวินัย โปร่งใส และสร้างมูลค่าเพิ่มสูงสุดแก่องค์กร', 'บทบาทของฝ่ายการเงิน', 'ทำหน้าที่บริหารสภาพคล่อง จัดหาแหล่งเงินทุน จัดทำงบประมาณ และรายงานทางการเงินตามมาตรฐานสากล', '[{"id":"storage","label":"งบประมาณ","value":"3,450","unit":"ล้านบาท"},{"id":"analytics","label":"เบิกจ่าย","value":"78.5%","unit":"ตามเป้า"},{"id":"publish","label":"Credit Rating","value":"AA+","unit":"TRIS"}]'::jsonb, '[{"step":1,"title":"จัดทำงบประมาณประจำปี","description":"รวบรวม วิเคราะห์ และจัดสรรงบประมาณแก่ทุกหน่วยงาน"},{"step":2,"title":"บริหารการรับและจ่ายเงิน","description":"ควบคุมกระแสเงินสดและการเบิกจ่ายผ่านระบบดิจิทัล"},{"step":3,"title":"จัดทำบัญชีและงบการเงิน","description":"บันทึกบัญชีตามมาตรฐาน IFRS และรายงานต่อบอร์ด"},{"step":4,"title":"บริหารภาษีอากร","description":"วางแผนและปฏิบัติตามกฎหมายภาษีอย่างถูกต้องครบถ้วน"},{"step":5,"title":"ควบคุมภายในและบริหารความเสี่ยง","description":"ติดตามการใช้งบประมาณและป้องกันความเสี่ยงทางการเงิน"},{"step":6,"title":"จัดหาแหล่งเงินทุนเพื่อการลงทุน","description":"บริหารสินเชื่อและพันธบัตรสำหรับโครงการโครงสร้างพื้นฐาน"}]'::jsonb, '{"location":"อาคาร 1 ชั้น 3 สำนักงานใหญ่","phone":"02-xxx-xxxx ต่อ 3301-3305","email":"finance_dept@pea.co.th","hours":"จันทร์ - ศุกร์ (08:30 - 16:30 น.)"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  name_en = EXCLUDED.name_en,
  hero_description = EXCLUDED.hero_description,
  overview_title = EXCLUDED.overview_title,
  overview_text = EXCLUDED.overview_text,
  stats = EXCLUDED.stats,
  missions = EXCLUDED.missions,
  contact = EXCLUDED.contact;

INSERT INTO departments (id, name, short_name, name_en, hero_description, overview_title, overview_text, stats, missions, contact)
VALUES ('ops', 'ฝ่ายปฏิบัติการและบำรุงรักษา', 'ฝ่ายปฏิบัติการ', 'Operations and Maintenance Department', 'ควบคุมการเดินเครื่อง การจ่ายกระแสไฟฟ้า และการซ่อมบำรุงระบบให้มีความต่อเนื่องและปลอดภัยสูงสุด', 'บทบาทของฝ่ายปฏิบัติการ', 'เป็นกำลังหลักในภาคสนาม ดูแลสถานีไฟฟ้า สายส่ง และอุปกรณ์จ่ายไฟให้ทำงานได้อย่างเต็มประสิทธิภาพตลอด 24 ชั่วโมง', '[{"id":"storage","label":"สถานีไฟฟ้า","value":"54","unit":"สถานี"},{"id":"analytics","label":"สายส่ง","value":"3,800","unit":"วงจร-กม."},{"id":"publish","label":"SAIDI","value":"1.25","unit":"นาที/ราย"}]'::jsonb, '[{"step":1,"title":"ควบคุมการจ่ายไฟฟ้า","description":"มอนิเตอร์และสั่งการจ่ายไฟผ่านระบบ SCADA 24 ชม."},{"step":2,"title":"บำรุงรักษาเชิงป้องกัน","description":"ตรวจเช็กอุปกรณ์ตามวาระเพื่อลดโอกาสไฟดับ"},{"step":3,"title":"แก้ไขเหตุขัดข้องฉุกเฉิน","description":"จัดทีมพร้อมปฏิบัติการเข้าพื้นที่ซ่อมแซมได้ทันท่วงที"},{"step":4,"title":"ตรวจสอบความปลอดภัยระบบไฟฟ้า","description":"ประเมินความเสี่ยงและตรวจรับรองความปลอดภัย"},{"step":5,"title":"ขยายและปรับปรุงโครงข่ายไฟฟ้า","description":"ติดตั้งหม้อแปลงและอุปกรณ์รองรับปริมาณการใช้ไฟที่เพิ่มขึ้น"},{"step":6,"title":"บริหารจัดการอะไหล่และอุปกรณ์สำรอง","description":"ควบคุมคลังพัสดุและชิ้นส่วนจำเป็นต่อการซ่อมบำรุง"}]'::jsonb, '{"location":"อาคารศูนย์ควบคุมระบบไฟฟ้า (ECC)","phone":"02-xxx-xxxx ต่อ 5500 (สายด่วนแจ้งเหตุ)","email":"operations@pea.co.th","hours":"ศูนย์ควบคุมเปิดทำการ 24 ชั่วโมง"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  name_en = EXCLUDED.name_en,
  hero_description = EXCLUDED.hero_description,
  overview_title = EXCLUDED.overview_title,
  overview_text = EXCLUDED.overview_text,
  stats = EXCLUDED.stats,
  missions = EXCLUDED.missions,
  contact = EXCLUDED.contact;

INSERT INTO departments (id, name, short_name, name_en, hero_description, overview_title, overview_text, stats, missions, contact)
VALUES ('planning', 'ฝ่ายแผนงานและยุทธศาสตร์', 'ฝ่ายแผนงาน', 'Corporate Strategy and Planning Department', 'กำหนดยุทธศาสตร์ แผนวิสาหกิจ และติดตามประเมินผลการดำเนินงานเพื่อขับเคลื่อนองค์กรสู่อนาคต', 'บทบาทของฝ่ายแผนงาน', 'ผู้นำในการวิเคราะห์ทิศทางพลังงาน นโยบายพลังงานหมุนเวียน แผนพัฒนากำลังผลิต และการขับเคลื่อน ESG', '[{"id":"storage","label":"โครงการยุทธศาสตร์","value":"18","unit":"โครงการ"},{"id":"analytics","label":"เป้าหมาย ESG","value":"89%","unit":"บรรลุผล"},{"id":"publish","label":"แผนแม่บท","value":"5","unit":"ปี (68-72)"}]'::jsonb, '[{"step":1,"title":"จัดทำแผนยุทธศาสตร์องค์กร","description":"กำหนดวิสัยทัศน์ พันธกิจ และเป้าหมายระยะ 5-10 ปี"},{"step":2,"title":"ศึกษาความเป็นไปได้โครงการลงทุน","description":"วิเคราะห์ความคุ้มค่าด้านเศรษฐศาสตร์และสังคม"},{"step":3,"title":"ติดตามและประเมินผลโครงการ","description":"รายงานความก้าวหน้าโครงการสำคัญต่อผู้บริหาร"},{"step":4,"title":"ส่งเสริมนวัตกรรมและพลังงานสีเขียว","description":"ขับเคลื่อนโครงการ Solar, EV และพลังงานหมุนเวียน"},{"step":5,"title":"ขับเคลื่อนเกณฑ์ประเมินรัฐวิสาหกิจ (Enablers)","description":"ยกระดับระบบบริหารจัดการตามเกณฑ์ประเมินของ สคร."},{"step":6,"title":"จัดทำรายงานความยั่งยืน (Sustainability Report)","description":"รายงานข้อมูลด้านสิ่งแวดล้อม สังคม และธรรมาภิบาล"}]'::jsonb, '{"location":"อาคาร 1 ชั้น 6 สำนักงานใหญ่","phone":"02-xxx-xxxx ต่อ 6601-6603","email":"strategy_planning@pea.co.th","hours":"จันทร์ - ศุกร์ (08:30 - 16:30 น.)"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  name_en = EXCLUDED.name_en,
  hero_description = EXCLUDED.hero_description,
  overview_title = EXCLUDED.overview_title,
  overview_text = EXCLUDED.overview_text,
  stats = EXCLUDED.stats,
  missions = EXCLUDED.missions,
  contact = EXCLUDED.contact;

INSERT INTO departments (id, name, short_name, name_en, hero_description, overview_title, overview_text, stats, missions, contact)
VALUES ('legal', 'ฝ่ายกฎหมายและคดี', 'ฝ่ายกฎหมาย', 'Legal and Litigation Department', 'ให้คำปรึกษาทางกฎหมาย ตรวจร่างสัญญา นิติกรรม และดำเนินการทางคดีเพื่อคุ้มครองผลประโยชน์ขององค์กร', 'บทบาทของฝ่ายกฎหมาย', 'กำกับดูแลให้การดำเนินงานขององค์กรถูกต้องตามระเบียบ กฎหมาย และมาตรฐานธรรมาภิบาลภาครัฐ', '[{"id":"storage","label":"ตรวจสัญญา","value":"450+","unit":"ฉบับ/ปี"},{"id":"analytics","label":"ให้คำปรึกษา","value":"180","unit":"เรื่อง"},{"id":"publish","label":"ความสำเร็จคดี","value":"96%","unit":"ของคดีความ"}]'::jsonb, '[{"step":1,"title":"ตรวจพิจารณาร่างสัญญาและข้อตกลง","description":"ตรวจร่างสัญญาจัดซื้อจัดจ้างและ MOU"},{"step":2,"title":"ให้ความเห็นและคำปรึกษาทางกฎหมาย","description":"ตอบข้อหารือทางกฎหมายแก่ผู้บริหารและหน่วยงาน"},{"step":3,"title":"ดำเนินการทางคดีและการว่าความ","description":"ฟ้องร้องและแก้ต่างคดีแพ่ง อาญา และปกครอง"},{"step":4,"title":"พิจารณาข้อร้องเรียนและวินัย","description":"ร่วมสอบสวนข้อเท็จจริงตามระเบียบวินัยองค์กร"},{"step":5,"title":"ดูแลสิทธิในทรัพย์สินทางปัญญา","description":"จดทะเบียนเครื่องหมายการค้า ลิขสิทธิ์ และสิทธิบัตร"},{"step":6,"title":"เผยแพร่ความรู้กฎหมายระเบียบใหม่","description":"สรุปและให้ความรู้กฎหมายที่มีผลต่อการปฏิบัติงาน"}]'::jsonb, '{"location":"อาคาร 1 ชั้น 4 สำนักงานใหญ่","phone":"02-xxx-xxxx ต่อ 4401-4403","email":"legal_affairs@pea.co.th","hours":"จันทร์ - ศุกร์ (08:30 - 16:30 น.)"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  name_en = EXCLUDED.name_en,
  hero_description = EXCLUDED.hero_description,
  overview_title = EXCLUDED.overview_title,
  overview_text = EXCLUDED.overview_text,
  stats = EXCLUDED.stats,
  missions = EXCLUDED.missions,
  contact = EXCLUDED.contact;

-- 2. Documents
INSERT INTO documents (department_id, title, category, year, file_type, file_size, file_url, downloads, published_at)
VALUES ('gis', 'คู่มือการใช้งานระบบแผนที่ออนไลน์', 'manual', '2569', 'pdf', '4.8 MB', '#', 342, '2026-11-10');
INSERT INTO documents (department_id, title, category, year, file_type, file_size, file_url, downloads, published_at)
VALUES ('gis', 'แบบฟอร์มขอใช้ข้อมูลแผนที่', 'form', '2569', 'docx', '1.2 MB', '#', 185, '2026-11-02');
INSERT INTO documents (department_id, title, category, year, file_type, file_size, file_url, downloads, published_at)
VALUES ('gis', 'ประกาศปรับปรุงระบบแผนที่ออนไลน์', 'order', '2569', 'pdf', '850 KB', '#', 210, '2026-11-10');
INSERT INTO documents (department_id, title, category, year, file_type, file_size, file_url, downloads, published_at)
VALUES ('gis', 'มาตรฐานการจัดทำข้อมูลเชิงพื้นที่', 'manual', '2569', 'pdf', '3.4 MB', '#', 142, '2026-10-20');
INSERT INTO documents (department_id, title, category, year, file_type, file_size, file_url, downloads, published_at)
VALUES ('gis', 'รายการชั้นข้อมูลที่ให้บริการ', 'report', '2569', 'xlsx', '2.1 MB', '#', 98, '2026-10-12');
INSERT INTO documents (department_id, title, category, year, file_type, file_size, file_url, downloads, published_at)
VALUES ('hr', 'ประกาศรับสมัครพนักงานจ้าง ตำแหน่งเจ้าหน้าที่สำรวจ', 'order', '2569', 'pdf', '620 KB', '#', 512, '2026-10-25');
INSERT INTO documents (department_id, title, category, year, file_type, file_size, file_url, downloads, published_at)
VALUES ('gis', 'รายงานผลการสำรวจสินทรัพย์ภาคสนาม (ไตรมาส 3)', 'report', '2569', 'pdf', '6.2 MB', '#', 77, '2026-11-01');
INSERT INTO documents (department_id, title, category, year, file_type, file_size, file_url, downloads, published_at)
VALUES ('gis', 'แบบฟอร์มคำขอเชื่อมโยงข้อมูลเชิงพื้นที่', 'form', '2569', 'docx', '1.5 MB', '#', 120, '2026-09-15');
INSERT INTO documents (department_id, title, category, year, file_type, file_size, file_url, downloads, published_at)
VALUES ('it', 'คู่มือการรักษาความมั่นคงปลอดภัยสารสนเทศสำหรับพนักงาน', 'manual', '2569', 'pdf', '5.1 MB', '#', 430, '2026-10-05');
INSERT INTO documents (department_id, title, category, year, file_type, file_size, file_url, downloads, published_at)
VALUES ('finance', 'แบบฟอร์มขออนุมัติเบิกจ่ายงบประมาณโครงการพิเศษ', 'form', '2569', 'docx', '890 KB', '#', 310, '2026-09-20');

-- 3. Articles
INSERT INTO articles (department_id, category, title, blocks, updated_at)
VALUES ('gis', 'achievement', 'ผังแปลงและแผนที่ดิน กฟภ. ประจำไตรมาส (สรุปผลการดำเนินงาน 12 เขตพื้นที่)', '[{"type":"paragraph","text":"แผนกระบบสารสนเทศภูมิศาสตร์ได้ดำเนินการปรับปรุงและตรวจสอบข้อมูลแนวเขตแปลงที่ดินและสินทรัพย์ขององค์กร ครอบคลุมพื้นที่ให้บริการทั้ง 12 เขตพื้นที่ โดยเชื่อมต่อฐานข้อมูลกรมที่ดิน"},{"type":"callout","icon":"success","text":"ตรวจสอบความถูกต้องของแปลงที่ดินแล้วเสร็จ 100% รวมทั้งสิ้น 24,500 แปลง ส่งผลให้การบริหารจัดการสินทรัพย์มีประสิทธิภาพสูงสุด"},{"type":"list","style":"ordered","items":["รวบรวมระวางแผนที่ภาพถ่ายดาวเทียมความละเอียดสูง (Resolution 50 cm)","ปรับเทียบพิกัดแผนที่เข้าระบบ UTM WGS84 Zone 47N และ 48N","ตรวจสอบแนวเขตซ้อนทับและจัดทำรายงานสรุปส่งฝ่ายบริหารสินทรัพย์","เผยแพร่ชั้นข้อมูลบนระบบ Web GIS Portal สำหรับพนักงานใช้งานภายใน"]},{"type":"image","url":"https://placehold.co/800x400/4a154b/fbbf24?text=PEA+Land+GIS+Mapping","caption":"ตัวอย่างผังแปลงที่ดินและแนวเขตสินทรัพย์ในระบบสารสนเทศภูมิศาสตร์"}]'::jsonb, '2026-11-12T14:00:00+07:00');
INSERT INTO articles (department_id, category, title, blocks, updated_at)
VALUES ('gis', 'achievement', 'แผนที่โครงข่ายเคเบิลใยแก้วนำแสง (Fiber Optic Network Mapping)', '[{"type":"paragraph","text":"โครงการจัดทำฐานข้อมูลโครงข่ายเคเบิลใยแก้วนำแสงบนระบบ GIS เพื่อรองรับการสื่อสารและการสั่งการระบบควบคุมโครงข่ายไฟฟ้าอัจฉริยะ (Smart Grid)"},{"type":"callout","icon":"info","text":"บันทึกข้อมูลแนวสายเคเบิลใยแก้ว ระยะทางรวมกว่า 12,000 กิโลเมตร พร้อมจุดเชื่อมต่อและจุดต่อสาย (Splice Closure)"},{"type":"list","style":"unordered","items":["บันทึกพิกัดเสาไฟฟ้าและแนวพาดสายสื่อสาร","แสดงสถานะคู่สายที่ใช้งานและคู่สายสำรองแบบ Real-time","ลดระยะเวลาค้นหาจุดชำรุดเสียหายเมื่อเกิดเหตุขัดข้องลง 60%"]}]'::jsonb, '2026-11-05T09:30:00+07:00');
INSERT INTO articles (department_id, category, title, blocks, updated_at)
VALUES ('gis', 'achievement', 'การสำรวจพิกัดทรัพย์สินและอุปกรณ์ระบบจำหน่ายภาคสนามด้วยเทคโนโลยี RTK GNSS', '[{"type":"paragraph","text":"การประยุกต์ใช้อุปกรณ์รับสัญญาณดาวเทียมความแม่นยำสูงระดับเซนติเมตร (RTK GNSS) ในการเก็บพิกัดเสาไฟฟ้า หม้อแปลง และสวิตช์ตัดตอนในพื้นที่สำคัญ"},{"type":"callout","icon":"success","text":"เพิ่มความถูกต้องของตำแหน่งในฐานข้อมูลระบบ GIS จากระดับเมตรสู่ระดับเซนติเมตร"}]'::jsonb, '2026-10-28T16:00:00+07:00');
INSERT INTO articles (department_id, category, title, blocks, updated_at)
VALUES ('gis', 'process', 'ขั้นตอนการขอรับบริการข้อมูลแผนที่และชั้นข้อมูลเชิงพื้นที่', '[{"type":"paragraph","text":"หน่วยงานภายในที่ประสงค์จะขอรับข้อมูลแผนที่ หรือเชื่อมต่อ Map Service (WMS/WFS) ให้ดำเนินการตามขั้นตอนดังนี้"},{"type":"list","style":"ordered","items":["ดาวน์โหลดและกรอก \"แบบฟอร์มขอใช้ข้อมูลแผนที่ (GIS-Form-01)\"","เสนอหัวหน้าหน่วยงานต้นสังกัดลงนามอนุมัติ","ส่งเอกสารผ่านระบบสารบรรณอิเล็กทรอนิกส์มายังแผนกระบบสารสนเทศภูมิศาสตร์","เจ้าหน้าที่ GIS ตรวจสอบสิทธิและจัดเตรียมข้อมูล/สร้าง Token เชื่อมต่อภายใน 3 วันทำการ"]},{"type":"callout","icon":"warning","text":"ข้อมูลเชิงพื้นที่เป็นทรัพย์สินขององค์กร ห้ามนำไปเผยแพร่ภายนอกโดยไม่ได้รับอนุญาตเป็นลายลักษณ์อักษร"}]'::jsonb, '2026-11-08T10:00:00+07:00');
INSERT INTO articles (department_id, category, title, blocks, updated_at)
VALUES ('hr', 'process', 'ขั้นตอนการสรรหาและคัดเลือกบุคลากร', '[{"type":"paragraph","text":"กระบวนการสรรหาและคัดเลือกบุคลากรขององค์กรได้รับการออกแบบให้มีความโปร่งใส เป็นธรรม และสอดคล้องกับมาตรฐานการบริหารทรัพยากรบุคคลภาครัฐ โดยมีขั้นตอนหลักดังนี้"},{"type":"list","style":"ordered","items":["หน่วยงานต้นสังกัดจัดทำคำขออัตรากำลังพร้อมคุณสมบัติเฉพาะตำแหน่ง","ฝ่ายทรัพยากรบุคคลตรวจสอบกรอบอัตรากำลังและประกาศรับสมัคร","คณะกรรมการคัดเลือกดำเนินการสอบข้อเขียนและสัมภาษณ์","ประกาศผลและดำเนินการจ้างงานภายใน 15 วันทำการ"]},{"type":"callout","icon":"info","text":"ระยะเวลาดำเนินการตั้งแต่เปิดรับสมัครจนถึงประกาศผลไม่เกิน 45 วันทำการ ตามประกาศคณะกรรมการบริหารทรัพยากรบุคคล ฉบับที่ 12/2569"},{"type":"image","url":"https://placehold.co/800x400/4a154b/fbbf24?text=Recruitment+Process+Flow","caption":"แผนภาพแสดงขั้นตอนการสรรหาบุคลากร (Recruitment Process Flow)"}]'::jsonb, '2026-11-10T09:00:00+07:00');
INSERT INTO articles (department_id, category, title, blocks, updated_at)
VALUES ('hr', 'achievement', 'ผลงานการพัฒนาศักยภาพบุคลากร ประจำปี 2569', '[{"type":"paragraph","text":"ในปีงบประมาณ 2569 ฝ่ายทรัพยากรบุคคลได้ดำเนินโครงการพัฒนาศักยภาพบุคลากรอย่างต่อเนื่อง โดยมุ่งเน้นการยกระดับทักษะดิจิทัลและภาวะผู้นำ เพื่อรองรับการเปลี่ยนแปลงขององค์กรในยุคดิจิทัล"},{"type":"list","style":"unordered","items":["จัดอบรมหลักสูตร Digital Literacy ให้พนักงาน 1,200 คน (ครบ 100%)","โครงการ Leadership Development Program รุ่นที่ 5 — ผู้บริหารระดับกลาง 45 คน","ทุนการศึกษาต่อระดับปริญญาโท 12 ทุน (ในประเทศ 8, ต่างประเทศ 4)","อัตราความพึงพอใจของพนักงานต่อระบบสวัสดิการ 92.5%"]},{"type":"callout","icon":"success","text":"ผลการประเมิน KPI ด้านการพัฒนาบุคลากรอยู่ในระดับ \"ดีเยี่ยม\" ติดต่อกัน 3 ปีซ้อน"}]'::jsonb, '2026-11-08T14:30:00+07:00');
INSERT INTO articles (department_id, category, title, blocks, updated_at)
VALUES ('finance', 'process', 'กระบวนการจัดทำงบประมาณประจำปี', '[{"type":"paragraph","text":"การจัดทำงบประมาณประจำปีขององค์กรเป็นกระบวนการที่ต้องอาศัยความร่วมมือจากทุกหน่วยงาน โดยฝ่ายการเงินทำหน้าที่เป็นศูนย์กลางในการรวบรวม วิเคราะห์ และนำเสนอต่อคณะกรรมการบริหาร"},{"type":"list","style":"ordered","items":["ฝ่ายแผนงานกำหนดกรอบนโยบายและเพดานงบประมาณ (กรกฎาคม)","แต่ละหน่วยงานจัดทำคำขอตั้งงบประมาณรายจ่ายประจำปี (สิงหาคม)","ฝ่ายการเงินรวบรวมและวิเคราะห์ความเหมาะสมของคำขอ (กันยายน)","นำเสนอคณะกรรมการบริหารพิจารณาอนุมัติ (ตุลาคม)","จัดสรรงบประมาณและแจ้งหน่วยงาน (พฤศจิกายน)"]},{"type":"callout","icon":"warning","text":"หน่วยงานที่ไม่ส่งคำขอตั้งงบประมาณภายในกำหนด จะถูกจัดสรรงบประมาณตามฐานปีก่อนหน้าเท่านั้น"}]'::jsonb, '2026-11-05T10:00:00+07:00');
INSERT INTO articles (department_id, category, title, blocks, updated_at)
VALUES ('finance', 'achievement', 'สรุปผลการดำเนินงานด้านการเงิน ไตรมาส 3/2569', '[{"type":"paragraph","text":"ผลการดำเนินงานด้านการเงินในไตรมาสที่ 3 ของปีงบประมาณ 2569 แสดงให้เห็นถึงประสิทธิภาพในการบริหารจัดการรายรับ-รายจ่ายที่ดีขึ้นอย่างต่อเนื่อง"},{"type":"list","style":"unordered","items":["รายได้รวม 3,450 ล้านบาท (เพิ่มขึ้น 8.2% จากไตรมาสเดียวกันของปีก่อน)","อัตราการเบิกจ่ายงบลงทุน 78.5% (สูงกว่าเป้าหมาย 75%)","ลดต้นทุนการดำเนินงานได้ 120 ล้านบาท จากโครงการ Cost Optimization","อัตราส่วนหนี้สินต่อทุน (D/E Ratio) อยู่ที่ 0.85 (ต่ำกว่าเกณฑ์ที่กำหนดไว้ที่ 1.5)"]},{"type":"callout","icon":"success","text":"ผลการจัดอันดับเครดิตองค์กรโดย TRIS Rating คงอยู่ที่ระดับ AA+ แนวโน้มคงที่ (Stable Outlook)"}]'::jsonb, '2026-10-15T16:00:00+07:00');
INSERT INTO articles (department_id, category, title, blocks, updated_at)
VALUES ('it', 'process', 'กระบวนการพัฒนาและบำรุงรักษาระบบสารสนเทศ', '[{"type":"paragraph","text":"ฝ่ายเทคโนโลยีสารสนเทศใช้กระบวนการพัฒนาระบบแบบ Agile-Waterfall Hybrid เพื่อให้เกิดความยืดหยุ่นในการพัฒนาควบคู่กับการควบคุมคุณภาพตามมาตรฐาน ISO/IEC 27001"},{"type":"list","style":"ordered","items":["รับ Change Request จากหน่วยงานผ่านระบบ Service Desk","วิเคราะห์ผลกระทบ (Impact Analysis) และประเมินทรัพยากร","ออกแบบและพัฒนาระบบ (Sprint-based, 2 สัปดาห์ต่อรอบ)","ทดสอบระบบ (Unit Test → Integration Test → UAT)","ขออนุมัติ Change Advisory Board (CAB) ก่อน Deploy","Deploy ขึ้น Production ในช่วง Maintenance Window (วันเสาร์ 22:00-06:00)"]},{"type":"callout","icon":"warning","text":"ห้าม Deploy ระบบในช่วง Freeze Period (1-15 ของทุกเดือน) ยกเว้นกรณี Critical Bug ที่ได้รับอนุมัติจาก CIO เท่านั้น"}]'::jsonb, '2026-11-12T11:00:00+07:00');
INSERT INTO articles (department_id, category, title, blocks, updated_at)
VALUES ('it', 'achievement', 'ผลงานการยกระดับระบบดิจิทัลภายในองค์กร ปี 2569', '[{"type":"paragraph","text":"ฝ่ายเทคโนโลยีสารสนเทศได้ดำเนินโครงการ Digital Transformation ตามแผนแม่บทเทคโนโลยีสารสนเทศขององค์กร พ.ศ. 2567-2571 โดยในปี 2569 มีผลงานสำคัญดังนี้"},{"type":"list","style":"unordered","items":["เปิดใช้งานระบบ ERP (SAP S/4HANA) ครบทุกโมดูลหลัก — ลดเวลาปิดงบจาก 15 วันเหลือ 5 วัน","พัฒนา Mobile App สำหรับพนักงาน (iOS/Android) — ผู้ใช้งาน 95% ของพนักงานทั้งหมด","ยกระดับระบบ Cybersecurity ผ่านมาตรฐาน ISO 27001:2022 — ไม่มีเหตุการณ์ Data Breach ตลอดปี","ติดตั้งระบบ Cloud Infrastructure (Google Cloud) — ลดค่าใช้จ่ายเซิร์ฟเวอร์ 35%"]},{"type":"callout","icon":"success","text":"องค์กรได้รับรางวัล \"Digital Government Award 2569\" ระดับดีเด่น จากสำนักงานพัฒนารัฐบาลดิจิทัล (DGA)"}]'::jsonb, '2026-11-01T13:00:00+07:00');

-- 4. Announcements
INSERT INTO announcements (department_id, type, title, announcement_date)
VALUES ('gis', 'notice', 'ปิดปรับปรุงระบบแผนที่ออนไลน์ชั่วคราว ช่วงวันหยุดสุดสัปดาห์ (15-16 พ.ย.)', CURRENT_DATE);
INSERT INTO announcements (department_id, type, title, announcement_date)
VALUES ('gis', 'guideline', 'แนวทางการใช้งานระบบแผนที่สำหรับพนักงานใหม่ ประจำปี 2569', CURRENT_DATE);
INSERT INTO announcements (department_id, type, title, announcement_date)
VALUES ('gis', 'achievement', 'อัปเดตข้อมูลแนวเขตพื้นที่ให้บริการประจำไตรมาส ครบถ้วน 12 เขต', CURRENT_DATE);
INSERT INTO announcements (department_id, type, title, announcement_date)
VALUES ('hr', 'job', 'รับสมัครพนักงานจ้าง ตำแหน่งเจ้าหน้าที่สำรวจข้อมูลภาคสนาม จำนวน 5 อัตรา', CURRENT_DATE);
INSERT INTO announcements (department_id, type, title, announcement_date)
VALUES ('it', 'notice', 'ซ่อมบำรุงระบบเครือข่ายและระบบสำรองข้อมูลประจำเดือน ตุลาคม 2569', CURRENT_DATE);

-- 5. Staff
INSERT INTO staff (department_id, name, position, role, email, phone, photo_url)
VALUES ('gis', 'ทดสอบ ระบบสารสนเทศ', 'หัวหน้าแผนก GIS', 'ผู้บริหารแผนก', 'testing.gis.01@example.com', '000-000-0001', '/assets/images/placeholder-staff.png');
INSERT INTO staff (department_id, name, position, role, email, phone, photo_url)
VALUES ('gis', 'ตัวอย่าง โปรไฟล์', 'วิศวกรระบบ', 'เจ้าหน้าที่เทคนิค', 'sample.gis.02@example.com', '000-000-0002', '');
INSERT INTO staff (department_id, name, position, role, email, phone, photo_url)
VALUES ('it', 'จำลอง ข้อมูล', 'หัวหน้าฝ่าย IT', 'ผู้บริหารฝ่าย', 'demo.it.01@example.com', '000-000-0003', '/assets/images/placeholder-staff.png');
INSERT INTO staff (department_id, name, position, role, email, phone, photo_url)
VALUES ('it', 'ทดสอบ ระบบ', 'นักพัฒนาซอฟต์แวร์', 'เจ้าหน้าที่ไอที', 'example.it.02@example.com', '000-000-0004', '');
INSERT INTO staff (department_id, name, position, role, email, phone, photo_url)
VALUES ('hr', 'ตัวอย่าง บุคลากร', 'หัวหน้าฝ่าย HR', 'ผู้บริหารฝ่าย', 'sample.hr.01@example.com', '000-000-0005', '/assets/images/placeholder-staff.png');
INSERT INTO staff (department_id, name, position, role, email, phone, photo_url)
VALUES ('hr', 'จำลอง ทดสอบ', 'เจ้าหน้าที่บุคคล', 'เจ้าหน้าที่ธุรการ', 'demo.hr.02@example.com', '000-000-0006', '');
INSERT INTO staff (department_id, name, position, role, email, phone, photo_url)
VALUES ('finance', 'ทดสอบ การเงิน', 'หัวหน้าฝ่ายการเงิน', 'ผู้บริหารฝ่าย', 'testing.fin.01@example.com', '000-000-0007', '/assets/images/placeholder-staff.png');
INSERT INTO staff (department_id, name, position, role, email, phone, photo_url)
VALUES ('finance', 'ตัวอย่าง บัญชี', 'นักบัญชี', 'เจ้าหน้าที่การเงิน', 'sample.fin.02@example.com', '000-000-0008', '');
INSERT INTO staff (department_id, name, position, role, email, phone, photo_url)
VALUES ('ops', 'จำลอง ปฏิบัติการ', 'หัวหน้าฝ่ายปฏิบัติการ', 'ผู้บริหารฝ่าย', 'demo.ops.01@example.com', '000-000-0009', '/assets/images/placeholder-staff.png');
INSERT INTO staff (department_id, name, position, role, email, phone, photo_url)
VALUES ('ops', 'ทดสอบ ระบบส่ง', 'วิศวกรระบบส่ง', 'เจ้าหน้าที่เทคนิค', 'example.ops.02@example.com', '000-000-0010', '');
INSERT INTO staff (department_id, name, position, role, email, phone, photo_url)
VALUES ('planning', 'ตัวอย่าง วางแผน', 'หัวหน้าฝ่ายวางแผน', 'ผู้บริหารฝ่าย', 'sample.plan.01@example.com', '000-000-0011', '/assets/images/placeholder-staff.png');
INSERT INTO staff (department_id, name, position, role, email, phone, photo_url)
VALUES ('planning', 'จำลอง ยุทธศาสตร์', 'นักวางแผน', 'เจ้าหน้าที่วางแผน', 'demo.plan.02@example.com', '000-000-0012', '');
INSERT INTO staff (department_id, name, position, role, email, phone, photo_url)
VALUES ('legal', 'ทดสอบ กฎหมาย', 'หัวหน้าฝ่ายกฎหมาย', 'ผู้บริหารฝ่าย', 'testing.legal.01@example.com', '000-000-0013', '/assets/images/placeholder-staff.png');
INSERT INTO staff (department_id, name, position, role, email, phone, photo_url)
VALUES ('legal', 'ตัวอย่าง สัญญา', 'นักกฎหมาย', 'เจ้าหน้าที่กฎหมาย', 'sample.legal.02@example.com', '000-000-0014', '');
