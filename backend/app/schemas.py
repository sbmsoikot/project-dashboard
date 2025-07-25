from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class UserBase(BaseModel):
    username: str
    email: str
    is_admin: bool = False

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class TaskBase(BaseModel):
    name: str
    description: Optional[str] = None
    start_time: datetime
    due_time: datetime
    total_job: int = 0
    completed: int = 0
    stuck: int = 0
    est_duration: int = 0  # in days
    est_cost: int = 0      # in currency units
    status: str = "Not Started"  # Not Started, Completed, In Progress, Stuck
    owner: Optional[str] = None

class TaskCreate(TaskBase):
    parent_task_id: Optional[int] = None

class TaskUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    start_time: Optional[datetime] = None
    due_time: Optional[datetime] = None
    plan_quantity: Optional[int] = None
    total_job: Optional[int] = None
    completed: Optional[int] = None
    stuck: Optional[int] = None
    est_duration: Optional[int] = None
    est_cost: Optional[int] = None
    status: Optional[str] = None
    owner: Optional[str] = None

class Task(TaskBase):
    id: int
    owner: Optional[str] = None
    parent_task_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    subtasks: List['Task'] = []
    
    class Config:
        from_attributes = True

# Update forward references
Task.model_rebuild()

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class ManpowerBase(BaseModel):
    date: datetime
    manpower_type: str  # Admin, Engineer, Supervisor, Labour, etc.
    engaged_to: str      # General, Brick Work, Structure Work, Plaster Work, Electric Work, Painting, etc.
    number_of_manpower: int = 1  # Number of manpower
    perday_cost: Optional[int] = None  # Optional cost per day

class ManpowerCreate(ManpowerBase):
    pass

class ManpowerUpdate(BaseModel):
    date: Optional[datetime] = None
    manpower_type: Optional[str] = None
    engaged_to: Optional[str] = None
    number_of_manpower: Optional[int] = None
    perday_cost: Optional[int] = None

class Manpower(ManpowerBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True 