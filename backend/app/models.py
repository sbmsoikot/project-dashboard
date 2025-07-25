from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.orm import backref
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    tasks = relationship("Task", back_populates="user_owner")

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    start_time = Column(DateTime, nullable=False)
    due_time = Column(DateTime, nullable=False)
    total_job = Column(Integer, default=0)
    completed = Column(Integer, default=0)
    stuck = Column(Integer, default=0)
    est_duration = Column(Integer, default=0)  # in days
    est_cost = Column(Integer, default=0)      # in currency units
    status = Column(String, default="Not Started")
    owner = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Foreign keys
    user_owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    parent_task_id = Column(Integer, ForeignKey("tasks.id"), nullable=True)
    
    # Relationships
    user_owner = relationship("User", back_populates="tasks")
    # subtasks = relationship("Task", backref=relationship("parent", remote_side=[id])) 
    subtasks = relationship("Task", backref=backref("parent", remote_side=[id]))

class Manpower(Base):
    __tablename__ = "manpower"
    
    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, nullable=False)
    manpower_type = Column(String, nullable=False)  # Admin, Engineer, Supervisor, Labour, etc.
    engaged_to = Column(String, nullable=False)      # General, Brick Work, Structure Work, Plaster Work, Electric Work, Painting, etc.
    number_of_manpower = Column(Integer, default=1)  # Number of manpower
    perday_cost = Column(Integer, nullable=True)     # Optional cost per day
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Foreign keys
    user_owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Relationships
    user_owner = relationship("User")