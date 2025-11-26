# Project-Nexus-ALX-ProDev-Backend

E-commerce Backend API with Django and PostgreSQL

A robust Django REST API for managing an e-commerce product catalog with authentication, filtering, and pagination.

## Features

- ✅ User registration and JWT authentication
- ✅ CRUD operations for products and categories
- ✅ Filter products by category
- ✅ Sort by price, name, or date
- ✅ Pagination for large datasets
- ✅ Interactive API documentation (Swagger)

## Tech Stack

- Django 4.2
- Django REST Framework
- PostgreSQL
- JWT Authentication
- Swagger/OpenAPI

## Installation

1. Clone the repository:

```bash
git clone https://github.com/bgovha/Project-Nexus-ALX-ProDev-Backend
cd ecommerce-backend-nexus
```

2. Create virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Set up environment variables (create `.env` file):

```
DB_NAME=ecommerce_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
SECRET_KEY=your-secret-key
```

5. Run migrations:

```bash
python manage.py migrate
```

6. Create superuser:

```bash
python manage.py createsuperuser

Note: For automated deployments you can create a non-interactive superuser by setting environment variables — `DJANGO_SUPERUSER_USERNAME` and `DJANGO_SUPERUSER_PASSWORD` (optionally `DJANGO_SUPERUSER_EMAIL`). The project's `build.sh` will call `manage.py create_admin` when both username and password are present; the command is idempotent and won't duplicate an existing admin.
```

7. Run server:

```bash
python manage.py runserver
```

## API Endpoints

### Authentication

- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login and get JWT token

### Products

- `GET /api/products/` - List all products (paginated)
- `POST /api/products/` - Create product (auth required)
- `GET /api/products/{id}/` - Get product details
- `PUT /api/products/{id}/` - Update product (auth required)
- `DELETE /api/products/{id}/` - Delete product (auth required)

### Categories

- `GET /api/categories/` - List all categories
- `POST /api/categories/` - Create category (auth required)

### Query Parameters

- `?category=1` - Filter by category
- `?search=laptop` - Search in name/description
- `?ordering=price` - Sort by price (use `-price` for descending)
- `?page=2` - Navigate pages

## Documentation

Visit `/swagger/` or `/redoc/` for interactive API documentation.

## Database Schema

![ERD Diagram](https://docs.google.com/document/d/1DkNpSgBJPxQ4W6xHPDwg99dHGPPP1nQhYQIpfNz0t4A/edit?usp=sharing)

## Frontend

A simple React-based dashboard to interact with the API.

### Running the Frontend

#### Option 1: HTML File (Simple)

1. Open `frontend/index.html` in your browser
2. Make sure Django backend is running at `http://127.0.0.1:8000`

#### Option 2: React App (Professional)

1. Navigate to frontend directory:

```bash
cd frontend
npm install
npm start
```

2. Frontend will run at `http://localhost:3000`
3. Make sure Django backend is running at `http://127.0.0.1:8000`

### Features

- Browse products with search, filter, and sort
- User authentication (register/login)
- CRUD operations for products (authenticated users only)
- Responsive design
- Real-time updates

## Project Nexus — Submission Checklist

This repository is intended as a Project Nexus submission. Below are the required deliverables and placeholders to fill in with your final submission links.

1. GitHub repo URL (this repo): https://github.com/bgovha/Project-Nexus-ALX-ProDev-Backend

2. ERD (Google Doc / Draw.io): https://docs.google.com/document/d/1DkNpSgBJPxQ4W6xHPDwg99dHGPPP1nQhYQIpfNz0t4A/edit?usp=sharing

3. Presentation slides (Google Slides): ADD SLIDES LINK HERE

4. Demo video (YouTube / Google Drive): ADD DEMO VIDEO LINK HERE

5. Hosted API (Render/Railway/etc): ADD HOSTED API URL HERE

Make sure each of the links above is accessible to mentors (view permission enabled) before submission. See `RENDER_DEPLOYMENT.md` for deployment instructions.

## Additional endpoints and checks

- `/health/` — basic health check that returns a simple JSON payload to confirm the app is running.
- CI — there is a GitHub Actions workflow in `.github/workflows/ci.yml` which runs tests on push/PR.

## Troubleshooting /swagger/ 500 errors

If you see an Internal Server Error (500) when opening `/swagger/` in a production-like environment (DEBUG=False), it is commonly caused by the staticfiles manifest missing required assets (e.g. drf-yasg's swagger-ui files). The manifest-backed storage will raise a ValueError if a template references a static path that isn't present in the manifest.

Quick fixes:

- Run collectstatic during your build/deploy (this project runs `python manage.py collectstatic --noinput` in `build.sh`) so the manifest includes `drf-yasg` assets.
- Make sure `STATIC_ROOT` is set and writable by your deployment process.
- For local development, enable DEBUG=True so the default staticfiles storage is used (or use the local server's static serving) — the settings already use the default storage in DEBUG to avoid this crash.

If the problem persists after `collectstatic`, paste the deployment logs here and I can help locate which static asset is missing.

## Deploying to Railway

If you're deploying to Railway, follow these exact settings to avoid the `chmod` wrapper issue and make sure the build script runs correctly:

1. In your Railway project, open your Service and go to **Settings → Build & Deploy**

2. Set the **Build Command** to exactly:

```
build.sh
```

Important: do NOT use `bash build.sh` as the Build Command — Railway prepends a `chmod +x` to the build command and `chmod +x bash build.sh` treats `bash` as a filename and fails. Using `build.sh` (or `./build.sh`) means Railway will correctly run `chmod +x build.sh && sh build.sh`.

3. Set the **Start Command** to either the value in the `Procfile` (automatically used by Railway) or:

```
gunicorn ecommerce.wsgi:application --bind 0.0.0.0:$PORT
```

4. Ensure environment variables are set (SECRET_KEY, DATABASE_URL, ALLOWED_HOSTS, DEBUG=false).

Optional: To automatically create a superuser during deployment, set these environment variables on your host:

- DJANGO_SUPERUSER_USERNAME
- DJANGO_SUPERUSER_PASSWORD
- (Optional) DJANGO_SUPERUSER_EMAIL

5. Trigger a deployment and inspect logs. The build step should install packages and then run `build.sh` without the `chmod` error.

If anything still fails, paste the new Railway build logs here and I’ll help triage further.
