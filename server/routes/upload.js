import express from 'express';
import multer from 'multer';
import { supabaseAdmin } from '../config/supabase.js';
import { extractKeywords, extractTopics } from '../utils/keywordExtractor.js';

const router = express.Router();

// Allowed file types
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'text/plain',
  'text/markdown',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
  'image/jpg'
];

// Configure multer for file uploads (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed. Allowed types: PDF, TXT, MD, DOC, DOCX, PNG, JPG`));
    }
  }
});

// POST /api/upload - Upload file and extract keywords
router.post('/', (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Max size: 10MB' });
      }
      return res.status(400).json({ error: 'Upload error', details: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { originalname, mimetype, buffer, size } = req.file;
    const { title, extractText } = req.body;

    // Upload to Supabase Storage (optional - you can also store locally)
    const fileName = `${Date.now()}-${originalname}`;
    const { data: uploadData, error: uploadError } = await supabaseAdmin
      .storage
      .from('materials') // Make sure this bucket exists in Supabase
      .upload(fileName, buffer, {
        contentType: mimetype,
        upsert: false
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      
      // Provide helpful error messages
      if (uploadError.message.includes('not found')) {
        return res.status(500).json({ 
          error: 'Storage bucket "materials" not found', 
          details: 'Create the bucket in Supabase Dashboard → Storage → New bucket → name: materials',
          originalError: uploadError.message 
        });
      }
      
      return res.status(500).json({ error: 'Failed to upload file to storage', details: uploadError.message });
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin
      .storage
      .from('materials')
      .getPublicUrl(fileName);

    // Extract keywords from text if provided
    let keywords = [];
    let topics = [];
    if (extractText) {
      keywords = extractKeywords(extractText, 10);
      topics = extractTopics(extractText, 5);
    }

    // Save metadata to database (optional - create a 'materials' table)
    const materialData = {
      title: title || originalname,
      file_name: originalname,
      file_url: urlData.publicUrl,
      file_size: size,
      mime_type: mimetype,
      keywords: keywords.map(k => k.keyword),
      topics: topics,
      created_at: new Date().toISOString()
    };

    const { data: dbData, error: dbError } = await supabaseAdmin
      .from('materials')
      .insert(materialData)
      .select()
      .single();

    if (dbError) {
      console.warn('Database insert warning:', dbError.message);
      // Continue even if DB insert fails - file is uploaded
    }

    res.json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        id: dbData?.id,
        name: originalname,
        url: urlData.publicUrl,
        size,
        mimeType: mimetype
      },
      keywords: keywords.map(k => k.keyword),
      topics: topics.map(t => t.name)
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed', details: error.message });
  }
});

export default router;
