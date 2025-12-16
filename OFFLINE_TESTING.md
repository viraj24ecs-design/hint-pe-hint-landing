# Offline Testing Guide

## 🔧 Offline Mode for Local Testing

This app includes an offline mode for testing without needing the backend server running.

### How to Enable Offline Mode

1. **Edit `.env.local`** and set:
   ```
   VITE_OFFLINE_MODE=true
   ```

2. **Restart your dev server**:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

### Test Users (Offline Mode)

When offline mode is enabled, you can login with these test accounts:

| Username | Password | Name | Coins |
|----------|----------|------|-------|
| `testuser` | `password123` | Test User | 50 |
| `demo` | `demo123` | Demo User | 100 |

### Testing Features

**Login:**
- Use credentials above
- No backend required
- Coins are stored in localStorage

**Signup:**
- Create new users (stored only in localStorage)
- New users start with 0 coins

**Add Coins:**
- Click "Test: Add 10 Coins" button
- Coins update instantly in localStorage
- Persists between page refreshes

### Switching Back to Online Mode

1. **Edit `.env.local`** and set:
   ```
   VITE_OFFLINE_MODE=false
   ```
   Or remove the line entirely.

2. **Restart your dev server**

3. **Make sure your backend server is running:**
   ```bash
   node server/server.cjs
   ```

### Console Logs

When in offline mode, you'll see console logs prefixed with `🔧 OFFLINE MODE:` to confirm offline functionality is active.

### Notes

- Offline data is stored in browser's localStorage
- Data is NOT synced to MongoDB in offline mode
- Perfect for UI/UX testing without database setup
- Clear localStorage to reset offline data
