# MindMesh Backend API

Express server for handling file uploads, keyword extraction, and Supabase data operations.

## Setup

1. **Add your Supabase service role key to `.env`**:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key
   ```
   Get it from: Supabase Dashboard → Settings → API → service_role key

2. **Create required Supabase resources**:
   - **Storage bucket**: `materials` (public or private based on your needs)
   - **Table**: `materials` with columns:
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
     ```

3. **Start the server**:
   ```bash
   npm run server
   # or with auto-reload:
   npm run server:dev
   ```

## API Endpoints

### Health Check
- **GET** `/api/health`
- Returns server status

### Upload File
- **POST** `/api/upload`
- **Body**: `multipart/form-data`
  - `file`: File to upload (required)
  - `title`: Material title (optional)
  - `extractText`: Text content for keyword extraction (optional)
- **Response**:
  ```json
  {
    "success": true,
    "message": "File uploaded successfully",
    "file": {
      "id": "uuid",
      "name": "document.pdf",
      "url": "https://...",
      "size": 12345,
      "mimeType": "application/pdf"
    },
    "keywords": ["Keyword1", "Keyword2", ...],
    "topics": ["Topic1", "Topic2", ...]
  }
  ```

### Get Data from Table
- **GET** `/api/data/:table?orderBy=created_at&ascending=false`
- **Response**:
  ```json
  {
    "success": true,
    "data": [...],
    "count": 10
  }
  ```

### Insert Data
- **POST** `/api/data/:table`
- **Body**: JSON object with row data
- **Response**:
  ```json
  {
    "success": true,
    "data": { ... }
  }
  ```

### Delete Data
- **DELETE** `/api/data/:table/:id`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Row deleted"
  }
  ```

## Testing with cURL

### Upload a file:
```bash
curl -X POST http://localhost:3001/api/upload \
  -F "file=@/path/to/document.pdf" \
  -F "title=My Study Material" \
  -F "extractText=This is sample text for keyword extraction"
```

### Get materials:
```bash
curl http://localhost:3001/api/data/materials
```

## Frontend Integration

Update your frontend upload component to call the backend:

```javascript
const handleUpload = async (file, text) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', file.name);
  formData.append('extractText', text);

  const response = await fetch('http://localhost:3001/api/upload', {
    method: 'POST',
    body: formData
  });

  const result = await response.json();
  console.log('Uploaded:', result.file);
  console.log('Keywords:', result.keywords);
  console.log('Topics:', result.topics);
};
```

## Notes

- The keyword extraction is currently frequency-based. For better results, integrate NLP libraries like `natural`, `compromise`, or external APIs.
- Ensure RLS policies on your Supabase tables allow the service role to read/write.
- For production, add authentication middleware and rate limiting.
