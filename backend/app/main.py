from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List
from fastapi import APIRouter

from . import models, schemas, auth
from .database import engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Project Dashboard API", version="1.0.0")

api_router = APIRouter()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@api_router.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@api_router.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        is_admin=user.is_admin
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@api_router.get("/users/me/", response_model=schemas.User)
async def read_users_me(current_user: models.User = Depends(auth.get_current_active_user)):
    return current_user

@api_router.get("/tasks/", response_model=List[schemas.Task])
def get_tasks(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    # Get only top-level tasks (no parent)
    tasks = db.query(models.Task).filter(
        models.Task.parent_task_id.is_(None)
    ).offset(skip).limit(limit).all()
    
    # Convert to response format with subtasks
    def build_task_tree(task):
        task_dict = {
            "id": task.id,
            "name": task.name,
            "description": task.description,
            "start_time": task.start_time,
            "due_time": task.due_time,
            "total_job": task.total_job,
            "completed": task.completed,
            "stuck": task.stuck,
            "est_duration": task.est_duration,
            "est_cost": task.est_cost,
            "status": task.status,
            "owner": task.owner,
            "parent_task_id": task.parent_task_id,
            "created_at": task.created_at,
            "updated_at": task.updated_at,
            "subtasks": []
        }
        
        # Get subtasks (max 2 levels)
        subtasks = db.query(models.Task).filter(
            models.Task.parent_task_id == task.id
        ).all()
        
        for subtask in subtasks:
            subtask_dict = {
                "id": subtask.id,
                "name": subtask.name,
                "description": subtask.description,
                "start_time": subtask.start_time,
                "due_time": subtask.due_time,
                "total_job": subtask.total_job,
                "completed": subtask.completed,
                "stuck": subtask.stuck,
                "est_duration": subtask.est_duration,
                "est_cost": subtask.est_cost,
                "status": subtask.status,
                "owner": subtask.owner,
                "parent_task_id": subtask.parent_task_id,
                "created_at": subtask.created_at,
                "updated_at": subtask.updated_at,
                "subtasks": []
            }
            
            # Get nested subtasks (level 2)
            nested_subtasks = db.query(models.Task).filter(
                models.Task.parent_task_id == subtask.id
            ).all()
            
            for nested_subtask in nested_subtasks:
                nested_dict = {
                    "id": nested_subtask.id,
                    "name": nested_subtask.name,
                    "description": nested_subtask.description,
                    "start_time": nested_subtask.start_time,
                    "due_time": nested_subtask.due_time,
                    "total_job": nested_subtask.total_job,
                    "completed": nested_subtask.completed,
                    "stuck": nested_subtask.stuck,
                    "est_duration": nested_subtask.est_duration,
                    "est_cost": nested_subtask.est_cost,
                    "status": nested_subtask.status,
                    "owner": nested_subtask.owner,
                    "parent_task_id": nested_subtask.parent_task_id,
                    "created_at": nested_subtask.created_at,
                    "updated_at": nested_subtask.updated_at,
                    "subtasks": []
                }
                subtask_dict["subtasks"].append(nested_dict)
            
            task_dict["subtasks"].append(subtask_dict)
        
        return task_dict
    
    return [build_task_tree(task) for task in tasks]

@api_router.post("/tasks/", response_model=schemas.Task)
def create_task(
    task: schemas.TaskCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_admin)
):
    db_task = models.Task(
        **task.dict()
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@api_router.get("/tasks/{task_id}", response_model=schemas.Task)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@api_router.put("/tasks/{task_id}", response_model=schemas.Task)
def update_task(
    task_id: int,
    task_update: schemas.TaskUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_admin)
):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    
    update_data = task_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_task, field, value)
    
    db.commit()
    db.refresh(db_task)
    return db_task

@api_router.delete("/tasks/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_admin)
):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.delete(db_task)
    db.commit()
    return {"message": "Task deleted successfully"}

# Manpower endpoints
@api_router.get("/manpower/", response_model=List[schemas.Manpower])
def get_manpower(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    manpower = db.query(models.Manpower).offset(skip).limit(limit).all()
    return manpower

@api_router.post("/manpower/", response_model=schemas.Manpower)
def create_manpower(
    manpower: schemas.ManpowerCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_admin)
):
    db_manpower = models.Manpower(
        **manpower.dict(),
        user_owner_id=current_user.id
    )
    db.add(db_manpower)
    db.commit()
    db.refresh(db_manpower)
    return db_manpower

@api_router.get("/manpower/{manpower_id}", response_model=schemas.Manpower)
def get_manpower_by_id(
    manpower_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    manpower = db.query(models.Manpower).filter(models.Manpower.id == manpower_id).first()
    if manpower is None:
        raise HTTPException(status_code=404, detail="Manpower record not found")
    return manpower

@api_router.put("/manpower/{manpower_id}", response_model=schemas.Manpower)
def update_manpower(
    manpower_id: int,
    manpower_update: schemas.ManpowerUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_admin)
):
    db_manpower = db.query(models.Manpower).filter(models.Manpower.id == manpower_id).first()
    if db_manpower is None:
        raise HTTPException(status_code=404, detail="Manpower record not found")
    
    update_data = manpower_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_manpower, field, value)
    
    db.commit()
    db.refresh(db_manpower)
    return db_manpower

@api_router.delete("/manpower/{manpower_id}")
def delete_manpower(
    manpower_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_admin)
):
    db_manpower = db.query(models.Manpower).filter(models.Manpower.id == manpower_id).first()
    if db_manpower is None:
        raise HTTPException(status_code=404, detail="Manpower record not found")
    
    db.delete(db_manpower)
    db.commit()
    return {"message": "Manpower record deleted successfully"}

@app.get("/")
def read_root():
    return {"message": "Project Dashboard API"}

app.include_router(api_router, prefix="/api") 