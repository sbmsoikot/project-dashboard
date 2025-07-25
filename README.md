# Project Dashboard

A comprehensive project management dashboard built with React, TypeScript, and Python FastAPI. Features task management with subtasks, progress tracking, and role-based access control.

## Features

- **Project Overview**: Visual dashboard with donut charts showing overall project progress
- **Task Management**: Create, edit, and delete tasks with two levels of subtasks
- **Progress Tracking**: Track completed, in-progress, stuck, and not-started quantities
- **Role-Based Access**: Admin users can create/edit tasks, guests can only view
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Real-time Updates**: Live progress tracking and updates

## Tech Stack

### Frontend
- React 19 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Recharts for data visualization
- Role-based access control

### Backend
- Python FastAPI
- SQLAlchemy ORM
- PostgreSQL (production) / SQLite (development)
- JWT authentication
- Pydantic for data validation

### Infrastructure
- Docker containerization
- Docker Compose for local development
- Nginx reverse proxy
- PostgreSQL database

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for development)
- Python 3.11+ (for development)

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd project-dashboard
```

2. Start the application:
```bash
docker-compose up --build
```

3. Access the application:
- Frontend: http://localhost
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Development Setup

#### Frontend Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

#### Backend Development
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp env.example .env

# Start development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

### Authentication
- `POST /token` - Login and get access token
- `POST /users/` - Create new user
- `GET /users/me/` - Get current user info

### Tasks
- `GET /tasks/` - Get all tasks (with subtasks)
- `POST /tasks/` - Create new task (admin only)
- `GET /tasks/{task_id}` - Get specific task
- `PUT /tasks/{task_id}` - Update task (admin only)
- `DELETE /tasks/{task_id}` - Delete task (admin only)

## Database Schema

### Users Table
- `id`: Primary key
- `username`: Unique username
- `email`: Unique email
- `hashed_password`: Encrypted password
- `is_admin`: Boolean for admin privileges
- `created_at`: Timestamp

### Tasks Table
- `id`: Primary key
- `name`: Task name
- `description`: Task description
- `start_time`: Start date/time
- `due_time`: Due date/time
- `plan_quantity`: Planned quantity
- `completed`: Completed quantity
- `in_progress`: In-progress quantity
- `stuck`: Stuck quantity
- `not_started`: Not started quantity
- `owner_id`: Foreign key to users
- `parent_task_id`: Foreign key to tasks (for subtasks)
- `created_at`: Timestamp
- `updated_at`: Timestamp

## Deployment

### Production Deployment

1. Set up environment variables:
```bash
# Backend
DATABASE_URL=postgresql://user:password@host:port/database
SECRET_KEY=your-production-secret-key

# Frontend
REACT_APP_API_URL=https://your-domain.com/api
```

2. Build and deploy:
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

### Free/Cheap Deployment Options

1. **Railway**: Easy deployment with PostgreSQL
2. **Render**: Free tier with PostgreSQL
3. **Heroku**: Free tier (limited)
4. **Vercel**: Frontend deployment
5. **Netlify**: Frontend deployment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions, please open an issue in the repository.
