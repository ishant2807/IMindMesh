# 🗄️ Supabase Setup Guide: Tables & Storage

## 📊 What Are Tables and Buckets?

### Tables (Database)
- **What**: PostgreSQL database tables that store structured data (rows and columns)
- **Use for**: Metadata, user info, relationships, searchable data
- **Example**: Store file info (title, keywords, upload date) but not the actual file

### Buckets (Storage)
- **What**: File storage containers (like folders in cloud storage)
- **Use for**: Actual files (PDFs, images, videos, documents)
- **Example**: Store the actual PDF file that users upload

### How They Work Together
```
User uploads "study-notes.pdf"
    ↓
Backend saves file → Storage Bucket (materials/)
    ↓                    └─ stores: study-notes.pdf (actual file)
    ↓
Backend saves metadata → Database Table (materials)
                             └─ stores: {
                                  title: "Study Notes",
                                  file_url: "https://.../study-notes.pdf",
                                  keywords: ["machine", "learning"],
                                  created_at: "2025-11-02"
                                }
```

## 🎯 Step-by-Step: Create Materials Table

### Step 1: Open Supabase Dashboard
1. Go to: https://supabase.com/dashboard
2. Click on your project: `xrfoihubimcwlqfjiqlt`

### Step 2: Open SQL Editor
1. Click **"SQL Editor"** in the left sidebar (icon looks like `</>`)
2. Click **"New query"** button (top right)

### Step 3: Create the Table
Copy and paste this SQL:

```sql
-- Create materials table
CREATE TABLE materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  keywords TEXT[],
  topics JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster searches
CREATE INDEX idx_materials_created_at ON materials(created_at DESC);
CREATE INDEX idx_materials_keywords ON materials USING GIN(keywords);

-- Add a comment to describe the table
COMMENT ON TABLE materials IS 'Stores metadata for uploaded study materials';
```

### Step 4: Run the Query
1. Click **"Run"** button (or press `Ctrl+Enter`)
2. You should see: `Success. No rows returned`

### Step 5: Verify Table Created
1. Click **"Table Editor"** in left sidebar
2. You should see `materials` table listed
3. Click on it to see the columns

## 🔒 Step-by-Step: Enable Row Level Security (RLS)

### Why RLS?
- Controls who can read/write data
- Prevents unauthorized access
- Works even if someone gets your anon key

### Option 1: Public Read, Authenticated Write (Recommended)

```sql
-- Enable RLS on materials table
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

-- Anyone can read materials (good for public study resources)
CREATE POLICY "Anyone can view materials"
  ON materials
  FOR SELECT
  USING (true);

-- Only authenticated users can insert
CREATE POLICY "Authenticated users can insert materials"
  ON materials
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own materials (requires user_id column)
CREATE POLICY "Users can update own materials"
  ON materials
  FOR UPDATE
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- Users can delete their own materials
CREATE POLICY "Users can delete own materials"
  ON materials
  FOR DELETE
  USING (auth.uid()::text = user_id);
```

**Note**: For the update/delete policies to work, add a `user_id` column:
```sql
ALTER TABLE materials ADD COLUMN user_id UUID REFERENCES auth.users(id);
```

### Option 2: Completely Public (Testing Only)

```sql
-- Enable RLS
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

-- Allow all operations for everyone (NOT for production!)
CREATE POLICY "Public access for testing"
  ON materials
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

### Option 3: Completely Private (Authenticated Only)

```sql
-- Enable RLS
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can do anything
CREATE POLICY "Authenticated users only"
  ON materials
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
```

### Option 4: Service Role Only (Backend Only)

```sql
-- Enable RLS
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

-- Only service role (backend) can access
CREATE POLICY "Service role only"
  ON materials
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
```

## 📦 Step-by-Step: Create Storage Bucket

### Step 1: Open Storage
1. In Supabase Dashboard, click **"Storage"** in left sidebar
2. You'll see a list of buckets (probably empty)

### Step 2: Create New Bucket
1. Click **"New bucket"** button (top right)
2. Fill in the form:
   - **Name**: `materials` (must match your backend code)
   - **Public bucket**: ✅ Check this if you want files to be publicly accessible
   - **File size limit**: `10MB` (or your preferred limit)
   - **Allowed MIME types**: Leave empty for all, or specify:
     - `application/pdf`
     - `text/plain`
     - `image/png`
     - `image/jpeg`

3. Click **"Create bucket"**

### Step 3: Verify Bucket Created
- You should see `materials` bucket in the list
- Click on it to see it's empty (no files yet)

### Step 4: Configure Bucket Policies (Optional)

By default, buckets have no access. You need to set policies:

#### Option A: Public Read (Anyone can view files)
1. Click on `materials` bucket
2. Click **"Policies"** tab
3. Click **"New policy"**
4. Choose **"For full customization"**
5. Add this policy:

```sql
-- Allow public to read files
CREATE POLICY "Public can view files"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'materials');
```

#### Option B: Authenticated Upload & Read
```sql
-- Authenticated users can upload
CREATE POLICY "Authenticated users can upload"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'materials' 
    AND auth.role() = 'authenticated'
  );

-- Anyone can read
CREATE POLICY "Anyone can read files"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'materials');
```

#### Option C: Service Role Only (Backend Only)
```sql
-- Only service role (backend) can manage files
CREATE POLICY "Service role full access"
  ON storage.objects
  FOR ALL
  USING (
    bucket_id = 'materials' 
    AND auth.role() = 'service_role'
  );
```

## 🔍 Understanding the Materials Table

### Column Breakdown

| Column | Type | Purpose | Example |
|--------|------|---------|---------|
| `id` | UUID | Unique identifier | `a1b2c3d4-...` |
| `title` | TEXT | Human-readable name | "Machine Learning Notes" |
| `file_name` | TEXT | Original filename | "ml-notes.pdf" |
| `file_url` | TEXT | Supabase storage URL | "https://.../materials/123-ml-notes.pdf" |
| `file_size` | INTEGER | Size in bytes | 1048576 (1MB) |
| `mime_type` | TEXT | File type | "application/pdf" |
| `keywords` | TEXT[] | Array of keywords | ["machine", "learning", "neural"] |
| `topics` | JSONB | Structured topic data | `[{"name": "ML", "importance": 1}]` |
| `created_at` | TIMESTAMPTZ | When uploaded | "2025-11-02T03:27:00Z" |

### Data Types Explained

- **UUID**: Universally unique identifier (auto-generated)
- **TEXT**: Variable-length string
- **INTEGER**: Whole number
- **TEXT[]**: Array of text values
- **JSONB**: JSON data (searchable and indexable)
- **TIMESTAMPTZ**: Timestamp with timezone

## 🧪 Test Your Setup

### Test 1: Insert Data Manually
In SQL Editor:
```sql
INSERT INTO materials (title, file_name, file_url, keywords, topics)
VALUES (
  'Test Material',
  'test.pdf',
  'https://example.com/test.pdf',
  ARRAY['test', 'sample'],
  '[{"name": "Testing", "importance": 1}]'::jsonb
);
```

### Test 2: Query Data
```sql
SELECT * FROM materials ORDER BY created_at DESC LIMIT 5;
```

### Test 3: Search by Keywords
```sql
SELECT * FROM materials WHERE 'machine' = ANY(keywords);
```

### Test 4: Upload File via Backend
```bash
curl -X POST http://localhost:3001/api/upload \
  -F "file=@./README.md" \
  -F "title=Test Upload" \
  -F "extractText=machine learning neural networks"
```

### Test 5: Verify in Table Editor
1. Go to Table Editor → materials
2. You should see the new row
3. Check the `file_url` column

### Test 6: Verify in Storage
1. Go to Storage → materials bucket
2. You should see the uploaded file
3. Click to preview/download

## 🔄 How Data Flows

### Upload Flow
```
1. User uploads file via frontend
   ↓
2. Frontend sends to backend: POST /api/upload
   ↓
3. Backend receives file (multer)
   ↓
4. Backend extracts keywords from text
   ↓
5. Backend uploads file to Storage Bucket
   └─ supabaseAdmin.storage.from('materials').upload(...)
   └─ Returns: file URL
   ↓
6. Backend saves metadata to Database Table
   └─ supabaseAdmin.from('materials').insert({
        title, file_name, file_url, keywords, topics
      })
   ↓
7. Backend returns response to frontend
   └─ { file: {...}, keywords: [...], topics: [...] }
```

### Read Flow
```
1. User opens Data tab in frontend
   ↓
2. Frontend calls: selectAll('materials')
   ↓
3. Supabase client queries database
   └─ supabase.from('materials').select('*')
   ↓
4. RLS policies check permissions
   ↓
5. Data returned to frontend
   ↓
6. Frontend displays in table
```

## 🛠️ Common Operations

### Add a Column
```sql
ALTER TABLE materials ADD COLUMN user_id UUID REFERENCES auth.users(id);
```

### Rename a Column
```sql
ALTER TABLE materials RENAME COLUMN file_name TO filename;
```

### Delete All Data (Keep Structure)
```sql
TRUNCATE TABLE materials;
```

### Drop Table (Delete Everything)
```sql
DROP TABLE materials;
```

### View Table Structure
```sql
\d materials
-- or in SQL Editor:
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'materials';
```

### Count Rows
```sql
SELECT COUNT(*) FROM materials;
```

### Get Recent Uploads
```sql
SELECT title, created_at 
FROM materials 
ORDER BY created_at DESC 
LIMIT 10;
```

## 🗑️ Delete Bucket

1. Go to Storage → materials bucket
2. Click **"..."** menu (top right)
3. Click **"Delete bucket"**
4. Confirm deletion

**Warning**: This deletes all files permanently!

## 📚 Additional Resources

### Supabase Docs
- Tables: https://supabase.com/docs/guides/database/tables
- Storage: https://supabase.com/docs/guides/storage
- RLS: https://supabase.com/docs/guides/auth/row-level-security
- SQL: https://supabase.com/docs/guides/database/sql-to-api

### PostgreSQL Docs
- Data Types: https://www.postgresql.org/docs/current/datatype.html
- Arrays: https://www.postgresql.org/docs/current/arrays.html
- JSON: https://www.postgresql.org/docs/current/datatype-json.html

## 🎓 Key Concepts

### Database Table
- Structured data storage
- Rows and columns
- Searchable and queryable
- Supports relationships (foreign keys)
- Fast for filtering and sorting

### Storage Bucket
- Unstructured file storage
- Like a folder in the cloud
- Supports any file type
- Generates public URLs
- Optimized for large files

### Row Level Security (RLS)
- PostgreSQL feature
- Controls access at row level
- Based on user authentication
- Policies define who can do what
- Works with Supabase auth

### Service Role Key
- Admin-level access
- Bypasses RLS policies
- Used in backend only
- Never expose to frontend
- Full database access

### Anon Key
- Public key for frontend
- Limited by RLS policies
- Safe to expose
- Used for client-side queries
- No admin privileges

## ✅ Quick Setup Checklist

- [ ] Create `materials` table in SQL Editor
- [ ] Enable RLS on `materials` table
- [ ] Add RLS policies (choose option 1, 2, 3, or 4)
- [ ] Create `materials` storage bucket
- [ ] Set bucket to public or add storage policies
- [ ] Add service role key to `.env`
- [ ] Test insert via SQL Editor
- [ ] Test upload via backend API
- [ ] Verify data in Table Editor
- [ ] Verify files in Storage

## 🚀 You're Ready!

Once you complete the checklist above, your backend can:
- ✅ Upload files to Supabase Storage
- ✅ Save metadata to Supabase Database
- ✅ Extract keywords automatically
- ✅ Serve data to your frontend
- ✅ Control access with RLS policies

Run this to test everything:
```bash
curl -X POST http://localhost:3001/api/upload \
  -F "file=@./README.md" \
  -F "title=First Upload" \
  -F "extractText=machine learning deep learning neural networks"
```

Then check Supabase Dashboard to see your data! 🎉
