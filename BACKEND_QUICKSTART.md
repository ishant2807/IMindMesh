# Backend Quick Start Guide

## ✅ What's Done

- ✅ Supabase SDK installed (`@supabase/supabase-js`)
- ✅ Express backend created in `server/` folder
- ✅ Upload endpoint with keyword extraction
- ✅ Data API for CRUD operations
- ✅ Frontend "Data" view to list Supabase tables

## 🚀 How to Run

### 1. Configure Supabase Service Key

Open `.env` and replace `YOUR_SERVICE_ROLE_KEY_HERE` with your actual service role key:

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your_actual_key
```

**Get it from**: Supabase Dashboard → Settings → API → `service_role` key (secret)

### 2. Create Supabase Resources

#### A. Storage Bucket
1. Go to Supabase Dashboard → Storage
2. Create a new bucket named `materials`
3. Set it to public if you want direct file access

#### B. Materials Table
Run this SQL in Supabase SQL Editor:

```sql
CREATE TABLE materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  file_name TEXT,
  file_url TEXT,
  file_size INTEGER,
  mime_type TEXT,
  keywords TEXT[],
  topics JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (optional, adjust policies as needed)
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "Service role has full access" ON materials
  FOR ALL USING (auth.role() = 'service_role');

-- Allow public read (optional for testing)
CREATE POLICY "Public can read materials" ON materials
  FOR SELECT USING (true);
```

### 3. Start the Backend

Open a **new terminal** and run:

```bash
npm run server
```

You should see:
```
🚀 Backend server running on http://localhost:3001
```

### 4. Start the Frontend

In your **existing terminal** (or another new one):

```bash
npm run dev
```

## 🧪 Test the Backend

### Test 1: Health Check
```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{"status":"ok","message":"MindMesh backend is running"}
```

### Test 2: Upload File with Keywords
```bash
curl -X POST http://localhost:3001/api/upload \
  -F "file=@./README.md" \
  -F "title=Test Upload" \
  -F "extractText=Machine learning neural networks deep learning artificial intelligence data science"
```

Expected response:
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "file": { "id": "...", "name": "README.md", "url": "https://..." },
  "keywords": ["Machine", "Learning", "Neural", ...],
  "topics": ["Machine", "Learning", ...]
}
```

### Test 3: List Materials
```bash
curl http://localhost:3001/api/data/materials
```

## 🎨 Test the Frontend Data View

1. Open your app: http://localhost:5173
2. Click **"Data"** in the navbar
3. Enter table name: `materials`
4. Click **"Load"**
5. You should see rows from your materials table

## 📁 Backend Structure

```
server/
├── index.js              # Main Express app
├── config/
│   └── supabase.js       # Supabase admin client
├── routes/
│   ├── upload.js         # POST /api/upload
│   └── data.js           # GET/POST/DELETE /api/data/:table
├── utils/
│   └── keywordExtractor.js  # Keyword extraction logic
├── README.md             # Detailed API docs
└── test-upload.http      # HTTP test requests
```

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/upload` | Upload file + extract keywords |
| GET | `/api/data/:table` | List all rows from table |
| POST | `/api/data/:table` | Insert a row |
| DELETE | `/api/data/:table/:id` | Delete a row by ID |

## 🔧 Next Steps

1. **Integrate upload in frontend**: Update `UploadSection.jsx` to call `http://localhost:3001/api/upload`
2. **Add authentication**: Protect endpoints with JWT or Supabase auth
3. **Improve keyword extraction**: Use NLP libraries like `natural` or `compromise`
4. **Add PDF text extraction**: Use `pdf-parse` to extract text from PDFs before keyword extraction
5. **Deploy backend**: Use Railway, Render, or Vercel serverless functions

## 🐛 Troubleshooting

**Error: "Supabase service credentials missing"**
- Add `SUPABASE_SERVICE_ROLE_KEY` to `.env`

**Error: "relation 'materials' does not exist"**
- Create the `materials` table using the SQL above

**Error: "The resource was not found"**
- Create the `materials` storage bucket in Supabase Dashboard

**CORS errors**
- Backend already has CORS enabled. If issues persist, check browser console.

## 📚 Resources

- Backend API docs: `server/README.md`
- Test requests: `server/test-upload.http` (use REST Client extension in VS Code)
- Supabase docs: https://supabase.com/docs
