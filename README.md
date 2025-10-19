# AuthFlow

A comprehensive FastAPI authentication system with JWT tokens, PostgreSQL database, and Docker containerization.

## Features

- **User Registration & Login**: Secure user authentication with password hashing
- **JWT Token Authentication**: Access and refresh token implementation
- **PostgreSQL Database**: Robust data persistence with SQLAlchemy ORM
- **Protected Routes**: Dependency injection for secure endpoints
- **Docker Support**: Easy deployment with Docker Compose
- **API Documentation**: Interactive docs with FastAPI/Swagger UI
- **Token Management**: Refresh token rotation and logout functionality

## Quick Start

### Prerequisites

- Python 3.11+
- Docker and Docker Compose (for containerized setup)
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/aphiwe-debug/auth-flow.git
   cd auth-flow
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://authuser:authpass@localhost:5433/authflow_db
   SECRET_KEY=your-super-secret-key-here
   ```

5. **Start PostgreSQL database**
   ```bash
   docker-compose up -d db
   ```

6. **Run the application**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

7. **Access the API**
   - API Documentation: http://localhost:8000/docs
   - Alternative Docs: http://localhost:8000/redoc

### Docker Setup

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

2. **Access the API**
   - API: http://localhost:8000
   - Docs: http://localhost:8000/docs

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get tokens
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout and revoke refresh token

### General
- `GET /general/welcome` - Welcome message (logs requests)

### Users
- `GET /users/me` - Get current user info (protected)

## Usage Examples

### Register a User
```bash
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword",
    "full_name": "John Doe"
  }'
```

### Login
```bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword"
  }'
```

### Access Protected Route
```bash
curl -X GET "http://localhost:8000/users/me" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Project Structure

```
auth-flow/
├── app/
│   ├── __init__.py
│   ├── main.py          # FastAPI application setup
│   ├── config.py        # Settings and configuration
│   ├── database.py      # Database connection
│   ├── models.py        # SQLAlchemy models
│   ├── schemas.py       # Pydantic schemas
│   ├── auth.py          # Authentication utilities
│   ├── crud.py          # Database operations
│   ├── deps.py          # Dependencies
│   └── routers/
│       ├── auth.py      # Authentication endpoints
│       ├── users.py     # User endpoints
│       └── general.py   # General endpoints
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── .env                 # Environment variables (create this)
├── .gitignore
└── README.md
```

## Configuration

### Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: JWT signing key (keep secret!)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Access token expiration (default: 30)
- `REFRESH_TOKEN_EXPIRE_DAYS`: Refresh token expiration (default: 7)

### Database

The application uses PostgreSQL with the following tables:
- `users`: User accounts
- `refresh_tokens`: Refresh token storage

## Development

### Running Tests

```bash
# Install test dependencies if needed
pip install pytest httpx

# Run tests
pytest
```

### Code Formatting

```bash
# Install development dependencies
pip install black isort flake8

# Format code
black .
isort .

# Lint code
flake8 .
```

## Deployment

### Production Deployment

1. **Set environment variables** for production
2. **Use a production WSGI server** like Gunicorn
3. **Configure reverse proxy** (nginx recommended)
4. **Enable HTTPS**
5. **Set up database backups**

### Docker Production

```bash
# Build for production
docker-compose -f docker-compose.prod.yml up --build
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Refresh token rotation
- CORS protection
- SQL injection prevention
- Secure headers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or issues, please open an issue on GitHub.
