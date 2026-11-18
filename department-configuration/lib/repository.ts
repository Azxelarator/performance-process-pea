// Repository layer with Supabase integration and mock data fallback.
import { DOC_CATEGORY_NAMES, formatDate, thaiYear } from './format';
import { ANNOUNCEMENTS, ARTICLES, DEPARTMENTS, DOCUMENTS, STAFF } from './mock-data';
import { isSupabaseConfigured, supabase } from './supabase';
import type { Announcement, AnnouncementType, Article, Department, DocCategoryId, DocumentItem, StaffMember, UserPermission } from './types';

type Collections = {
  departments: Department;
  articles: Article;
  documents: DocumentItem;
  announcements: Announcement;
  staff: StaffMember;
};

export type CollectionName = keyof Collections;

const FALLBACK: { [K in CollectionName]: Collections[K][] } = {
  departments: DEPARTMENTS,
  articles: ARTICLES,
  documents: DOCUMENTS,
  announcements: ANNOUNCEMENTS,
  staff: STAFF,
};

const THAI_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

const ANNOUNCEMENT_TYPE_NAMES: Record<string, string> = {
  notice: 'ประกาศ',
  guideline: 'แนวปฏิบัติ',
  achievement: 'ผลงาน',
  job: 'รับสมัครงาน',
};

// Fast in-memory map of department id -> label
let deptLabelCache: Record<string, string> | null = null;

async function getDeptLabelMap(): Promise<Record<string, string>> {
  if (deptLabelCache) return deptLabelCache;
  const map: Record<string, string> = {};
  for (const d of DEPARTMENTS) {
    map[d.id] = d.shortName || d.name;
  }
  if (isSupabaseConfigured) {
    try {
      const { data } = await supabase.from('departments').select('id, name, short_name');
      if (data) {
        for (const r of data) {
          map[r.id] = r.short_name || r.name;
        }
      }
    } catch {
      // ignore
    }
  }
  deptLabelCache = map;
  return map;
}

/** Reads a collection from Supabase, falling back to mock data if empty or error. */
export async function fetchCollection<K extends CollectionName>(name: K): Promise<Collections[K][]> {
  if (!isSupabaseConfigured) return FALLBACK[name];

  try {
    const deptLabels = await getDeptLabelMap();

    if (name === 'departments') {
      const { data, error } = await supabase.from('departments').select('*').order('name');
      if (error || !data || data.length === 0) return FALLBACK[name];
      return data.map((r) => ({
        id: r.id,
        name: r.name,
        shortName: r.short_name || undefined,
        nameEn: r.name_en || undefined,
        heroDescription: r.hero_description || undefined,
        overviewTitle: r.overview_title || undefined,
        overviewText: r.overview_text || undefined,
        stats: r.stats || [],
        missions: r.missions || [],
        contact: r.contact || {},
        updatedAt: r.updated_at,
      })) as Collections[K][];
    }

    if (name === 'documents') {
      const { data, error } = await supabase.from('documents').select('*').order('published_at', { ascending: false });
      if (error || !data || data.length === 0) return FALLBACK[name];
      return data.map((r) => ({
        id: r.id,
        title: r.title,
        category: r.category as DocCategoryId,
        categoryName: DOC_CATEGORY_NAMES[r.category as DocCategoryId] ?? r.category,
        department: r.department_id,
        deptName: deptLabels[r.department_id] ?? r.department_id,
        year: r.year,
        fileType: r.file_type,
        fileSize: r.file_size || '',
        fileUrl: r.file_url,
        downloads: r.downloads ?? 0,
        publishedAt: r.published_at,
        dateText: formatDate(r.published_at),
      })) as Collections[K][];
    }

    if (name === 'articles') {
      const { data, error } = await supabase.from('articles').select('*').order('updated_at', { ascending: false });
      if (error || !data || data.length === 0) return FALLBACK[name];
      return data.map((r) => ({
        id: r.id,
        department: r.department_id,
        category: r.category,
        title: r.title,
        updatedAt: r.updated_at,
        blocks: r.blocks || [],
      })) as Collections[K][];
    }

    if (name === 'announcements') {
      const { data, error } = await supabase.from('announcements').select('*').order('announcement_date', { ascending: false });
      if (error || !data || data.length === 0) return FALLBACK[name];
      return data.map((r) => {
        const d = r.announcement_date ? new Date(r.announcement_date) : new Date();
        const day = String(d.getDate());
        const month = THAI_MONTHS[d.getMonth()] ?? '';
        const thaiY = d.getFullYear() + 543;
        const year = String(thaiY % 100);
        return {
          id: r.id,
          day,
          month,
          year,
          dateText: `${day} ${month} ${thaiY}`,
          department: r.department_id,
          deptName: deptLabels[r.department_id] ?? r.department_id,
          type: r.type as AnnouncementType,
          typeName: ANNOUNCEMENT_TYPE_NAMES[r.type] ?? 'ประกาศ',
          title: r.title,
        };
      }) as Collections[K][];
    }

    if (name === 'staff') {
      const { data, error } = await supabase.from('staff').select('*').order('sort_order', { ascending: true });
      if (error || !data || data.length === 0) return FALLBACK[name];
      return data.map((r) => ({
        id: r.id,
        name: r.name,
        position: r.position,
        role: r.role || '',
        department: r.department_id,
        email: r.email || '',
        phone: r.phone || '',
        photoUrl: r.photo_url || '',
        createdAt: r.created_at,
      })) as Collections[K][];
    }

    return FALLBACK[name];
  } catch (err) {
    console.warn(`[supabase] "${name}" query failed, using mock data:`, err);
    return FALLBACK[name];
  }
}

/** Upserts an item into Supabase. */
export async function saveItem<K extends CollectionName>(name: K, item: Collections[K]): Promise<void> {
  if (!isSupabaseConfigured) return;

  if (name === 'departments') {
    const d = item as Department;
    await supabase.from('departments').upsert({
      id: d.id,
      name: d.name,
      short_name: d.shortName,
      name_en: d.nameEn,
      hero_description: d.heroDescription,
      overview_title: d.overviewTitle,
      overview_text: d.overviewText,
      stats: d.stats ?? [],
      missions: d.missions ?? [],
      contact: d.contact ?? {},
      updated_at: new Date().toISOString(),
    });
    deptLabelCache = null;
    return;
  }

  if (name === 'documents') {
    const doc = item as DocumentItem;
    await supabase.from('documents').upsert({
      ...(doc.id ? { id: doc.id } : {}),
      department_id: doc.department,
      title: doc.title,
      category: doc.category,
      year: doc.year || thaiYear(new Date()),
      file_type: doc.fileType,
      file_size: doc.fileSize,
      file_url: doc.fileUrl,
      downloads: doc.downloads ?? 0,
      published_at: doc.publishedAt || new Date().toISOString(),
    });
    return;
  }

  if (name === 'articles') {
    const a = item as Article;
    await supabase.from('articles').upsert({
      ...(a.id ? { id: a.id } : {}),
      department_id: a.department,
      category: a.category,
      title: a.title,
      blocks: a.blocks ?? [],
      updated_at: new Date().toISOString(),
    });
    return;
  }

  if (name === 'announcements') {
    const ann = item as Announcement;
    await supabase.from('announcements').upsert({
      ...(ann.id ? { id: ann.id } : {}),
      department_id: ann.department,
      type: ann.type,
      title: ann.title,
      announcement_date: new Date().toISOString().slice(0, 10),
    });
    return;
  }

  if (name === 'staff') {
    const s = item as StaffMember;
    await supabase.from('staff').upsert({
      ...(s.id ? { id: s.id } : {}),
      department_id: s.department,
      name: s.name,
      position: s.position,
      role: s.role,
      email: s.email,
      phone: s.phone,
      photo_url: s.photoUrl,
    });
    return;
  }
}

export async function deleteItem(name: CollectionName, id: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  await supabase.from(name).delete().eq('id', id);
}

export async function fetchUserPermission(email: string): Promise<UserPermission | null> {
  const key = email.trim().toLowerCase();
  if (!key || !isSupabaseConfigured) return null;
  const { data } = await supabase
    .from('user_permissions')
    .select('*')
    .eq('email', key)
    .maybeSingle();

  if (!data) return null;
  return {
    email: data.email,
    role: data.role,
    departmentId: data.department_id,
  };
}

export async function hasAnyUsers(): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  const { count } = await supabase
    .from('user_permissions')
    .select('*', { count: 'exact', head: true });
  return (count ?? 0) > 0;
}

/** Seeds user_permissions with super_admin for the initial bootstrap user. */
export async function seedMockData(email: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const key = email.trim().toLowerCase();
  if (key) {
    await supabase.from('user_permissions').upsert({
      email: key,
      role: 'super_admin',
      department_id: 'all',
      created_at: new Date().toISOString(),
    });
  }
}
