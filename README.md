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
