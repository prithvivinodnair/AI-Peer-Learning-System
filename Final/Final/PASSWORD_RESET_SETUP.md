# Password Reset Setup Guide

## ✅ What's Been Implemented

A complete password reset flow using **Resend** (100% FREE for up to 100 emails/day):

1. **Database Schema** - `password_resets` table created
2. **Forgot Password API** - `/api/auth/forgot-password`
3. **Reset Password API** - `/api/auth/reset-password`
4. **Reset Password Page** - `/reset-password`
5. **Updated Login Form** - Connected to new API

---

## 🚀 Setup Steps

### 1. Create Database Table

Run this SQL in your database:

```sql
-- Run the migration file
-- File: sql/create_password_resets_table.sql

CREATE TABLE IF NOT EXISTS password_resets (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_password_resets_token ON password_resets(token);
CREATE INDEX idx_password_resets_email ON password_resets(email);
```

### 2. Get Resend API Key (100% FREE)

1. Go to [resend.com](https://resend.com)
2. Sign up (no credit card required)
3. Go to **API Keys** section
4. Click **Create API Key**
5. Copy your key (starts with `re_`)

### 3. Configure Environment Variables

Add to your `.env` file:

```env
# Resend Configuration
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=SkillShare <onboarding@resend.dev>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important Notes:**
- For testing, use `onboarding@resend.dev` as the sender
- For production, you'll need to verify your own domain in Resend (also free)
- Update `NEXT_PUBLIC_APP_URL` for production deployment

### 4. Test the Flow

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Test forgot password:**
   - Go to `/login`
   - Click "Forgot Password" tab
   - Enter your email
   - Check your inbox for the reset link

3. **Reset your password:**
   - Click the link in the email
   - Enter new password (must meet requirements)
   - Confirm password
   - Submit

4. **Sign in with new password**

---

## 📧 How It Works

### User Flow:

```
1. User clicks "Forgot Password"
   ↓
2. Enters email → API generates secure token
   ↓
3. Token stored in DB (expires in 10 minutes)
   ↓
4. Email sent via Resend with reset link
   ↓
5. User clicks link → opens /reset-password?token=XXX
   ↓
6. User enters new password
   ↓
7. API verifies token, updates password
   ↓
8. Token marked as "used"
   ↓
9. User redirected to login
```

### Security Features:

✅ Secure random tokens (32 bytes)
✅ Tokens expire after 10 minutes
✅ Tokens can only be used once
✅ Password validation (length, uppercase, special chars)
✅ Doesn't reveal if email exists (prevents user enumeration)
✅ Hashed passwords with bcrypt

---

## 🔧 API Endpoints

### POST `/api/auth/forgot-password`

**Request:**
```json
{
  "email": "user@university.edu"
}
```

**Response:**
```json
{
  "message": "If an account exists with this email, you will receive a password reset link."
}
```

### POST `/api/auth/reset-password`

**Request:**
```json
{
  "token": "abc123...",
  "password": "NewPassword123!"
}
```

**Response:**
```json
{
  "message": "Password successfully reset. You can now sign in with your new password."
}
```

---

## 🎨 Email Template

The password reset email includes:
- Professional HTML design
- Clear reset button
- Clickable link (if button doesn't work)
- 10-minute expiry warning
- Security notice if user didn't request reset

---

## 🆓 Resend Free Tier

- **100 emails per day** (FREE forever)
- No credit card required
- Perfect for small projects & testing
- Easy upgrade if you need more

---

## 🚀 Production Deployment

### For Vercel:

1. Add environment variables in Vercel dashboard:
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`
   - `NEXT_PUBLIC_APP_URL` (your production URL)

2. Update email domain:
   - Go to Resend dashboard
   - Add your domain (e.g., `yourdomain.com`)
   - Follow DNS verification steps
   - Update `RESEND_FROM_EMAIL` to `noreply@yourdomain.com`

### Database Cleanup (Optional):

To automatically clean up expired/used tokens, run this periodically:

```sql
DELETE FROM password_resets 
WHERE expires_at < NOW() OR used = TRUE;
```

You can set up a cron job or use Next.js API routes with Vercel Cron.

---

## 📱 Files Created/Modified

### New Files:
- `sql/create_password_resets_table.sql` - Database schema
- `app/api/auth/forgot-password/route.ts` - Forgot password API
- `app/api/auth/reset-password/route.ts` - Reset password API
- `app/(site)/reset-password/page.tsx` - Reset password page

### Modified Files:
- `app/(site)/login/page.tsx` - Updated forgot password form
- `package.json` - Added `resend` dependency
- `.env.example` - Added Resend configuration

---

## 🐛 Troubleshooting

### Email not sending?
- Check `RESEND_API_KEY` is correct
- Verify sender email format: `Name <email@domain.com>`
- Check Resend dashboard for error logs

### Token expired?
- Tokens expire after 10 minutes
- User needs to request a new reset link

### Invalid token?
- Token may have been used already
- Token may have expired
- Check `password_resets` table in database

---

## 💡 Optional Enhancements

Want to add more features? Consider:

1. **OTP instead of link** - Send 6-digit code instead of token
2. **Rate limiting** - Prevent spam (max 3 requests per hour)
3. **SMS reset** - Use Twilio for phone-based reset
4. **Password history** - Prevent reusing old passwords
5. **Account lockout** - Lock account after failed attempts

Let me know if you want any of these! 🚀
