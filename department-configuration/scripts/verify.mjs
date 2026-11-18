import { fetchCollection } from '../lib/repository.ts';

async function test() {
  const depts = await fetchCollection('departments');
  console.log('Departments:', depts.length, depts.map(d => d.id).join(', '));
  
  const docs = await fetchCollection('documents');
  console.log('Documents:', docs.length, docs[0]?.title);
  
  const articles = await fetchCollection('articles');
  console.log('Articles:', articles.length, articles[0]?.title);
  
  const announcements = await fetchCollection('announcements');
  console.log('Announcements:', announcements.length, announcements[0]?.title);
  
  const staff = await fetchCollection('staff');
  console.log('Staff:', staff.length, staff[0]?.name);
}

test().catch(console.error);
