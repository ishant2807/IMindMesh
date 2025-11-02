# 🔧 Troubleshooting: Upload Not Working

## ❓ Common Issues & Solutions

### Issue 1: Backend Not Running
**Symptom**: `/api/health` doesn't respond

**Check**:
```powershell
# Check if node is running
Get-Process -Name node

# Test health endpoint
curl http://localhost:3001/api/health
```

**Fix**:
```powershell
# Kill existing processes
Stop-Process -Name node -Force

# Start backend
npm run server
```

---

### Issue 2: Service Role Key Missing
**Symptom**: Upload returns "Supabase credentials missing" error

**Check**:
```powershell
# View .env file
Get-Content .env | Select-String "SERVICE_ROLE"
```

**Fix**:
1. Go to Supabase Dashboard → Settings → API
2. Copy `service_role` key (click "Reveal")
3. Open `.env` and replace `YOUR_SERVICE_ROLE_KEY_HERE` with actual key
4. Restart backend: `Stop-Process -Name node -Force` then `npm run server`

---

### Issue 3: Materials Table Doesn't Exist
**Symptom**: Upload returns "relation 'materials' does not exist"

**Check**:
Go to Supabase Dashboard → Table Editor → Look for `materials` table

**Fix**:
Run this SQL in Supabase SQL Editor:
```sql
CREATE TABLE materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  keywords TEXT[],
  topics JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Issue 4: Storage Bucket Doesn't Exist
**Symptom**: Upload returns "bucket 'materials' not found"

**Check**:
Go to Supabase Dashboard → Storage → Look for `materials` bucket

**Fix**:
1. Click "New bucket"
2. Name: `materials`
3. Public: ✅ Check
4. Click "Create bucket"

---

### Issue 5: Storage Policies Not Set
**Symptom**: Upload returns "new row violates row-level security policy"

**Fix**:
Go to Storage → materials bucket → Policies → New policy:
```sql
(bucket_id = 'materials' AND operation = 'SELECT') OR 
(bucket_id = 'materials' AND auth.role() = 'service_role')
```
Check all operations: SELECT, INSERT, UPDATE, DELETE

---

### Issue 6: PowerShell curl Issues
**Symptom**: curl command doesn't work in PowerShell

**Why**: PowerShell's `curl` is an alias for `Invoke-WebRequest`, not the real curl

**Fix**: Use one of these methods:

#### Method A: Use Test Script (Easiest)
```powershell
.\test-upload-simple.ps1
```

#### Method B: Use curl.exe (if installed)
```powershell
curl.exe -X POST http://localhost:3001/api/upload `
  -F "file=@README.md" `
  -F "title=Test" `
  -F "extractText=machine learning"
```

#### Method C: Use Invoke-RestMethod
See `test-upload-simple.ps1`

---

## ✅ Step-by-Step Diagnostic

Run these commands in order:

### 1. Check Backend is Running
```powershell
curl http://localhost:3001/api/health
```
✅ Expected: `{"status":"ok","message":"MindMesh backend is running"}`
❌ If fails: Backend not running → `npm run server`

### 2. Check Service Role Key
```powershell
Get-Content .env | Select-String "SERVICE_ROLE"
```
✅ Expected: Long JWT token (starts with `eyJ...`)
❌ If `YOUR_SERVICE_ROLE_KEY_HERE`: Add real key from Supabase Dashboard

### 3. Check Materials Table Exists
```powershell
curl http://localhost:3001/api/data/materials
```
✅ Expected: `{"success":true,"data":[],"count":0}`
❌ If error: Create table in Supabase (see Issue 3)

### 4. Test Upload
```powershell
.\test-upload-simple.ps1
```
✅ Expected: JSON with `"success":true` and keywords
❌ If error: See error message and match to issues above

### 5. Verify in Supabase
1. Go to Table Editor → materials
2. Should see new row
3. Go to Storage → materials
4. Should see uploaded file

---

## 🧪 Test Scripts

### test-upload-simple.ps1
Simple upload test that shows detailed errors.

**Run**:
```powershell
.\test-upload-simple.ps1
```

### test-upload.http
For VS Code REST Client extension.

**Run**:
1. Install "REST Client" extension in VS Code
2. Open `server/test-upload.http`
3. Click "Send Request" above any `###` section

---

## 📊 What Should Happen

### Successful Upload Flow:
```
1. You run: .\test-upload-simple.ps1
   ↓
2. Backend receives file
   ↓
3. Backend extracts keywords
   Output: ["Machine", "Learning", "Neural", ...]
   ↓
4. Backend uploads to Supabase Storage
   File saved: materials/1730850000-README.md
   ↓
5. Backend saves metadata to Database
   Row inserted with keywords
   ↓
6. Backend returns success
   {
     "success": true,
     "file": { "url": "https://..." },
     "keywords": ["Machine", "Learning", ...]
   }
   ↓
7. Verify in Supabase Dashboard
   - Table Editor: See new row
   - Storage: See uploaded file
```

---

## 🚨 Common Error Messages

### "EADDRINUSE: address already in use"
**Meaning**: Backend already running
**Fix**: Use existing server OR `Stop-Process -Name node -Force` then restart

### "Supabase service credentials missing"
**Meaning**: No service role key in `.env`
**Fix**: Add service role key from Supabase Dashboard

### "relation 'materials' does not exist"
**Meaning**: Table not created
**Fix**: Create table in Supabase SQL Editor

### "The resource was not found"
**Meaning**: Storage bucket doesn't exist
**Fix**: Create `materials` bucket in Supabase Storage

### "new row violates row-level security policy"
**Meaning**: RLS policies blocking insert
**Fix**: Add storage policies (see Issue 5)

### "File type not allowed"
**Meaning**: File type not in whitelist
**Fix**: Upload PDF, TXT, MD, DOC, DOCX, PNG, or JPG

### "File too large"
**Meaning**: File > 10MB
**Fix**: Use smaller file or increase limit in `server/routes/upload.js`

---

## 🎯 Quick Fix Checklist

Run through this checklist:

- [ ] Backend running: `curl http://localhost:3001/api/health` works
- [ ] Service role key in `.env`: Not `YOUR_SERVICE_ROLE_KEY_HERE`
- [ ] Materials table exists: Check Table Editor
- [ ] Materials bucket exists: Check Storage
- [ ] Storage policies set: Check bucket Policies tab
- [ ] Test file exists: `README.md` or `test-simple.txt`
- [ ] Run test: `.\test-upload-simple.ps1`
- [ ] Check Supabase: Table Editor + Storage

---

## 📞 Still Not Working?

### Check Backend Logs
Look at the terminal where `npm run server` is running. You should see:
```
🚀 Backend server running on http://localhost:3001
```

If you see errors, they'll appear here when you try to upload.

### Check Supabase Logs
Dashboard → Logs → API → See real-time requests

### Enable Debug Mode
Add to `server/index.js` after line 1:
```javascript
process.env.DEBUG = '*';
```

Restart backend to see detailed logs.

---

## ✅ Success Indicators

You know it's working when:

1. ✅ Test script shows: `Success!` in green
2. ✅ Response includes: `"success": true`
3. ✅ Response includes: `"keywords": ["Machine", "Learning", ...]`
4. ✅ Supabase Table Editor shows new row
5. ✅ Supabase Storage shows uploaded file
6. ✅ Frontend Data tab shows the material

---

## 🔄 Reset Everything (Nuclear Option)

If nothing works, start fresh:

```powershell
# 1. Stop all node processes
Stop-Process -Name node -Force

# 2. Drop and recreate table
# In Supabase SQL Editor:
DROP TABLE IF EXISTS materials CASCADE;
CREATE TABLE materials (...);  # Full SQL from Issue 3

# 3. Delete and recreate bucket
# In Supabase Storage: Delete materials bucket, create new one

# 4. Restart backend
npm run server

# 5. Test again
.\test-upload-simple.ps1
```

This should fix any corrupted state.
