import { supabase, SUPABASE_URL } from './supabaseClient';

// ฟังก์ชันดึงข้อมูลทั้งหมดจาก Supabase
// เราจะดึงแยกทีละ Table แล้วนำมารวมเป็น Object เดียวเพื่อให้เข้ากับ Structure เดิมของ App
export const fetchDataFromSupabase = async () => {
  try {
    // Check configuration: Ensure URL is real and not the placeholder
    if (!SUPABASE_URL || !SUPABASE_URL.includes('supabase.co') || SUPABASE_URL.includes('your-project-id')) {
      console.warn("Supabase URL not configured. Falling back to mock data.");
      return null;
    }

    const tables = ['Users', 'Buildings', 'Floors', 'Rooms', 'Residents', 'Bills'];
    const results: Record<string, any[]> = {};

    // Parallel fetch for speed
    await Promise.all(tables.map(async (table) => {
      const { data, error } = await supabase.from(table).select('*');
      if (error) {
        console.error(`Error fetching ${table}:`, error);
        results[table] = [];
      } else {
        results[table] = data || [];
      }
    }));

    return results;
  } catch (error) {
    console.error("Error connecting to Supabase:", error);
    return null;
  }
};

// ฟังก์ชันบันทึกข้อมูล (Upsert / Delete)
export const saveDataToSupabase = async (
  category: string, // Table name e.g. 'Buildings', 'Residents'
  action: 'ADD' | 'DELETE',
  data: Record<string, any>
) => {
  if (!SUPABASE_URL || !SUPABASE_URL.includes('supabase.co') || SUPABASE_URL.includes('your-project-id')) {
    console.warn("Supabase URL not configured. Action skipped.");
    return;
  }

  try {
    if (action === 'ADD') {
      // ADD ใช้ Upsert (Insert or Update based on Primary Key 'id')
      const { error } = await supabase
        .from(category)
        .upsert(data, { onConflict: 'id' });

      if (error) throw error;
      console.log(`Supabase: Upserted to [${category}]`, data);

    } else if (action === 'DELETE') {
      // DELETE
      const { error } = await supabase
        .from(category)
        .delete()
        .eq('id', data.id);

      if (error) throw error;
      console.log(`Supabase: Deleted from [${category}] ID: ${data.id}`);
    }
  } catch (error) {
    console.error(`Error saving to Supabase [${category}]:`, error);
  }
};
