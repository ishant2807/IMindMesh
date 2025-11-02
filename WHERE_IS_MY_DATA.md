# 🗺️ Where Is My Data? Complete Guide

## 📊 Your Data Flow

```
User Upload → Frontend (React) → Backend (Express) → Supabase Cloud
                                                    ↓
                                            [Storage + Database]
```

## 🌐 Where to See Your Data

### 1. Supabase Dashboard (Main Control Panel)
**URL**: https://supabase.com/dashboard/project/xrfoihubimcwlqfjiqlt

#### A. Database Tables
- Go to: **Table Editor** (left sidebar)
- You'll see all your tables: `materials`, etc.
- Click any table to see rows, add/edit/delete data
- **This is where uploaded file metadata is stored**

#### B. Storage (Files)
- Go to: **Storage** (left sidebar)
- Click on `materials` bucket
- You'll see all uploaded files here
- Click any file to view/download
- **This is where actual PDF/image files are stored**

#### C. SQL Editor
- Go to: **SQL Editor** (left sidebar)
- Run queries to see data:
  ```sql
  SELECT * FROM materials ORDER BY created_at DESC LIMIT 10;
  ```

#### D. API Logs
- Go to: **Logs** → **API**
- See all requests to your database in real-time
- Great for debugging

### 2. Your Backend Server (Local)
**URL**: http://localhost:3001

#### Test Endpoints:

**Health Check**:
```bash
curl http://localhost:3001/api/health
```

**List Materials**:
```bash
curl http://localhost:3001/api/data/materials
```

**Upload File**:
```bash
curl -X POST http://localhost:3001/api/upload \
  -F "file=@./README.md" \
  -F "title=Test Upload" \
  -F "extractText=machine learning neural networks"
```

### 3. Your Frontend (Browser)
**URL**: http://localhost:5173

#### Data Tab (You Already Saw This!)
- Click "Data" in navbar
- Enter table name: `materials`
- Click "Load"
- See all rows from Supabase

## 📁 Your Project Structure

```
d:\IMindMesh\
│
├── Frontend (React + Vite)
│   ├── src/
│   │   ├── lib/
│   │   │   └── supabaseClient.js       ← Connects to Supabase (anon key)
│   │   ├── services/
│   │   │   ├── db.js                   ← CRUD helpers (selectAll, insertOne, etc.)
│   │   │   ├── storage.js              ← Local storage (old, for localStorage)
│   │   │   └── aiService.js            ← Keyword extraction (client-side)
│   │   ├── components/
│   │   │   ├── TableList.jsx           ← "Data" tab component
│   │   │   ├── UploadSection.jsx       ← Upload UI
│   │   │   └── ...
│   │   └── App.jsx                     ← Main app
│   └── package.json
│
├── Backend (Express + Node)
│   └── server/
│       ├── index.js                    ← Main server (port 3001)
│       ├── config/
│       │   └── supabase.js             ← Connects to Supabase (service role key)
│       ├── routes/
│       │   ├── upload.js               ← POST /api/upload (file upload + keywords)
│       │   └── data.js                 ← GET/POST/DELETE /api/data/:table
│       ├── utils/
│       │   └── keywordExtractor.js     ← Keyword extraction logic
│       └── README.md                   ← API documentation
│
├── Configuration
│   ├── .env                            ← Your secrets (gitignored)
│   ├── .env.example                    ← Template for others
│   └── .gitignore                      ← Protects .env
│
└── Documentation
    ├── BACKEND_QUICKSTART.md           ← How to run backend
    ├── SECURITY_FIXES.md               ← Security guide
    └── WHERE_IS_MY_DATA.md             ← This file!
```

## 🔍 How to Verify Data is Going to Supabase

### Method 1: Supabase Dashboard (Easiest)
1. Open: https://supabase.com/dashboard/project/xrfoihubimcwlqfjiqlt
2. Go to **Table Editor** → `materials`
3. You should see rows with:
   - `id`, `title`, `file_name`, `file_url`, `keywords`, `topics`, `created_at`

### Method 2: Frontend Data Tab
1. Open: http://localhost:5173
2. Click **"Data"** tab
3. Enter: `materials`
4. Click **"Load"**
5. See rows from Supabase

### Method 3: Backend API
```bash
curl http://localhost:3001/api/data/materials
```

### Method 4: SQL Query
In Supabase SQL Editor:
```sql
SELECT 
  id,
  title,
  file_name,
  keywords,
  created_at
FROM materials
ORDER BY created_at DESC
LIMIT 5;
```

## 🎬 Demo Flow: Upload to Supabase

### Step 1: Upload a File
```bash
curl -X POST http://localhost:3001/api/upload \
  -F "file=@./README.md" \
  -F "title=My Study Notes" \
  -F "extractText=machine learning deep learning neural networks artificial intelligence"
```

**Response**:
```json
{
  "success": true,
  "file": {
    "id": "abc-123",
    "name": "README.md",
    "url": "https://xrfoihubimcwlqfjiqlt.supabase.co/storage/v1/object/public/materials/1234-README.md",
    "size": 5432
  },
  "keywords": ["Machine", "Learning", "Neural", "Networks", "Artificial"],
  "topics": ["Machine", "Learning", "Neural"]
}
```

### Step 2: Verify in Supabase Dashboard

**Database (Table Editor)**:
- Go to `materials` table
- See new row with:
  - `title`: "My Study Notes"
  - `keywords`: ["Machine", "Learning", ...]
  - `file_url`: "https://..."

**Storage**:
- Go to Storage → `materials` bucket
- See file: `1234-README.md`
- Click to download/view

### Step 3: Verify in Frontend
- Open Data tab
- Load `materials` table
- See your uploaded file

## 🎥 Show Your Backend & Database to Others

### Option 1: Share Supabase Dashboard (Read-Only)
1. Go to: Settings → API
2. Copy your **project URL**: `https://xrfoihubimcwlqfjiqlt.supabase.co`
3. Share Table Editor screenshots

### Option 2: Deploy Backend & Share API
Deploy to Railway/Render/Vercel and share:
- `https://your-backend.railway.app/api/health`
- `https://your-backend.railway.app/api/data/materials`

### Option 3: Create a Demo Video
Record:
1. Upload file via backend
2. Show Supabase Dashboard (table + storage)
3. Show frontend Data tab
4. Show API response in terminal

### Option 4: Share API Documentation
Share `server/README.md` with:
- Endpoint descriptions
- Example requests/responses
- cURL commands

## 🔗 Quick Links

| Resource | URL |
|----------|-----|
| **Supabase Dashboard** | https://supabase.com/dashboard/project/xrfoihubimcwlqfjiqlt |
| **Table Editor** | Dashboard → Table Editor |
| **Storage** | Dashboard → Storage → materials |
| **SQL Editor** | Dashboard → SQL Editor |
| **API Logs** | Dashboard → Logs → API |
| **Backend Health** | http://localhost:3001/api/health |
| **Backend API Docs** | `server/README.md` |
| **Frontend** | http://localhost:5173 |
| **Frontend Data Tab** | http://localhost:5173 → Click "Data" |

## 🧪 Test Right Now

### 1. Check Backend is Running
```bash
curl http://localhost:3001/api/health
```
Expected: `{"status":"ok","message":"MindMesh backend is running"}`

### 2. Check Supabase Connection
```bash
curl http://localhost:3001/api/data/materials
```
Expected: `{"success":true,"data":[...],"count":0}` (or your data)

### 3. Upload Test File
```bash
curl -X POST http://localhost:3001/api/upload \
  -F "file=@./package.json" \
  -F "title=Test Upload" \
  -F "extractText=test keywords extraction"
```

### 4. Verify in Supabase
- Open Dashboard → Table Editor → materials
- See new row
- Open Storage → materials
- See uploaded file

## 📸 Screenshots to Take for Demo

1. **Supabase Table Editor** showing materials table with data
2. **Supabase Storage** showing uploaded files
3. **Backend terminal** showing server running
4. **Frontend Data tab** showing loaded materials
5. **API response** in terminal after upload
6. **SQL query results** from SQL Editor

## 🎓 Explain to Others

> "My app uses a 3-tier architecture:
> 
> 1. **Frontend (React)**: User interface at localhost:5173
> 2. **Backend (Express)**: API server at localhost:3001 that handles uploads and keyword extraction
> 3. **Database (Supabase)**: Cloud PostgreSQL database + file storage
> 
> When a user uploads a file:
> - Frontend sends file to backend
> - Backend extracts keywords using frequency analysis
> - Backend uploads file to Supabase Storage
> - Backend saves metadata (title, keywords, file URL) to Supabase Database
> - All data is stored in the cloud at supabase.co
> 
> You can see the data in the Supabase Dashboard or query it via the API."

## 🚀 Next Steps

1. Create the `materials` table in Supabase (see BACKEND_QUICKSTART.md)
2. Create the `materials` storage bucket
3. Start both servers (frontend + backend)
4. Upload a test file
5. Verify in Supabase Dashboard
6. Take screenshots for your demo!
