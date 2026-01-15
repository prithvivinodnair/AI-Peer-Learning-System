# 🚀 Quick Start Guide - Password Reset

## ✅ Setup Checklist

### 1. Database Setup
```sql
-- Run this in your MySQL database:
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

### 2. Get Resend API Key
1. Go to https://resend.com/signup
2. Click "API Keys" → "Create API Key"
3. Copy the key (starts with `re_`)

### 3. Add Environment Variables
```env
# Add to your .env file:
RESEND_API_KEY=re_your_key_here
RESEND_FROM_EMAIL=SkillShare <onboarding@resend.dev>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Test It!
```bash
npm run dev
```

Then:
1. Go to http://localhost:3000/login
2. Click "Forgot Password" tab
3. Enter your email
4. Check inbox for reset email
5. Click link → Reset password
6. Login with new password

---

## 📧 Email Example

You'll receive an email like this:

```
Subject: Reset Your Password - SkillShare

[SkillShare Logo]

Reset Your Password

We received a request to reset your password. 
Click the button below to create a new password:

[Reset Password Button]

Or copy this link: https://yourapp.com/reset-password?token=abc123...

This link will expire in 10 minutes.

If you didn't request a password reset, ignore this email.
```

---

## 🔐 Security Features

✅ **Secure tokens** - 32-byte random hex (64 characters)
✅ **Time-limited** - Tokens expire after 10 minutes
✅ **Single-use** - Each token can only be used once
✅ **Password validation** - Requires 8+ chars, uppercase, special char
✅ **Hashed passwords** - bcrypt with salt rounds
✅ **No user enumeration** - Same message whether email exists or not

---

## 📁 Files Created

```
sql/
  create_password_resets_table.sql       ← Database schema

backend/backend/
  app/
    api/
      auth/
        forgot-password/route.ts         ← Send reset email
        reset-password/route.ts          ← Verify & update password
    (site)/
      reset-password/page.tsx            ← Reset password form
      login/page.tsx                     ← Updated (forgot form)

  .env.example                           ← Updated with Resend vars
  package.json                           ← Added 'resend' package
```

---

## 🐛 Troubleshooting

### Email not arriving?
- Check spam folder
- Verify `RESEND_API_KEY` is correct
- Check Resend dashboard logs
- Make sure email format is: `Name <email@domain.com>`

### "Invalid token" error?
- Token expired (10 min limit)
- Token already used
- Request a new reset link

### Database error?
- Run the SQL migration script
- Check database connection in `db.ts`
- Verify table exists: `SHOW TABLES;`

---

## 🎨 Customization Ideas

Want to personalize it? You can:

1. **Change email design** - Edit HTML in `forgot-password/route.ts`
2. **Adjust expiry time** - Change `10 * 60 * 1000` to your preference
3. **Add rate limiting** - Max 3 requests per hour per email
4. **Custom domain** - Verify your domain in Resend dashboard
5. **Add OTP option** - See `OTP_ALTERNATIVE.md` for code

---

## 💰 Cost

**$0** - Completely FREE!

- Resend: 100 emails/day free forever
- No credit card required
- Perfect for small projects & testing

---

## 🚀 Production Deployment (Vercel)

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Add Environment Variables:**
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`
   - `NEXT_PUBLIC_APP_URL` (your production URL)
4. **Deploy!**

Optional: Verify custom domain in Resend for branded emails.

---

## 📚 Documentation

- Full setup: `PASSWORD_RESET_SETUP.md`
- OTP version: `OTP_ALTERNATIVE.md`
- Resend docs: https://resend.com/docs

---

## ✅ Testing Checklist

- [ ] Database table created
- [ ] Resend API key added to .env
- [ ] Dev server running
- [ ] Forgot password form works
- [ ] Email received (check spam)
- [ ] Reset link works
- [ ] Password validation works
- [ ] Can login with new password
- [ ] Token expires after 10 min
- [ ] Used tokens don't work again

---

## 🎉 You're Done!

Your password reset is fully functional and production-ready!

Need help? Check the detailed docs in `PASSWORD_RESET_SETUP.md`
