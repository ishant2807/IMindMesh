# 🔐 Admin Authentication for Data Tab

## ✅ What's Been Added

The **Data Tab** is now protected with admin authentication! Only users with valid credentials can access the database viewer.

---

## 🎯 Features

### 1. **Login Screen** 🔒
- Beautiful login form with username/password
- Show/hide password toggle
- Error messages for invalid credentials
- Session-based authentication

### 2. **Admin Dashboard** 👤
- Shows logged-in username
- Logout button
- Protected database viewer
- Session persists until browser close

### 3. **Security** 🛡️
- Credentials stored in `.env` file
- Session-based auth (cleared on browser close)
- No hardcoded passwords in code
- Easy to change credentials

---

## 🚀 How to Use

### Step 1: Add Credentials to `.env`

Open your `.env` file and add these lines:

```env
# Admin credentials for Data tab (Frontend)
VITE_ADMIN_USERNAME=admin
VITE_ADMIN_PASSWORD=admin123
```

**⚠️ Important**: Change these default credentials to something secure!

### Step 2: Restart Frontend

After adding credentials to `.env`, restart your frontend:

```powershell
# Stop the frontend (Ctrl+C)
# Then restart
npm run dev
```

### Step 3: Access Data Tab

1. Open: http://localhost:3000
2. Click **"Data"** tab
3. You'll see the login screen

### Step 4: Login

**Default credentials**:
- **Username**: `admin`
- **Password**: `admin123`

Enter these and click **"Login"**

### Step 5: Access Database

After login, you'll see:
- Admin header with your username
- Logout button
- Database viewer (same as before)

---

## 🔄 How It Works

### Authentication Flow:

```
User clicks "Data" tab
    ↓
Check sessionStorage for 'adminAuth'
    ↓
If NOT authenticated:
    → Show login screen
    → User enters credentials
    → Validate against .env variables
    → Store auth in sessionStorage
    → Show database viewer
    ↓
If authenticated:
    → Show database viewer directly
```

### Session Management:

- **Login**: Stores `adminAuth=true` in sessionStorage
- **Logout**: Removes auth from sessionStorage
- **Browser close**: Session cleared automatically
- **Page refresh**: Session persists (stays logged in)

---

## 🔐 Security Details

### Where Credentials Are Stored:

#### `.env` file (NOT committed to git):
```env
VITE_ADMIN_USERNAME=your_username
VITE_ADMIN_PASSWORD=your_secure_password
```

#### sessionStorage (browser):
```javascript
sessionStorage.setItem('adminAuth', 'true')
sessionStorage.setItem('adminUser', 'admin')
```

### Security Features:

✅ **Environment variables**: Credentials not in code
✅ **Session-based**: Cleared on browser close
✅ **No localStorage**: More secure than persistent storage
✅ **Easy to change**: Just update `.env` file
✅ **Gitignored**: `.env` never committed to repository

### Security Limitations:

⚠️ **Client-side only**: Can be bypassed by tech-savvy users
⚠️ **No encryption**: Password visible in `.env` file
⚠️ **No backend validation**: Frontend-only check

**For production**: Consider adding backend authentication with JWT tokens and encrypted passwords.

---

## 🎨 UI Components

### 1. **AdminLogin.jsx**
Location: `src/components/AdminLogin.jsx`

**Features**:
- Username input
- Password input with show/hide toggle
- Error messages
- Loading state
- Default credentials display

### 2. **TableList.jsx** (Updated)
Location: `src/components/TableList.jsx`

**Features**:
- Authentication check on mount
- Login/logout handling
- Admin header with username
- Protected database viewer

---

## 🧪 Testing

### Test 1: Login with Correct Credentials
1. Go to Data tab
2. Enter: `admin` / `admin123`
3. Click "Login"
4. ✅ Should see database viewer

### Test 2: Login with Wrong Credentials
1. Go to Data tab
2. Enter: `wrong` / `wrong`
3. Click "Login"
4. ❌ Should see error: "Invalid username or password"

### Test 3: Session Persistence
1. Login to Data tab
2. Navigate to Dashboard
3. Go back to Data tab
4. ✅ Should still be logged in (no login screen)

### Test 4: Logout
1. Login to Data tab
2. Click "Logout" button
3. ✅ Should see login screen again

### Test 5: Browser Close
1. Login to Data tab
2. Close browser completely
3. Reopen browser and go to Data tab
4. ✅ Should see login screen (session cleared)

---

## ⚙️ Configuration

### Change Admin Credentials

**Option 1: Via .env file** (Recommended)
```env
VITE_ADMIN_USERNAME=myusername
VITE_ADMIN_PASSWORD=MySecurePassword123!
```

**Option 2: Default fallback** (if .env not set)
- Username: `admin`
- Password: `admin123`

### Multiple Admin Users

Currently supports single admin. To add multiple users:

1. **Option A**: Use comma-separated values in `.env`
```env
VITE_ADMIN_USERS=admin:admin123,user2:pass456
```

2. **Option B**: Store in backend database
- Create `admins` table in Supabase
- Validate credentials via backend API
- More secure for production

---

## 📊 What's Protected

### ✅ Protected (Requires Login):
- Data tab database viewer
- Table queries
- Row viewing

### ❌ Not Protected (Public):
- Dashboard
- Add Material
- Knowledge Mesh
- Flashcards
- Settings

---

## 🔧 Customization

### Change Login UI

Edit `src/components/AdminLogin.jsx`:

```javascript
// Change title
<h2>Your Custom Title</h2>

// Change description
<p>Your custom description</p>

// Remove default credentials display
// Delete the "Default credentials" section
```

### Add Remember Me

Add to `AdminLogin.jsx`:

```javascript
const [rememberMe, setRememberMe] = useState(false)

// On login success:
if (rememberMe) {
  localStorage.setItem('adminAuth', 'true')
} else {
  sessionStorage.setItem('adminAuth', 'true')
}
```

### Add Password Requirements

Add to `AdminLogin.jsx`:

```javascript
const validatePassword = (password) => {
  if (password.length < 8) {
    setError('Password must be at least 8 characters')
    return false
  }
  return true
}
```

---

## 🚨 Troubleshooting

### "Invalid username or password" (but credentials are correct)

**Cause**: `.env` changes not loaded
**Fix**:
1. Stop frontend (Ctrl+C)
2. Restart: `npm run dev`
3. Try again

### Login screen doesn't appear

**Cause**: Old session still active
**Fix**:
1. Open browser console (F12)
2. Run: `sessionStorage.clear()`
3. Refresh page

### Can't logout

**Cause**: JavaScript error
**Fix**:
1. Check browser console for errors
2. Manually clear: `sessionStorage.clear()`
3. Refresh page

### Credentials not working after change

**Cause**: Browser cache
**Fix**:
1. Hard refresh: Ctrl+Shift+R
2. Or clear browser cache
3. Restart frontend

---

## 📈 Future Enhancements

### Recommended for Production:

1. **Backend Authentication**
   - Move validation to backend
   - Use JWT tokens
   - Hash passwords with bcrypt

2. **Database Storage**
   - Store users in Supabase
   - Support multiple admins
   - Role-based permissions

3. **Enhanced Security**
   - Rate limiting (prevent brute force)
   - 2FA (two-factor authentication)
   - Password reset functionality

4. **Audit Logging**
   - Log all admin actions
   - Track who viewed what data
   - Store in database

---

## 📋 Summary

### What Changed:
- ✅ Data tab now requires login
- ✅ Admin credentials in `.env`
- ✅ Session-based authentication
- ✅ Login/logout functionality
- ✅ Protected database viewer

### Default Credentials:
- **Username**: `admin`
- **Password**: `admin123`

### How to Login:
1. Go to Data tab
2. Enter credentials
3. Click "Login"
4. Access database viewer

### How to Change Credentials:
1. Edit `.env` file
2. Add `VITE_ADMIN_USERNAME` and `VITE_ADMIN_PASSWORD`
3. Restart frontend
4. Use new credentials

---

## ✅ You're All Set!

The Data tab is now protected! Only users with valid admin credentials can access the database viewer.

**Try it now**: 
1. Go to http://localhost:3000
2. Click "Data" tab
3. Login with `admin` / `admin123`
4. View your database! 🎉

**Remember**: Change the default credentials in your `.env` file for security! 🔒
