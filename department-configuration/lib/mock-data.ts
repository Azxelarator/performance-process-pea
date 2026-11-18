import type { Announcement, Article, Department, DocumentItem, StaffMember } from './types';

// Fallback data used when Firestore is unreachable or a collection is empty.
// Also the seed source for "Import mock data" in the admin panel.

export const DEPARTMENTS: Department[] = [
  {
    id: 'gis',
    name: 'แผนกระบบสารสนเทศภูมิศาสตร์ (GIS)',
    shortName: 'แผนก GIS',
    nameEn: 'Geographic Information System (GIS)',
    heroDescription: 'จัดทำ ดูแล และให้บริการข้อมูลแผนที่และข้อมูลเชิงพื้นที่ เพื่อสนับสนุนการวางแผนและการปฏิบัติงานของหน่วยงาน',
    overviewTitle: 'GIS คืออะไร',
    overviewText: 'ระบบสารสนเทศภูมิศาสตร์ (Geographic Information System: GIS) คือระบบคอมพิวเตอร์ที่ใช้ในการจัดเก็บ บันทึก ตรวจสอบ ปรับปรุง จัดการ วิเคราะห์ แสดงผล และเผยแพร่ข้อมูลเชิงพื้นที่ เพื่อให้เห็นความสัมพันธ์ทางภูมิศาสตร์ สนับสนุนการตัดสินใจ และเพิ่มประสิทธิภาพการปฏิบัติงาน',
    stats: [
      { id: 'storage', label: 'จัดเก็บ', value: '8', unit: 'ชุดข้อมูล' },
      { id: 'analytics', label: 'วิเคราะห์', value: '4', unit: 'โครงข่าย' },
      { id: 'publish', label: 'เผยแพร่', value: '23', unit: 'เขตพื้นที่' }
    ],
    missions: [
      {
        step: 1,
        title: 'จัดทำและปรับปรุงข้อมูลแผนที่',
        description: 'นำเข้า สำรวจ และปรับปรุงข้อมูลแผนที่ให้เป็นปัจจุบัน'
      },
      {
        step: 2,
        title: 'ดูแลฐานข้อมูลเชิงพื้นที่',
        description: 'บริหารจัดการระบบฐานข้อมูลเชิงพื้นที่ขององค์กร'
      },
      {
        step: 3,
        title: 'จัดการส่งข้อมูลเชิงพื้นที่',
        description: 'เชื่อมโยงและบูรณาการข้อมูลเชิงพื้นที่ร่วมกับหน่วยงานอื่น'
      },
      {
        step: 4,
        title: 'ให้บริการข้อมูลแผนที่',
        description: 'ให้บริการระบบแผนที่ออนไลน์แก่เจ้าหน้าที่และประชาชน'
      },
      {
        step: 5,
        title: 'สำรวจและจัดเก็บข้อมูลภาคสนาม',
        description: 'นำทีมสำรวจพิกัดและสินทรัพย์ภาคสนามด้วยเครื่องมือ GNSS'
      },
      {
        step: 6,
        title: 'อบรมและให้คำปรึกษา',
        description: 'ถ่ายทอดความรู้และให้คำปรึกษาการใช้งานระบบแก่ผู้ปฏิบัติงาน'
      }
    ],
    personnel: [
      {
        name: 'นายสมศักดิ์ สุขใจ',
        position: 'หัวหน้าแผนก GIS',
        role: 'บริหารจัดการงานทั่วไป'
      },
      {
        name: 'น.ส.วิไลวรรณ มั่นคง',
        position: 'วิศวกรระบบ 6',
        role: 'ดูแลฐานข้อมูลและระบบสารสนเทศ'
      },
      {
        name: 'นายธนพล รุ่งเรือง',
        position: 'นักวิชาการแผนที่',
        role: 'สำรวจและจัดทำแผนที่'
      },
      {
        name: 'น.ส.กนกพร ใจดี',
        position: 'เจ้าหน้าที่ภูมิสารสนเทศ',
        role: 'บริการข้อมูลและฝึกอบรม'
      }
    ],
    contact: {
      location: 'อาคาร 3 ชั้น 4 สำนักงานใหญ่',
      phone: '02-xxx-xxxx ต่อ 4501',
      email: 'gis_support@pea.co.th',
      hours: 'จันทร์ - ศุกร์ (08:30 - 16:30 น.)'
    }
  },
  {
    id: 'it',
    name: 'ฝ่ายเทคโนโลยีสารสนเทศ',
    shortName: 'ฝ่าย IT',
    nameEn: 'Information Technology Department',
    heroDescription: 'พัฒนาระบบเทคโนโลยีสารสนเทศ โครงสร้างพื้นฐานดิจิทัล และดูแลความมั่นคงปลอดภัยไซเบอร์ขององค์กร',
    overviewTitle: 'บทบาทของฝ่าย IT',
    overviewText: 'มุ่งมั่นขับเคลื่อนองค์กรสู่ Digital Organization ด้วยการพัฒนาระบบซอฟต์แวร์ คลาวด์คอมพิวติ้ง และระบบโครงข่ายที่มีความปลอดภัยและเสถียรภาพสูงสุด',
    stats: [
      { id: 'storage', label: 'ระบบงาน', value: '32', unit: 'ระบบ' },
      { id: 'analytics', label: 'Uptime', value: '99.9%', unit: 'ความพร้อมใช้' },
      { id: 'publish', label: 'ผู้ใช้งาน', value: '4,500+', unit: 'คน' }
    ],
    missions: [
      {
        step: 1,
        title: 'พัฒนาระบบสารสนเทศองค์กร',
        description: 'ออกแบบ พัฒนา และบำรุงรักษาระบบซอฟต์แวร์ตามความต้องการ'
      },
      {
        step: 2,
        title: 'บริหารโครงสร้างพื้นฐานคลาวด์',
        description: 'ดูแล Data Center ระบบ Cloud และ Server ฟาร์ม'
      },
      {
        step: 3,
        title: 'รักษาความมั่นคงปลอดภัยไซเบอร์',
        description: 'ป้องกันภัยคุกคามตามมาตรฐาน ISO/IEC 27001'
      },
      {
        step: 4,
        title: 'สนับสนุนการปฏิบัติงาน Service Desk',
        description: 'ให้บริการช่วยเหลือและแก้ปัญหาไอทีแก่ผู้ใช้งาน'
      },
      {
        step: 5,
        title: 'บูรณาการข้อมูลและ Open Data',
        description: 'จัดทำสถาปัตยกรรมข้อมูลและ Data Pipeline'
      },
      {
        step: 6,
        title: 'ส่งเสริมทักษะดิจิทัลบุคลากร',
        description: 'จัดอบรมถ่ายทอดความรู้เครื่องมือและเทคโนโลยีใหม่'
      }
    ],
    personnel: [
      {
        name: 'นายกิตติศักดิ์ พัฒนาวิทย์',
        position: 'ผู้อำนวยการฝ่าย IT',
        role: 'กำกับดูแลงานเทคโนโลยี'
      },
      {
        name: 'นางสาวนภาพร นวัตกรรม',
        position: 'หัวหน้าแผนกพัฒนาระบบ',
        role: 'ควบคุมงาน Application'
      },
      {
        name: 'นายธีรภัทร ปลอดภัย',
        position: 'วิศวกรความมั่นคงปลอดภัย',
        role: 'Cybersecurity Analyst'
      },
      {
        name: 'นายชลธิศ คลาวด์',
        position: 'ผู้เชี่ยวชาญโครงสร้างพื้นฐาน',
        role: 'Infrastructure Specialist'
      }
    ],
    contact: {
      location: 'อาคาร 2 ชั้น 5 สำนักงานใหญ่',
      phone: '02-xxx-xxxx ต่อ 1111 (IT Helpdesk)',
      email: 'it_servicedesk@pea.co.th',
      hours: 'บริการ 24 ชั่วโมง'
    }
  },
  {
    id: 'hr',
    name: 'ฝ่ายทรัพยากรบุคคล',
    shortName: 'ฝ่าย HR',
    nameEn: 'Human Resources Department',
    heroDescription: 'สรรหา พัฒนา รักษา และยกระดับศักยภาพทุนมนุษย์ขององค์กรให้พร้อมรับการเปลี่ยนแปลงในอนาคต',
    overviewTitle: 'บทบาทของฝ่าย HR',
    overviewText: 'เป็นศูนย์กลางในการวางแผนกลยุทธ์ทรัพยากรบุคคล การบริหารค่าตอบแทน สวัสดิการ และการสร้างวัฒนธรรมองค์กรแห่งการเรียนรู้ที่ยั่งยืน',
    stats: [
      { id: 'storage', label: 'บุคลากร', value: '1,200', unit: 'คน' },
      { id: 'analytics', label: 'หลักสูตรอบรม', value: '48', unit: 'หลักสูตร' },
      { id: 'publish', label: 'ความพึงพอใจ', value: '92.5%', unit: 'คะแนน' }
    ],
    missions: [
      {
        step: 1,
        title: 'วางแผนอัตรากำลังและสรรหา',
        description: 'กำหนดกรอบอัตรากำลังและสรรหาบุคลากรคุณภาพ'
      },
      {
        step: 2,
        title: 'พัฒนาขีดความสามารถบุคลากร',
        description: 'จัดทำ Training Roadmap และ Leadership Program'
      },
      {
        step: 3,
        title: 'บริหารผลการปฏิบัติงาน (PMS)',
        description: 'ประเมิน KPI และสมรรถนะบุคลากรอย่างเป็นธรรม'
      },
      {
        step: 4,
        title: 'ดูแลสวัสดิการและแรงงานสัมพันธ์',
        description: 'ส่งเสริมสุขภาวะพนักงานและความสัมพันธ์อันดี'
      },
      {
        step: 5,
        title: 'จัดการระบบฐานข้อมูล HRIS',
        description: 'พัฒนาระบบบริการตนเอง (Employee Self-Service)'
      },
      {
        step: 6,
        title: 'สืบทอดตำแหน่งและ Talent Management',
        description: 'จัดทำแผนสืบทอดตำแหน่งสำคัญและดูแลกลุ่มศักยภาพสูง'
      }
    ],
    personnel: [
      {
        name: 'นางดวงใจ มีสุข',
        position: 'ผู้อำนวยการฝ่ายทรัพยากรบุคคล',
        role: 'กำกับกลยุทธ์ HR'
      },
      {
        name: 'นายพงษ์ศักดิ์ บุญนำ',
        position: 'หัวหน้าแผนกสรรหาบุคลากร',
        role: 'Recruitment Manager'
      },
      {
        name: 'นางสาวศิริพร เรียนรู้',
        position: 'หัวหน้าแผนกพัฒนาและฝึกอบรม',
        role: 'L&D Specialist'
      },
      {
        name: 'นายธนา สิทธิประโยชน์',
        position: 'เจ้าหน้าที่สวัสดิการและแรงงานสัมพันธ์',
        role: 'HR Welfare'
      }
    ],
    contact: {
      location: 'อาคาร 1 ชั้น 2 สำนักงานใหญ่',
      phone: '02-xxx-xxxx ต่อ 2201-2204',
      email: 'hr_center@pea.co.th',
      hours: 'จันทร์ - ศุกร์ (08:30 - 16:30 น.)'
    }
  },
  {
    id: 'finance',
    name: 'ฝ่ายการเงินและบัญชี',
    shortName: 'ฝ่ายการเงิน',
    nameEn: 'Finance and Accounting Department',
    heroDescription: 'บริหารจัดการการเงิน งบประมาณ และบัญชีอย่างมีวินัย โปร่งใส และสร้างมูลค่าเพิ่มสูงสุดแก่องค์กร',
    overviewTitle: 'บทบาทของฝ่ายการเงิน',
    overviewText: 'ทำหน้าที่บริหารสภาพคล่อง จัดหาแหล่งเงินทุน จัดทำงบประมาณ และรายงานทางการเงินตามมาตรฐานสากล',
    stats: [
      { id: 'storage', label: 'งบประมาณ', value: '3,450', unit: 'ล้านบาท' },
      { id: 'analytics', label: 'เบิกจ่าย', value: '78.5%', unit: 'ตามเป้า' },
      { id: 'publish', label: 'Credit Rating', value: 'AA+', unit: 'TRIS' }
    ],
    missions: [
      {
        step: 1,
        title: 'จัดทำงบประมาณประจำปี',
        description: 'รวบรวม วิเคราะห์ และจัดสรรงบประมาณแก่ทุกหน่วยงาน'
      },
      {
        step: 2,
        title: 'บริหารการรับและจ่ายเงิน',
        description: 'ควบคุมกระแสเงินสดและการเบิกจ่ายผ่านระบบดิจิทัล'
      },
      {
        step: 3,
        title: 'จัดทำบัญชีและงบการเงิน',
        description: 'บันทึกบัญชีตามมาตรฐาน IFRS และรายงานต่อบอร์ด'
      },
      {
        step: 4,
        title: 'บริหารภาษีอากร',
        description: 'วางแผนและปฏิบัติตามกฎหมายภาษีอย่างถูกต้องครบถ้วน'
      },
      {
        step: 5,
        title: 'ควบคุมภายในและบริหารความเสี่ยง',
        description: 'ติดตามการใช้งบประมาณและป้องกันความเสี่ยงทางการเงิน'
      },
      {
        step: 6,
        title: 'จัดหาแหล่งเงินทุนเพื่อการลงทุน',
        description: 'บริหารสินเชื่อและพันธบัตรสำหรับโครงการโครงสร้างพื้นฐาน'
      }
    ],
    personnel: [
      {
        name: 'นายชาญชัย มั่งมี',
        position: 'ผู้อำนวยการฝ่ายการเงิน',
        role: 'Chief Financial Officer'
      },
      {
        name: 'นางสาวรัชนี งบประมาณ',
        position: 'หัวหน้าแผนกงบประมาณ',
        role: 'Budgeting Manager'
      },
      {
        name: 'นายวรวุฒิ สมุดบัญชี',
        position: 'หัวหน้าแผนกบัญชีทั่วไป',
        role: 'Senior Accountant'
      },
      {
        name: 'นางนฤมล ลงทุนดี',
        position: 'วิเคราะห์การเงินและจัดหาทุน',
        role: 'Financial Analyst'
      }
    ],
    contact: {
      location: 'อาคาร 1 ชั้น 3 สำนักงานใหญ่',
      phone: '02-xxx-xxxx ต่อ 3301-3305',
      email: 'finance_dept@pea.co.th',
      hours: 'จันทร์ - ศุกร์ (08:30 - 16:30 น.)'
    }
  },
  {
    id: 'ops',
    name: 'ฝ่ายปฏิบัติการและบำรุงรักษา',
    shortName: 'ฝ่ายปฏิบัติการ',
    nameEn: 'Operations and Maintenance Department',
    heroDescription: 'ควบคุมการเดินเครื่อง การจ่ายกระแสไฟฟ้า และการซ่อมบำรุงระบบให้มีความต่อเนื่องและปลอดภัยสูงสุด',
    overviewTitle: 'บทบาทของฝ่ายปฏิบัติการ',
    overviewText: 'เป็นกำลังหลักในภาคสนาม ดูแลสถานีไฟฟ้า สายส่ง และอุปกรณ์จ่ายไฟให้ทำงานได้อย่างเต็มประสิทธิภาพตลอด 24 ชั่วโมง',
    stats: [
      { id: 'storage', label: 'สถานีไฟฟ้า', value: '54', unit: 'สถานี' },
      { id: 'analytics', label: 'สายส่ง', value: '3,800', unit: 'วงจร-กม.' },
      { id: 'publish', label: 'SAIDI', value: '1.25', unit: 'นาที/ราย' }
    ],
    missions: [
      {
        step: 1,
        title: 'ควบคุมการจ่ายไฟฟ้า',
        description: 'มอนิเตอร์และสั่งการจ่ายไฟผ่านระบบ SCADA 24 ชม.'
      },
      {
        step: 2,
        title: 'บำรุงรักษาเชิงป้องกัน',
        description: 'ตรวจเช็กอุปกรณ์ตามวาระเพื่อลดโอกาสไฟดับ'
      },
      {
        step: 3,
        title: 'แก้ไขเหตุขัดข้องฉุกเฉิน',
        description: 'จัดทีมพร้อมปฏิบัติการเข้าพื้นที่ซ่อมแซมได้ทันท่วงที'
      },
      {
        step: 4,
        title: 'ตรวจสอบความปลอดภัยระบบไฟฟ้า',
        description: 'ประเมินความเสี่ยงและตรวจรับรองความปลอดภัย'
      },
      {
        step: 5,
        title: 'ขยายและปรับปรุงโครงข่ายไฟฟ้า',
        description: 'ติดตั้งหม้อแปลงและอุปกรณ์รองรับปริมาณการใช้ไฟที่เพิ่มขึ้น'
      },
      {
        step: 6,
        title: 'บริหารจัดการอะไหล่และอุปกรณ์สำรอง',
        description: 'ควบคุมคลังพัสดุและชิ้นส่วนจำเป็นต่อการซ่อมบำรุง'
      }
    ],
    personnel: [
      {
        name: 'นายประสิทธิ์ พลังกล้า',
        position: 'ผู้อำนวยการฝ่ายปฏิบัติการ',
        role: 'Operations Director'
      },
      {
        name: 'นายอานนท์ เดินเครื่อง',
        position: 'วิศวกรควบคุมระบบ SCADA',
        role: 'Chief Dispatcher'
      },
      {
        name: 'นายเฉลิม บำรุงสาย',
        position: 'หัวหน้าหมวดซ่อมบำรุงด่วน',
        role: 'Field Maintenance Lead'
      },
      {
        name: 'นายสุรชัย ปลอดภัยไว้ก่อน',
        position: 'เจ้าหน้าที่ความปลอดภัยวิชาชีพ',
        role: 'Safety Inspector'
      }
    ],
    contact: {
      location: 'อาคารศูนย์ควบคุมระบบไฟฟ้า (ECC)',
      phone: '02-xxx-xxxx ต่อ 5500 (สายด่วนแจ้งเหตุ)',
      email: 'operations@pea.co.th',
      hours: 'ศูนย์ควบคุมเปิดทำการ 24 ชั่วโมง'
    }
  },
  {
    id: 'planning',
    name: 'ฝ่ายแผนงานและยุทธศาสตร์',
    shortName: 'ฝ่ายแผนงาน',
    nameEn: 'Corporate Strategy and Planning Department',
    heroDescription: 'กำหนดยุทธศาสตร์ แผนวิสาหกิจ และติดตามประเมินผลการดำเนินงานเพื่อขับเคลื่อนองค์กรสู่อนาคต',
    overviewTitle: 'บทบาทของฝ่ายแผนงาน',
    overviewText: 'ผู้นำในการวิเคราะห์ทิศทางพลังงาน นโยบายพลังงานหมุนเวียน แผนพัฒนากำลังผลิต และการขับเคลื่อน ESG',
    stats: [
      { id: 'storage', label: 'โครงการยุทธศาสตร์', value: '18', unit: 'โครงการ' },
      { id: 'analytics', label: 'เป้าหมาย ESG', value: '89%', unit: 'บรรลุผล' },
      { id: 'publish', label: 'แผนแม่บท', value: '5', unit: 'ปี (68-72)' }
    ],
    missions: [
      {
        step: 1,
        title: 'จัดทำแผนยุทธศาสตร์องค์กร',
        description: 'กำหนดวิสัยทัศน์ พันธกิจ และเป้าหมายระยะ 5-10 ปี'
      },
      {
        step: 2,
        title: 'ศึกษาความเป็นไปได้โครงการลงทุน',
        description: 'วิเคราะห์ความคุ้มค่าด้านเศรษฐศาสตร์และสังคม'
      },
      {
        step: 3,
        title: 'ติดตามและประเมินผลโครงการ',
        description: 'รายงานความก้าวหน้าโครงการสำคัญต่อผู้บริหาร'
      },
      {
        step: 4,
        title: 'ส่งเสริมนวัตกรรมและพลังงานสีเขียว',
        description: 'ขับเคลื่อนโครงการ Solar, EV และพลังงานหมุนเวียน'
      },
      {
        step: 5,
        title: 'ขับเคลื่อนเกณฑ์ประเมินรัฐวิสาหกิจ (Enablers)',
        description: 'ยกระดับระบบบริหารจัดการตามเกณฑ์ประเมินของ สคร.'
      },
      {
        step: 6,
        title: 'จัดทำรายงานความยั่งยืน (Sustainability Report)',
        description: 'รายงานข้อมูลด้านสิ่งแวดล้อม สังคม และธรรมาภิบาล'
      }
    ],
    personnel: [
      {
        name: 'ดร.พงศ์พันธุ์ วิสัยทัศน์',
        position: 'ผู้อำนวยการฝ่ายแผนงาน',
        role: 'Chief Strategy Officer'
      },
      {
        name: 'นางสาวนลินี อนาคตไกล',
        position: 'หัวหน้าแผนกยุทธศาสตร์',
        role: 'Strategic Planner'
      },
      {
        name: 'นายวรากร นวัตกรรมกรีน',
        position: 'ผู้เชี่ยวชาญด้านพลังงานสะอาด',
        role: 'ESG & Clean Energy'
      },
      {
        name: 'นางสาวกานดา ตัวชี้วัด',
        position: 'นักวิเคราะห์ผลการดำเนินงาน',
        role: 'KPI Analyst'
      }
    ],
    contact: {
      location: 'อาคาร 1 ชั้น 6 สำนักงานใหญ่',
      phone: '02-xxx-xxxx ต่อ 6601-6603',
      email: 'strategy_planning@pea.co.th',
      hours: 'จันทร์ - ศุกร์ (08:30 - 16:30 น.)'
    }
  },
  {
    id: 'legal',
    name: 'ฝ่ายกฎหมายและคดี',
    shortName: 'ฝ่ายกฎหมาย',
    nameEn: 'Legal and Litigation Department',
    heroDescription: 'ให้คำปรึกษาทางกฎหมาย ตรวจร่างสัญญา นิติกรรม และดำเนินการทางคดีเพื่อคุ้มครองผลประโยชน์ขององค์กร',
    overviewTitle: 'บทบาทของฝ่ายกฎหมาย',
    overviewText: 'กำกับดูแลให้การดำเนินงานขององค์กรถูกต้องตามระเบียบ กฎหมาย และมาตรฐานธรรมาภิบาลภาครัฐ',
    stats: [
      { id: 'storage', label: 'ตรวจสัญญา', value: '450+', unit: 'ฉบับ/ปี' },
      { id: 'analytics', label: 'ให้คำปรึกษา', value: '180', unit: 'เรื่อง' },
      { id: 'publish', label: 'ความสำเร็จคดี', value: '96%', unit: 'ของคดีความ' }
    ],
    missions: [
      {
        step: 1,
        title: 'ตรวจพิจารณาร่างสัญญาและข้อตกลง',
        description: 'ตรวจร่างสัญญาจัดซื้อจัดจ้างและ MOU'
      },
      {
        step: 2,
        title: 'ให้ความเห็นและคำปรึกษาทางกฎหมาย',
        description: 'ตอบข้อหารือทางกฎหมายแก่ผู้บริหารและหน่วยงาน'
      },
      {
        step: 3,
        title: 'ดำเนินการทางคดีและการว่าความ',
        description: 'ฟ้องร้องและแก้ต่างคดีแพ่ง อาญา และปกครอง'
      },
      {
        step: 4,
        title: 'พิจารณาข้อร้องเรียนและวินัย',
        description: 'ร่วมสอบสวนข้อเท็จจริงตามระเบียบวินัยองค์กร'
      },
      {
        step: 5,
        title: 'ดูแลสิทธิในทรัพย์สินทางปัญญา',
        description: 'จดทะเบียนเครื่องหมายการค้า ลิขสิทธิ์ และสิทธิบัตร'
      },
      {
        step: 6,
        title: 'เผยแพร่ความรู้กฎหมายระเบียบใหม่',
        description: 'สรุปและให้ความรู้กฎหมายที่มีผลต่อการปฏิบัติงาน'
      }
    ],
    personnel: [
      {
        name: 'นายเกรียงศักดิ์ ยุติธรรม',
        position: 'ผู้อำนวยการฝ่ายกฎหมาย',
        role: 'Chief Legal Counsel'
      },
      {
        name: 'นายธนาธิป นิติกรรม',
        position: 'หัวหน้าแผนกสัญญาและนิติกรรม',
        role: 'Contract Specialist'
      },
      {
        name: 'นางสาวศศิธร ว่าความดี',
        position: 'นิติกรชำนาญการพิเศษ',
        role: 'Litigation Lawyer'
      },
      {
        name: 'นายพีระพงษ์ ระเบียบการ',
        position: 'นิติกรให้คำปรึกษา',
        role: 'Legal Advisor'
      }
    ],
    contact: {
      location: 'อาคาร 1 ชั้น 4 สำนักงานใหญ่',
      phone: '02-xxx-xxxx ต่อ 4401-4403',
      email: 'legal_affairs@pea.co.th',
      hours: 'จันทร์ - ศุกร์ (08:30 - 16:30 น.)'
    }
  }
];

export const ARTICLES: Article[] = [
  {
    id: 'achv-gis-001',
    department: 'gis',
    category: 'achievement',
    title: 'ผังแปลงและแผนที่ดิน กฟภ. ประจำไตรมาส (สรุปผลการดำเนินงาน 12 เขตพื้นที่)',
    updatedAt: '2026-11-12T14:00:00+07:00',
    blocks: [
      {
        type: 'paragraph',
        text: 'แผนกระบบสารสนเทศภูมิศาสตร์ได้ดำเนินการปรับปรุงและตรวจสอบข้อมูลแนวเขตแปลงที่ดินและสินทรัพย์ขององค์กร ครอบคลุมพื้นที่ให้บริการทั้ง 12 เขตพื้นที่ โดยเชื่อมต่อฐานข้อมูลกรมที่ดิน'
      },
      {
        type: 'callout',
        icon: 'success',
        text: 'ตรวจสอบความถูกต้องของแปลงที่ดินแล้วเสร็จ 100% รวมทั้งสิ้น 24,500 แปลง ส่งผลให้การบริหารจัดการสินทรัพย์มีประสิทธิภาพสูงสุด'
      },
      {
        type: 'list',
        style: 'ordered',
        items: [
          'รวบรวมระวางแผนที่ภาพถ่ายดาวเทียมความละเอียดสูง (Resolution 50 cm)',
          'ปรับเทียบพิกัดแผนที่เข้าระบบ UTM WGS84 Zone 47N และ 48N',
          'ตรวจสอบแนวเขตซ้อนทับและจัดทำรายงานสรุปส่งฝ่ายบริหารสินทรัพย์',
          'เผยแพร่ชั้นข้อมูลบนระบบ Web GIS Portal สำหรับพนักงานใช้งานภายใน'
        ]
      },
      {
        type: 'image',
        url: 'https://placehold.co/800x400/4a154b/fbbf24?text=PEA+Land+GIS+Mapping',
        caption: 'ตัวอย่างผังแปลงที่ดินและแนวเขตสินทรัพย์ในระบบสารสนเทศภูมิศาสตร์'
      }
    ]
  },
  {
    id: 'achv-gis-002',
    department: 'gis',
    category: 'achievement',
    title: 'แผนที่โครงข่ายเคเบิลใยแก้วนำแสง (Fiber Optic Network Mapping)',
    updatedAt: '2026-11-05T09:30:00+07:00',
    blocks: [
      {
        type: 'paragraph',
        text: 'โครงการจัดทำฐานข้อมูลโครงข่ายเคเบิลใยแก้วนำแสงบนระบบ GIS เพื่อรองรับการสื่อสารและการสั่งการระบบควบคุมโครงข่ายไฟฟ้าอัจฉริยะ (Smart Grid)'
      },
      {
        type: 'callout',
        icon: 'info',
        text: 'บันทึกข้อมูลแนวสายเคเบิลใยแก้ว ระยะทางรวมกว่า 12,000 กิโลเมตร พร้อมจุดเชื่อมต่อและจุดต่อสาย (Splice Closure)'
      },
      {
        type: 'list',
        style: 'unordered',
        items: [
          'บันทึกพิกัดเสาไฟฟ้าและแนวพาดสายสื่อสาร',
          'แสดงสถานะคู่สายที่ใช้งานและคู่สายสำรองแบบ Real-time',
          'ลดระยะเวลาค้นหาจุดชำรุดเสียหายเมื่อเกิดเหตุขัดข้องลง 60%'
        ]
      }
    ]
  },
  {
    id: 'achv-gis-003',
    department: 'gis',
    category: 'achievement',
    title: 'การสำรวจพิกัดทรัพย์สินและอุปกรณ์ระบบจำหน่ายภาคสนามด้วยเทคโนโลยี RTK GNSS',
    updatedAt: '2026-10-28T16:00:00+07:00',
    blocks: [
      {
        type: 'paragraph',
        text: 'การประยุกต์ใช้อุปกรณ์รับสัญญาณดาวเทียมความแม่นยำสูงระดับเซนติเมตร (RTK GNSS) ในการเก็บพิกัดเสาไฟฟ้า หม้อแปลง และสวิตช์ตัดตอนในพื้นที่สำคัญ'
      },
      {
        type: 'callout',
        icon: 'success',
        text: 'เพิ่มความถูกต้องของตำแหน่งในฐานข้อมูลระบบ GIS จากระดับเมตรสู่ระดับเซนติเมตร'
      }
    ]
  },
  {
    id: 'proc-gis-001',
    department: 'gis',
    category: 'process',
    title: 'ขั้นตอนการขอรับบริการข้อมูลแผนที่และชั้นข้อมูลเชิงพื้นที่',
    updatedAt: '2026-11-08T10:00:00+07:00',
    blocks: [
      {
        type: 'paragraph',
        text: 'หน่วยงานภายในที่ประสงค์จะขอรับข้อมูลแผนที่ หรือเชื่อมต่อ Map Service (WMS/WFS) ให้ดำเนินการตามขั้นตอนดังนี้'
      },
      {
        type: 'list',
        style: 'ordered',
        items: [
          'ดาวน์โหลดและกรอก "แบบฟอร์มขอใช้ข้อมูลแผนที่ (GIS-Form-01)"',
          'เสนอหัวหน้าหน่วยงานต้นสังกัดลงนามอนุมัติ',
          'ส่งเอกสารผ่านระบบสารบรรณอิเล็กทรอนิกส์มายังแผนกระบบสารสนเทศภูมิศาสตร์',
          'เจ้าหน้าที่ GIS ตรวจสอบสิทธิและจัดเตรียมข้อมูล/สร้าง Token เชื่อมต่อภายใน 3 วันทำการ'
        ]
      },
      {
        type: 'callout',
        icon: 'warning',
        text: 'ข้อมูลเชิงพื้นที่เป็นทรัพย์สินขององค์กร ห้ามนำไปเผยแพร่ภายนอกโดยไม่ได้รับอนุญาตเป็นลายลักษณ์อักษร'
      }
    ]
  },
  {
    id: 'proc-hr-001',
    department: 'hr',
    category: 'process',
    title: 'ขั้นตอนการสรรหาและคัดเลือกบุคลากร',
    updatedAt: '2026-11-10T09:00:00+07:00',
    blocks: [
      {
        type: 'paragraph',
        text: 'กระบวนการสรรหาและคัดเลือกบุคลากรขององค์กรได้รับการออกแบบให้มีความโปร่งใส เป็นธรรม และสอดคล้องกับมาตรฐานการบริหารทรัพยากรบุคคลภาครัฐ โดยมีขั้นตอนหลักดังนี้'
      },
      {
        type: 'list',
        style: 'ordered',
        items: [
          'หน่วยงานต้นสังกัดจัดทำคำขออัตรากำลังพร้อมคุณสมบัติเฉพาะตำแหน่ง',
          'ฝ่ายทรัพยากรบุคคลตรวจสอบกรอบอัตรากำลังและประกาศรับสมัคร',
          'คณะกรรมการคัดเลือกดำเนินการสอบข้อเขียนและสัมภาษณ์',
          'ประกาศผลและดำเนินการจ้างงานภายใน 15 วันทำการ'
        ]
      },
      {
        type: 'callout',
        icon: 'info',
        text: 'ระยะเวลาดำเนินการตั้งแต่เปิดรับสมัครจนถึงประกาศผลไม่เกิน 45 วันทำการ ตามประกาศคณะกรรมการบริหารทรัพยากรบุคคล ฉบับที่ 12/2569'
      },
      {
        type: 'image',
        url: 'https://placehold.co/800x400/4a154b/fbbf24?text=Recruitment+Process+Flow',
        caption: 'แผนภาพแสดงขั้นตอนการสรรหาบุคลากร (Recruitment Process Flow)'
      }
    ]
  },
  {
    id: 'achv-hr-001',
    department: 'hr',
    category: 'achievement',
    title: 'ผลงานการพัฒนาศักยภาพบุคลากร ประจำปี 2569',
    updatedAt: '2026-11-08T14:30:00+07:00',
    blocks: [
      {
        type: 'paragraph',
        text: 'ในปีงบประมาณ 2569 ฝ่ายทรัพยากรบุคคลได้ดำเนินโครงการพัฒนาศักยภาพบุคลากรอย่างต่อเนื่อง โดยมุ่งเน้นการยกระดับทักษะดิจิทัลและภาวะผู้นำ เพื่อรองรับการเปลี่ยนแปลงขององค์กรในยุคดิจิทัล'
      },
      {
        type: 'list',
        style: 'unordered',
        items: [
          'จัดอบรมหลักสูตร Digital Literacy ให้พนักงาน 1,200 คน (ครบ 100%)',
          'โครงการ Leadership Development Program รุ่นที่ 5 — ผู้บริหารระดับกลาง 45 คน',
          'ทุนการศึกษาต่อระดับปริญญาโท 12 ทุน (ในประเทศ 8, ต่างประเทศ 4)',
          'อัตราความพึงพอใจของพนักงานต่อระบบสวัสดิการ 92.5%'
        ]
      },
      {
        type: 'callout',
        icon: 'success',
        text: 'ผลการประเมิน KPI ด้านการพัฒนาบุคลากรอยู่ในระดับ "ดีเยี่ยม" ติดต่อกัน 3 ปีซ้อน'
      }
    ]
  },
  {
    id: 'proc-fin-001',
    department: 'finance',
    category: 'process',
    title: 'กระบวนการจัดทำงบประมาณประจำปี',
    updatedAt: '2026-11-05T10:00:00+07:00',
    blocks: [
      {
        type: 'paragraph',
        text: 'การจัดทำงบประมาณประจำปีขององค์กรเป็นกระบวนการที่ต้องอาศัยความร่วมมือจากทุกหน่วยงาน โดยฝ่ายการเงินทำหน้าที่เป็นศูนย์กลางในการรวบรวม วิเคราะห์ และนำเสนอต่อคณะกรรมการบริหาร'
      },
      {
        type: 'list',
        style: 'ordered',
        items: [
          'ฝ่ายแผนงานกำหนดกรอบนโยบายและเพดานงบประมาณ (กรกฎาคม)',
          'แต่ละหน่วยงานจัดทำคำขอตั้งงบประมาณรายจ่ายประจำปี (สิงหาคม)',
          'ฝ่ายการเงินรวบรวมและวิเคราะห์ความเหมาะสมของคำขอ (กันยายน)',
          'นำเสนอคณะกรรมการบริหารพิจารณาอนุมัติ (ตุลาคม)',
          'จัดสรรงบประมาณและแจ้งหน่วยงาน (พฤศจิกายน)'
        ]
      },
      {
        type: 'callout',
        icon: 'warning',
        text: 'หน่วยงานที่ไม่ส่งคำขอตั้งงบประมาณภายในกำหนด จะถูกจัดสรรงบประมาณตามฐานปีก่อนหน้าเท่านั้น'
      }
    ]
  },
  {
    id: 'achv-fin-001',
    department: 'finance',
    category: 'achievement',
    title: 'สรุปผลการดำเนินงานด้านการเงิน ไตรมาส 3/2569',
    updatedAt: '2026-10-15T16:00:00+07:00',
    blocks: [
      {
        type: 'paragraph',
        text: 'ผลการดำเนินงานด้านการเงินในไตรมาสที่ 3 ของปีงบประมาณ 2569 แสดงให้เห็นถึงประสิทธิภาพในการบริหารจัดการรายรับ-รายจ่ายที่ดีขึ้นอย่างต่อเนื่อง'
      },
      {
        type: 'list',
        style: 'unordered',
        items: [
          'รายได้รวม 3,450 ล้านบาท (เพิ่มขึ้น 8.2% จากไตรมาสเดียวกันของปีก่อน)',
          'อัตราการเบิกจ่ายงบลงทุน 78.5% (สูงกว่าเป้าหมาย 75%)',
          'ลดต้นทุนการดำเนินงานได้ 120 ล้านบาท จากโครงการ Cost Optimization',
          'อัตราส่วนหนี้สินต่อทุน (D/E Ratio) อยู่ที่ 0.85 (ต่ำกว่าเกณฑ์ที่กำหนดไว้ที่ 1.5)'
        ]
      },
      {
        type: 'callout',
        icon: 'success',
        text: 'ผลการจัดอันดับเครดิตองค์กรโดย TRIS Rating คงอยู่ที่ระดับ AA+ แนวโน้มคงที่ (Stable Outlook)'
      }
    ]
  },
  {
    id: 'proc-it-001',
    department: 'it',
    category: 'process',
    title: 'กระบวนการพัฒนาและบำรุงรักษาระบบสารสนเทศ',
    updatedAt: '2026-11-12T11:00:00+07:00',
    blocks: [
      {
        type: 'paragraph',
        text: 'ฝ่ายเทคโนโลยีสารสนเทศใช้กระบวนการพัฒนาระบบแบบ Agile-Waterfall Hybrid เพื่อให้เกิดความยืดหยุ่นในการพัฒนาควบคู่กับการควบคุมคุณภาพตามมาตรฐาน ISO/IEC 27001'
      },
      {
        type: 'list',
        style: 'ordered',
        items: [
          'รับ Change Request จากหน่วยงานผ่านระบบ Service Desk',
          'วิเคราะห์ผลกระทบ (Impact Analysis) และประเมินทรัพยากร',
          'ออกแบบและพัฒนาระบบ (Sprint-based, 2 สัปดาห์ต่อรอบ)',
          'ทดสอบระบบ (Unit Test → Integration Test → UAT)',
          'ขออนุมัติ Change Advisory Board (CAB) ก่อน Deploy',
          'Deploy ขึ้น Production ในช่วง Maintenance Window (วันเสาร์ 22:00-06:00)'
        ]
      },
      {
        type: 'callout',
        icon: 'warning',
        text: 'ห้าม Deploy ระบบในช่วง Freeze Period (1-15 ของทุกเดือน) ยกเว้นกรณี Critical Bug ที่ได้รับอนุมัติจาก CIO เท่านั้น'
      }
    ]
  },
  {
    id: 'achv-it-001',
    department: 'it',
    category: 'achievement',
    title: 'ผลงานการยกระดับระบบดิจิทัลภายในองค์กร ปี 2569',
    updatedAt: '2026-11-01T13:00:00+07:00',
    blocks: [
      {
        type: 'paragraph',
        text: 'ฝ่ายเทคโนโลยีสารสนเทศได้ดำเนินโครงการ Digital Transformation ตามแผนแม่บทเทคโนโลยีสารสนเทศขององค์กร พ.ศ. 2567-2571 โดยในปี 2569 มีผลงานสำคัญดังนี้'
      },
      {
        type: 'list',
        style: 'unordered',
        items: [
          'เปิดใช้งานระบบ ERP (SAP S/4HANA) ครบทุกโมดูลหลัก — ลดเวลาปิดงบจาก 15 วันเหลือ 5 วัน',
          'พัฒนา Mobile App สำหรับพนักงาน (iOS/Android) — ผู้ใช้งาน 95% ของพนักงานทั้งหมด',
          'ยกระดับระบบ Cybersecurity ผ่านมาตรฐาน ISO 27001:2022 — ไม่มีเหตุการณ์ Data Breach ตลอดปี',
          'ติดตั้งระบบ Cloud Infrastructure (Google Cloud) — ลดค่าใช้จ่ายเซิร์ฟเวอร์ 35%'
        ]
      },
      {
        type: 'callout',
        icon: 'success',
        text: 'องค์กรได้รับรางวัล "Digital Government Award 2569" ระดับดีเด่น จากสำนักงานพัฒนารัฐบาลดิจิทัล (DGA)'
      }
    ]
  }
];

export const DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-gis-001',
    title: 'คู่มือการใช้งานระบบแผนที่ออนไลน์',
    category: 'manual',
    categoryName: 'คู่มือ',
    department: 'gis',
    deptName: 'แผนก GIS',
    year: '2569',
    fileType: 'pdf',
    fileSize: '4.8 MB',
    fileUrl: '#',
    publishedAt: '2026-11-10',
    dateText: '10 พ.ย. 2569',
    downloads: 342
  },
  {
    id: 'doc-gis-002',
    title: 'แบบฟอร์มขอใช้ข้อมูลแผนที่',
    category: 'form',
    categoryName: 'แบบฟอร์ม',
    department: 'gis',
    deptName: 'แผนก GIS',
    year: '2569',
    fileType: 'docx',
    fileSize: '1.2 MB',
    fileUrl: '#',
    publishedAt: '2026-11-02',
    dateText: '2 พ.ย. 2569',
    downloads: 185
  },
  {
    id: 'doc-gis-003',
    title: 'ประกาศปรับปรุงระบบแผนที่ออนไลน์',
    category: 'order',
    categoryName: 'ประกาศ/คำสั่ง',
    department: 'gis',
    deptName: 'แผนก GIS',
    year: '2569',
    fileType: 'pdf',
    fileSize: '850 KB',
    fileUrl: '#',
    publishedAt: '2026-11-10',
    dateText: '10 พ.ย. 2569',
    downloads: 210
  },
  {
    id: 'doc-gis-004',
    title: 'มาตรฐานการจัดทำข้อมูลเชิงพื้นที่',
    category: 'manual',
    categoryName: 'คู่มือ',
    department: 'gis',
    deptName: 'แผนก GIS',
    year: '2569',
    fileType: 'pdf',
    fileSize: '3.4 MB',
    fileUrl: '#',
    publishedAt: '2026-10-20',
    dateText: '20 ต.ค. 2569',
    downloads: 142
  },
  {
    id: 'doc-gis-005',
    title: 'รายการชั้นข้อมูลที่ให้บริการ',
    category: 'report',
    categoryName: 'รายงาน',
    department: 'gis',
    deptName: 'แผนก GIS',
    year: '2569',
    fileType: 'xlsx',
    fileSize: '2.1 MB',
    fileUrl: '#',
    publishedAt: '2026-10-12',
    dateText: '12 ต.ค. 2569',
    downloads: 98
  },
  {
    id: 'doc-hr-001',
    title: 'ประกาศรับสมัครพนักงานจ้าง ตำแหน่งเจ้าหน้าที่สำรวจ',
    category: 'order',
    categoryName: 'ประกาศ/คำสั่ง',
    department: 'hr',
    deptName: 'ฝ่าย HR',
    year: '2569',
    fileType: 'pdf',
    fileSize: '620 KB',
    fileUrl: '#',
    publishedAt: '2026-10-25',
    dateText: '25 ต.ค. 2569',
    downloads: 512
  },
  {
    id: 'doc-gis-006',
    title: 'รายงานผลการสำรวจสินทรัพย์ภาคสนาม (ไตรมาส 3)',
    category: 'report',
    categoryName: 'รายงาน',
    department: 'gis',
    deptName: 'แผนก GIS',
    year: '2569',
    fileType: 'pdf',
    fileSize: '6.2 MB',
    fileUrl: '#',
    publishedAt: '2026-11-01',
    dateText: '1 พ.ย. 2569',
    downloads: 77
  },
  {
    id: 'doc-gis-007',
    title: 'แบบฟอร์มคำขอเชื่อมโยงข้อมูลเชิงพื้นที่',
    category: 'form',
    categoryName: 'แบบฟอร์ม',
    department: 'gis',
    deptName: 'แผนก GIS',
    year: '2569',
    fileType: 'docx',
    fileSize: '1.5 MB',
    fileUrl: '#',
    publishedAt: '2026-09-15',
    dateText: '15 ก.ย. 2569',
    downloads: 120
  },
  {
    id: 'doc-it-001',
    title: 'คู่มือการรักษาความมั่นคงปลอดภัยสารสนเทศสำหรับพนักงาน',
    category: 'manual',
    categoryName: 'คู่มือ',
    department: 'it',
    deptName: 'ฝ่าย IT',
    year: '2569',
    fileType: 'pdf',
    fileSize: '5.1 MB',
    fileUrl: '#',
    publishedAt: '2026-10-05',
    dateText: '5 ต.ค. 2569',
    downloads: 430
  },
  {
    id: 'doc-fin-001',
    title: 'แบบฟอร์มขออนุมัติเบิกจ่ายงบประมาณโครงการพิเศษ',
    category: 'form',
    categoryName: 'แบบฟอร์ม',
    department: 'finance',
    deptName: 'ฝ่ายการเงิน',
    year: '2569',
    fileType: 'docx',
    fileSize: '890 KB',
    fileUrl: '#',
    publishedAt: '2026-09-20',
    dateText: '20 ก.ย. 2569',
    downloads: 310
  }
];

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    day: '10',
    month: 'พ.ย.',
    year: '69',
    dateText: '10 พ.ย. 2569',
    department: 'gis',
    deptName: 'แผนก GIS',
    type: 'notice',
    typeName: 'ประกาศ',
    title: 'ปิดปรับปรุงระบบแผนที่ออนไลน์ชั่วคราว ช่วงวันหยุดสุดสัปดาห์ (15-16 พ.ย.)'
  },
  {
    id: 'ann-2',
    day: '06',
    month: 'พ.ย.',
    year: '69',
    dateText: '06 พ.ย. 2569',
    department: 'gis',
    deptName: 'แผนก GIS',
    type: 'guideline',
    typeName: 'แนวปฏิบัติ',
    title: 'แนวทางการใช้งานระบบแผนที่สำหรับพนักงานใหม่ ประจำปี 2569'
  },
  {
    id: 'ann-3',
    day: '30',
    month: 'ต.ค.',
    year: '69',
    dateText: '30 ต.ค. 2569',
    department: 'gis',
    deptName: 'แผนก GIS',
    type: 'achievement',
    typeName: 'ผลงาน',
    title: 'อัปเดตข้อมูลแนวเขตพื้นที่ให้บริการประจำไตรมาส ครบถ้วน 12 เขต'
  },
  {
    id: 'ann-4',
    day: '25',
    month: 'ต.ค.',
    year: '69',
    dateText: '25 ต.ค. 2569',
    department: 'hr',
    deptName: 'ฝ่าย HR',
    type: 'job',
    typeName: 'รับสมัครงาน',
    title: 'รับสมัครพนักงานจ้าง ตำแหน่งเจ้าหน้าที่สำรวจข้อมูลภาคสนาม จำนวน 5 อัตรา'
  },
  {
    id: 'ann-5',
    day: '18',
    month: 'ต.ค.',
    year: '69',
    dateText: '18 ต.ค. 2569',
    department: 'it',
    deptName: 'ฝ่าย IT',
    type: 'notice',
    typeName: 'ประกาศ',
    title: 'ซ่อมบำรุงระบบเครือข่ายและระบบสำรองข้อมูลประจำเดือน ตุลาคม 2569'
  }
];

export const STAFF: StaffMember[] = [
  {
    id: 'staff-gis-001',
    name: 'ทดสอบ ระบบสารสนเทศ',
    position: 'หัวหน้าแผนก GIS',
    role: 'ผู้บริหารแผนก',
    department: 'gis',
    email: 'testing.gis.01@example.com',
    phone: '000-000-0001',
    photoUrl: '/assets/images/placeholder-staff.png',
    createdAt: '2026-01-10T08:30:00Z'
  },
  {
    id: 'staff-gis-002',
    name: 'ตัวอย่าง โปรไฟล์',
    position: 'วิศวกรระบบ',
    role: 'เจ้าหน้าที่เทคนิค',
    department: 'gis',
    email: 'sample.gis.02@example.com',
    phone: '000-000-0002',
    photoUrl: '',
    createdAt: '2026-02-15T09:00:00Z'
  },
  {
    id: 'staff-it-001',
    name: 'จำลอง ข้อมูล',
    position: 'หัวหน้าฝ่าย IT',
    role: 'ผู้บริหารฝ่าย',
    department: 'it',
    email: 'demo.it.01@example.com',
    phone: '000-000-0003',
    photoUrl: '/assets/images/placeholder-staff.png',
    createdAt: '2026-01-20T08:00:00Z'
  },
  {
    id: 'staff-it-002',
    name: 'ทดสอบ ระบบ',
    position: 'นักพัฒนาซอฟต์แวร์',
    role: 'เจ้าหน้าที่ไอที',
    department: 'it',
    email: 'example.it.02@example.com',
    phone: '000-000-0004',
    photoUrl: '',
    createdAt: '2026-03-05T08:45:00Z'
  },
  {
    id: 'staff-hr-001',
    name: 'ตัวอย่าง บุคลากร',
    position: 'หัวหน้าฝ่าย HR',
    role: 'ผู้บริหารฝ่าย',
    department: 'hr',
    email: 'sample.hr.01@example.com',
    phone: '000-000-0005',
    photoUrl: '/assets/images/placeholder-staff.png',
    createdAt: '2026-01-05T08:15:00Z'
  },
  {
    id: 'staff-hr-002',
    name: 'จำลอง ทดสอบ',
    position: 'เจ้าหน้าที่บุคคล',
    role: 'เจ้าหน้าที่ธุรการ',
    department: 'hr',
    email: 'demo.hr.02@example.com',
    phone: '000-000-0006',
    photoUrl: '',
    createdAt: '2026-04-10T09:30:00Z'
  },
  {
    id: 'staff-fin-001',
    name: 'ทดสอบ การเงิน',
    position: 'หัวหน้าฝ่ายการเงิน',
    role: 'ผู้บริหารฝ่าย',
    department: 'finance',
    email: 'testing.fin.01@example.com',
    phone: '000-000-0007',
    photoUrl: '/assets/images/placeholder-staff.png',
    createdAt: '2026-01-12T08:20:00Z'
  },
  {
    id: 'staff-fin-002',
    name: 'ตัวอย่าง บัญชี',
    position: 'นักบัญชี',
    role: 'เจ้าหน้าที่การเงิน',
    department: 'finance',
    email: 'sample.fin.02@example.com',
    phone: '000-000-0008',
    photoUrl: '',
    createdAt: '2026-02-28T09:10:00Z'
  },
  {
    id: 'staff-ops-001',
    name: 'จำลอง ปฏิบัติการ',
    position: 'หัวหน้าฝ่ายปฏิบัติการ',
    role: 'ผู้บริหารฝ่าย',
    department: 'ops',
    email: 'demo.ops.01@example.com',
    phone: '000-000-0009',
    photoUrl: '/assets/images/placeholder-staff.png',
    createdAt: '2026-01-08T07:45:00Z'
  },
  {
    id: 'staff-ops-002',
    name: 'ทดสอบ ระบบส่ง',
    position: 'วิศวกรระบบส่ง',
    role: 'เจ้าหน้าที่เทคนิค',
    department: 'ops',
    email: 'example.ops.02@example.com',
    phone: '000-000-0010',
    photoUrl: '',
    createdAt: '2026-05-01T08:00:00Z'
  },
  {
    id: 'staff-plan-001',
    name: 'ตัวอย่าง วางแผน',
    position: 'หัวหน้าฝ่ายวางแผน',
    role: 'ผู้บริหารฝ่าย',
    department: 'planning',
    email: 'sample.plan.01@example.com',
    phone: '000-000-0011',
    photoUrl: '/assets/images/placeholder-staff.png',
    createdAt: '2026-01-03T08:10:00Z'
  },
  {
    id: 'staff-plan-002',
    name: 'จำลอง ยุทธศาสตร์',
    position: 'นักวางแผน',
    role: 'เจ้าหน้าที่วางแผน',
    department: 'planning',
    email: 'demo.plan.02@example.com',
    phone: '000-000-0012',
    photoUrl: '',
    createdAt: '2026-03-20T09:00:00Z'
  },
  {
    id: 'staff-legal-001',
    name: 'ทดสอบ กฎหมาย',
    position: 'หัวหน้าฝ่ายกฎหมาย',
    role: 'ผู้บริหารฝ่าย',
    department: 'legal',
    email: 'testing.legal.01@example.com',
    phone: '000-000-0013',
    photoUrl: '/assets/images/placeholder-staff.png',
    createdAt: '2026-01-15T08:30:00Z'
  },
  {
    id: 'staff-legal-002',
    name: 'ตัวอย่าง สัญญา',
    position: 'นักกฎหมาย',
    role: 'เจ้าหน้าที่กฎหมาย',
    department: 'legal',
    email: 'sample.legal.02@example.com',
    phone: '000-000-0014',
    photoUrl: '',
    createdAt: '2026-04-05T09:15:00Z'
  }
];
