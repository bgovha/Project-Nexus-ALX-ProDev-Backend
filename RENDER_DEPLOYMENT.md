# Deployment Guide for Render

## What I Fixed

### 1. **Cleaned up `requirements.txt`**

- ✅ Removed all dev/notebook packages (Jupyter, IPython, notebook, etc.) — these bloated production builds
- ✅ Removed `python_version<3.13` (invalid syntax)
- ✅ Removed MySQL packages (you're using PostgreSQL)
- ✅ Kept only essential production packages: Django, DRF, drf-yasg, PostgreSQL driver, etc.
- **Result:** Smaller, faster builds; no Rust compilation errors

### 2. **Created `render.yaml`**

- Specifies build and start commands for Render
- Sets Python version 3.11.2 (compatible with your code)
- Sets `DEBUG=false` for production

### 3. **Created `build.sh`**

- Runs during Render build process
- Installs dependencies, collects static files, runs migrations
- Automatically sets up database schema on first deploy

### 4. **Fixed `ecommerce/settings.py`**

- ✅ Now reads `DEBUG` and `ALLOWED_HOSTS` from `.env` (configurable per environment)
- ✅ Fixed `DATABASES` config to support both local dev and Render's `DATABASE_URL`
- ✅ Added `STATIC_ROOT` and `STATICFILES_STORAGE` for WhiteNoise (static file serving)
- ✅ Uses `os` module for path handling
- **Result:** Code works on both your laptop and Render with proper environment variables

### 5. **Fixed `products/urls.py`**

- ✅ Removed accidental recursive self-include that was causing `RecursionError`

## Deployment Steps

### Step 1: Test Locally (Optional)

```powershell
# Set .env for testing
echo "DEBUG=True" >> .env
echo "DATABASE_URL=postgresql://user:pass@localhost:5432/your_db" >> .env

# Run migration and server
python manage.py migrate
python manage.py runserver
```

### Step 2: Push Code to GitHub

```powershell
git add -A
git commit -m "chore: clean requirements.txt and configure for Render deployment"
git push origin main
```

### Step 3: Create Service on Render

1. Go to [render.com](https://render.com) and log in
2. Click **"New +"** → **"Web Service"**
3. **Select Repository**: Choose `Project-Nexus-ALX-ProDev-Backend`
4. **Name**: `nexus-backend`
5. **Environment**: Python 3.11
6. **Build Command**: (leave default or set to `pip install -r requirements.txt`)
7. **Start Command**: (leave default or set to `gunicorn ecommerce.wsgi:application`)

### Step 4: Set Environment Variables in Render Dashboard

After creating the service, go to **Settings** → **Environment** and add:

```
DEBUG=false
SECRET_KEY=your_secret_key_here (use a strong random string)
DATABASE_URL=postgresql://user:password@hostname:port/dbname
ALLOWED_HOSTS=yourdomain.onrender.com,localhost,127.0.0.1
```

**To generate a strong SECRET_KEY:**

```powershell
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

**For DATABASE_URL on Render:**

- If using Render PostgreSQL: Render provides this URL automatically (copy from DB service)
- If using external DB (AWS RDS, etc.): Format is `postgresql://user:password@host:port/dbname`

### Step 5: Deploy

1. Render auto-deploys from your main branch
2. Watch the **Logs** tab for build progress
3. Once deployed, your API will be live at: `https://nexus-backend.onrender.com`

### Step 6: Test API

```bash
# Test Swagger UI
curl https://nexus-backend.onrender.com/swagger/

# Test products endpoint
curl https://nexus-backend.onrender.com/api/products/

# Test API with auth
curl https://nexus-backend.onrender.com/api/auth/register/
```

## Common Issues & Fixes

### Issue: "502 Bad Gateway" or "Internal Server Error"

**Cause:** Usually missing environment variables or database connection issues.
**Fix:**

1. Check Render logs: Dashboard → Logs
2. Verify all required env vars are set
3. Verify `DATABASE_URL` is correct and database is accessible
4. Restart the service

### Issue: Migrations not running

**Fix:** Check `build.sh` is being used:

- Go to **Settings** → **Build & Deploy**
- Set **Build Command** to: `bash build.sh`
- Redeploy

### Issue: Static files not loading (CSS/JS)

**Fix:** Already configured with WhiteNoise, should work automatically. If not:

1. Run: `python manage.py collectstatic --noinput` locally first
2. Commit changes
3. Redeploy

### Issue: "CSRF verification failed"

**Fix:** Make sure `ALLOWED_HOSTS` includes your Render domain:

```
ALLOWED_HOSTS=nexus-backend.onrender.com,localhost,127.0.0.1
```

## Files Changed

- `requirements.txt` — Production-only dependencies
- `ecommerce/settings.py` — Environment-based config
- `products/urls.py` — Removed recursive include
- `render.yaml` — NEW: Render build configuration
- `build.sh` — NEW: Build script for Render

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Create Render Web Service (link your GitHub repo)
3. ✅ Set environment variables
4. ✅ Monitor deployment logs
5. ✅ Test live API endpoints

You're ready to deploy! 🚀
