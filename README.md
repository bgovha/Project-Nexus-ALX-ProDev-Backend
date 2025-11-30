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
