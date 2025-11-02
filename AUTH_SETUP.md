# 🔐 Authentication System Setup

## ✅ What's Implemented

Your MindMesh app now has a complete **Login/Signup system** with **role-based access control**!

### Features:
- ✅ User Registration (Sign Up)
- ✅ User Login with email/password
- ✅ Role-based Access (user vs admin)
- ✅ Protected Data Tab (admin only)
- ✅ User Profile Display in header
- ✅ Logout Functionality
- ✅ Session Management
- ✅ Password Hashing (by Supabase)

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Run SQL in Supabase

1. Open: https://supabase.com/dashboard/project/xrfoihubimcwlqfjiqlt
2. Click **SQL Editor** → **New query**
3. Copy all content from `SUPABASE_AUTH_SETUP.sql`
4. Paste and click **"Run"**

### Step 2: Enable Email Auth

1. Go to **Authentication** → **Providers**
2. Make sure **Email** is enabled
3. Turn OFF "Confirm email" (for testing)
4. Click **Save**

### Step 3: Test Signup

1. Start app: `npm run dev`
2. Open: http://localhost:3000
3. Click **"Login"** button in header
4. Click **"Sign Up"** tab
5. Create account (any email/password)

### Step 4: Make Yourself Admin

In Supabase SQL Editor:
```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'your@email.com';
```

### Step 5: Test Admin Access

1. Logout and login again
2. Header shows "Admin" badge
3. Click "Data" tab
4. ✅ Can access database viewer!

---

## 🎯 How It Works

### Authentication Flow:
```
User Signs Up
    ↓
Supabase creates auth.users entry
    ↓
Trigger creates profiles entry (role = 'user')
    ↓
User logs in
    ↓
App checks role from profiles table
    ↓
If role = 'admin' → Can access Data tab
If role = 'user' → Cannot access Data tab
```

### What's Protected:
- ✅ **Data Tab**: Admin only
- ❌ **Everything else**: Public

---

## 📋 Default Behavior

### Without Login:
- Can upload materials
- Can view dashboard
- Can use knowledge mesh
- Can use flashcards
- **Cannot** access Data tab

### With Login (Regular User):
- Same as above
- **Cannot** access Data tab

### With Login (Admin):
- Everything above
- **Can** access Data tab

---

## 🔧 Files Added/Modified

### New Files:
- ✅ `src/components/Auth.jsx` - Login/Signup component
- ✅ `SUPABASE_AUTH_SETUP.sql` - Database setup
- ✅ `AUTH_SETUP.md` - This guide

### Modified Files:
- ✅ `src/App.jsx` - Auth state management
- ✅ `src/components/Header.jsx` - Login/logout UI
- ✅ `server/index.js` - CORS fix for port 3000

---

## ✅ Summary

Your app now has:
- ✅ Login/Signup system
- ✅ Role-based access control
- ✅ Admin-only Data tab
- ✅ User profiles
- ✅ Secure authentication

**No vector embeddings** - just authentication! 🎉

---

## 🚀 Quick Start

```powershell
# 1. Run SQL setup in Supabase (SUPABASE_AUTH_SETUP.sql)

# 2. Start backend
npm run server

# 3. Start frontend
npm run dev

# 4. Open http://localhost:3000
# 5. Click "Login" → "Sign Up"
# 6. Create account
# 7. Make yourself admin via SQL
# 8. Login and access Data tab!
```

Done! 🎉
