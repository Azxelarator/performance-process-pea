// Shapes of the Firestore documents. `id` is the document key.

export type DepartmentStat = { id?: string; label: string; value: string; unit?: string };
export type Mission = { step: number; title: string; description: string };
export type Person = { name: string; position: string; role?: string };
export type Contact = { location?: string; phone?: string; email?: string; hours?: string };

export type Department = {
  id: string;
  name: string;
  shortName?: string;
  nameEn?: string;
  heroDescription?: string;
  overviewTitle?: string;
  overviewText?: string;
  stats?: DepartmentStat[];
  missions?: Mission[];
  personnel?: Person[];
  contact?: Contact;
  updatedAt?: string;
};

export type CalloutTone = 'info' | 'warning' | 'success';

export type Block =
  | { type: 'paragraph'; text: string }
  | { type: 'callout'; icon: CalloutTone; text: string }
  | { type: 'image'; url: string; caption: string }
  | { type: 'list'; style: 'ordered' | 'unordered'; items: string[] };

export type BlockType = Block['type'];

export type ArticleCategoryId = 'process' | 'achievement' | 'notice' | 'document';

export type Article = {
  id: string;
  department: string;
  category: ArticleCategoryId;
  title: string;
  updatedAt: string;
  blocks: Block[];
};

export type DocCategoryId = 'manual' | 'form' | 'report' | 'order';
export type FileType = 'pdf' | 'docx' | 'xlsx';

export type DocumentItem = {
  id: string;
  title: string;
  category: DocCategoryId;
  categoryName: string;
  department: string;
  deptName: string;
  year: string;
  fileType: FileType;
  fileSize: string;
  fileUrl: string;
  publishedAt?: string;
  dateText?: string;
  downloads?: number;
};

export type AnnouncementType = 'notice' | 'guideline' | 'achievement' | 'job';

export type Announcement = {
  id: string;
  day: string;
  month: string;
  year: string;
  dateText: string;
  department: string;
  deptName: string;
  type: AnnouncementType;
  typeName: string;
  title: string;
};

export type StaffMember = {
  id: string;
  name: string;
  position: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  photoUrl: string;
  createdAt: string;
};

export type Role = 'super_admin' | 'editor';

export type UserPermission = {
  email: string;
  role: Role;
  /** Department the editor may manage; `'all'` for super admins. */
  departmentId: string;
};
