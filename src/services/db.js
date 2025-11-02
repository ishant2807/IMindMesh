import { supabase } from '../lib/supabaseClient';

export async function selectAll(table, { orderBy = 'created_at', ascending = false } = {}) {
  const query = supabase.from(table).select('*');
  const { data, error } = orderBy
    ? await query.order(orderBy, { ascending })
    : await query;
  if (error) throw error;
  return data;
}

export async function insertOne(table, payload) {
  const { data, error } = await supabase.from(table).insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function updateById(table, id, patch, idColumn = 'id') {
  const { data, error } = await supabase.from(table).update(patch).eq(idColumn, id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteById(table, id, idColumn = 'id') {
  const { error } = await supabase.from(table).delete().eq(idColumn, id);
  if (error) throw error;
  return true;
}
