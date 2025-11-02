import express from 'express';
import { supabaseAdmin } from '../config/supabase.js';

const router = express.Router();

// GET /api/data/:table - Get all rows from a table
router.get('/:table', async (req, res) => {
  try {
    const { table } = req.params;
    const { orderBy = 'created_at', ascending = 'false' } = req.query;

    const query = supabaseAdmin.from(table).select('*');
    
    if (orderBy) {
      query.order(orderBy, { ascending: ascending === 'true' });
    }

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ success: true, data, count: data?.length || 0 });
  } catch (error) {
    console.error('Data fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch data', details: error.message });
  }
});

// POST /api/data/:table - Insert a row
router.post('/:table', async (req, res) => {
  try {
    const { table } = req.params;
    const payload = req.body;

    const { data, error } = await supabaseAdmin
      .from(table)
      .insert(payload)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Insert error:', error);
    res.status(500).json({ error: 'Failed to insert data', details: error.message });
  }
});

// DELETE /api/data/:table/:id - Delete a row by ID
router.delete('/:table/:id', async (req, res) => {
  try {
    const { table, id } = req.params;

    const { error } = await supabaseAdmin
      .from(table)
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ success: true, message: 'Row deleted' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete data', details: error.message });
  }
});

export default router;
