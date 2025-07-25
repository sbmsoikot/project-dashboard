#!/usr/bin/env python3
"""
Database initialization script
Creates tables and adds sample data based on Home Park Flat Owners Association project
"""

import os
import sys
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

# Add the app directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, SessionLocal
from app.models import Base, User, Task, Manpower
from app.auth import get_password_hash

# Create tables
Base.metadata.create_all(bind=engine)

def init_db():
    db = SessionLocal()
    try:
        # Clear existing data
        db.query(Manpower).delete()
        db.query(Task).delete()
        db.query(User).delete()
        db.commit()
        
        # Create admin user
        admin_user = User(
            username="admin",
            email="admin@example.com",
            hashed_password=get_password_hash("admin123"),
            role="admin"
        )
        db.add(admin_user)
        db.commit()
        
        # Create tasks
        tasks_data = [
            # Main Tasks
            {
                "name": "Roof Top Civil Structural Works",
                "description": "Complete roof top civil structural works including materials and labor",
                "status": "In Progress",
                "owner": "Civil Engineer",
                "start_time": datetime(2025, 7, 23),
                "due_time": datetime(2025, 9, 6),
                "total_job": 1,
                "completed": 0,
                "stuck": 0,
                "est_duration": 45,
                "est_cost": 6868660,
                "parent_task_id": None
            },
            {
                "name": "1st to 16th Floor Pending Works",
                "description": "Stair & Mechanical Duct Brick works, Kitchen counter slabs, Duct punch closing works, Design Change Related works, & Casting works",
                "status": "In Progress",
                "owner": "Site Engineer",
                "start_time": datetime(2025, 7, 28),
                "due_time": datetime(2025, 9, 21),
                "total_job": 16,
                "completed": 0,
                "stuck": 0,
                "est_duration": 55,
                "est_cost": 6390000,
                "parent_task_id": None
            },
            {
                "name": "17th & 18th Floor Brick Work",
                "description": "Complete brick work for 17th and 18th floors including materials and labor",
                "status": "In Progress",
                "owner": "Senior Engineer",
                "start_time": datetime(2025, 8, 2),
                "due_time": datetime(2025, 10, 1),
                "total_job": 2,
                "completed": 0,
                "stuck": 0,
                "est_duration": 60,
                "est_cost": 7646556,
                "parent_task_id": None
            },
            {
                "name": "Electrical Conduiting & MK Box",
                "description": "Electrical conduiting and MK box materials and labor for 1st to 18th floor",
                "status": "In Progress",
                "owner": "Electrical Engineer",
                "start_time": datetime(2025, 8, 7),
                "due_time": datetime(2025, 10, 11),
                "total_job": 18,
                "completed": 0,
                "stuck": 0,
                "est_duration": 65,
                "est_cost": 4309500,
                "parent_task_id": None
            },
            {
                "name": "Inside Plaster (1st to 18th Floor)",
                "description": "Complete inside plaster work for all floors including cement, sand and labor",
                "status": "In Progress",
                "owner": "Plastering Team Lead",
                "start_time": datetime(2025, 8, 12),
                "due_time": datetime(2025, 11, 20),
                "total_job": 18,
                "completed": 0,
                "stuck": 0,
                "est_duration": 100,
                "est_cost": 27687856,
                "parent_task_id": None
            },
            {
                "name": "Grills, Railing, Door Frames",
                "description": "Complete installation of window grills, railings, and door frames",
                "status": "In Progress",
                "owner": "Fabrication Engineer",
                "start_time": datetime(2025, 8, 22),
                "due_time": datetime(2025, 10, 21),
                "total_job": 18,
                "completed": 0,
                "stuck": 0,
                "est_duration": 60,
                "est_cost": 24404480,
                "parent_task_id": None
            },
            {
                "name": "Sanitary & Kitchen Wiring",
                "description": "Toilet & kitchen wiring sanitary materials and labor for 1st to 18th floor",
                "status": "In Progress",
                "owner": "Plumbing Engineer",
                "start_time": datetime(2025, 8, 17),
                "due_time": datetime(2025, 10, 16),
                "total_job": 18,
                "completed": 0,
                "stuck": 0,
                "est_duration": 60,
                "est_cost": 11156120,
                "parent_task_id": None
            },
            {
                "name": "Overhead Costs",
                "description": "Electric bill, Wasa bill, staff salary and security guard costs for 6 months",
                "status": "In Progress",
                "owner": "Project Manager",
                "start_time": datetime(2025, 7, 23),
                "due_time": datetime(2026, 1, 19),
                "total_job": 180,
                "completed": 10,
                "stuck": 0,
                "est_duration": 180,
                "est_cost": 1770000,
                "parent_task_id": None
            }
        ]
        
        # Create main tasks and store their IDs
        main_task_ids = {}
        for i, task_data in enumerate(tasks_data):
            task = Task(**task_data)
            db.add(task)
            db.commit()
            db.refresh(task)
            main_task_ids[i] = task.id
        
        # Create subtasks
        subtasks_data = [
            # Roof Top Civil Structural Works subtasks
            {
                "name": "  Roof Top Materials",
                "description": "Materials cost for roof top structural works",
                "status": "In Progress",
                "owner": "Procurement Team",
                "start_time": datetime(2025, 7, 23),
                "due_time": datetime(2025, 8, 7),
                "total_job": 1,
                "completed": 0,
                "stuck": 0,
                "est_duration": 15,
                "est_cost": 3940000,
                "parent_task_id": main_task_ids[0]
            },
            {
                "name": "  Roof Top Labor",
                "description": "Labor bill for roof top structural works",
                "status": "In Progress",
                "owner": "Site Supervisor",
                "start_time": datetime(2025, 8, 2),
                "due_time": datetime(2025, 9, 6),
                "total_job": 1,
                "completed": 0,
                "stuck": 0,
                "est_duration": 35,
                "est_cost": 2928660,
                "parent_task_id": main_task_ids[0]
            },
            
            # 1st to 16th Floor Pending Works subtasks
            {
                "name": "   1st-16th Floor Materials",
                "description": "Materials cost for pending 1st to 16th floor works",
                "status": "In Progress",
                "owner": "Procurement Team",
                "start_time": datetime(2025, 7, 28),
                "due_time": datetime(2025, 8, 12),
                "total_job": 16,
                "completed": 0,
                "stuck": 0,
                "est_duration": 15,
                "est_cost": 4200000,
                "parent_task_id": main_task_ids[1]
            },
            {
                "name": "   1st-16th Floor Labor",
                "description": "Labor bill for pending 1st to 16th floor brick works",
                "status": "In Progress",
                "owner": "Site Supervisor",
                "start_time": datetime(2025, 8, 7),
                "due_time": datetime(2025, 9, 21),
                "total_job": 16,
                "completed": 0,
                "stuck": 0,
                "est_duration": 45,
                "est_cost": 2190000,
                "parent_task_id": main_task_ids[1]
            },
            
            # 17th & 18th Floor Brick Work subtasks
            {
                "name": "   17th Floor Materials",
                "description": "Materials (Brick, Cement, Sand & Re-Bar) for 17th floor",
                "status": "In Progress",
                "owner": "Procurement Team",
                "start_time": datetime(2025, 8, 2),
                "due_time": datetime(2025, 8, 17),
                "total_job": 1,
                "completed": 0,
                "stuck": 0,
                "est_duration": 15,
                "est_cost": 1878575,
                "parent_task_id": main_task_ids[2]
            },
            {
                "name": "   17th Floor Labor",
                "description": "Labor bill for 17th floor brick works",
                "status": "In Progress",
                "owner": "Site Supervisor",
                "start_time": datetime(2025, 8, 12),
                "due_time": datetime(2025, 9, 11),
                "total_job": 1,
                "completed": 0,
                "stuck": 0,
                "est_duration": 30,
                "est_cost": 1897255,
                "parent_task_id": main_task_ids[2]
            },
            {
                "name": "   18th Floor Materials",
                "description": "Materials (Brick, Cement, Sand & Re-Bar) for 18th floor",
                "status": "In Progress",
                "owner": "Procurement Team",
                "start_time": datetime(2025, 8, 17),
                "due_time": datetime(2025, 9, 1),
                "total_job": 1,
                "completed": 0,
                "stuck": 0,
                "est_duration": 15,
                "est_cost": 1878575,
                "parent_task_id": main_task_ids[2]
            },
            {
                "name": "   18th Floor Labor",
                "description": "Labor bill for 18th floor brick works",
                "status": "In Progress",
                "owner": "Site Supervisor",
                "start_time": datetime(2025, 8, 27),
                "due_time": datetime(2025, 10, 1),
                "total_job": 1,
                "completed": 0,
                "stuck": 0,
                "est_duration": 35,
                "est_cost": 1992151,
                "parent_task_id": main_task_ids[2]
            },
            
            # Electrical Conduiting & MK Box subtasks
            {
                "name": "   Electrical Materials",
                "description": "Electrical conduiting & MK box materials cost for 1st to 18th floor",
                "status": "Completed",
                "owner": "Procurement Team",
                "start_time": datetime(2025, 8, 7),
                "due_time": datetime(2025, 8, 22),
                "total_job": 18,
                "completed": 0,
                "stuck": 0,
                "est_duration": 15,
                "est_cost": 2309500,
                "parent_task_id": main_task_ids[3]
            },
            {
                "name": "   Electrical Labor",
                "description": "Approximately labor cost for electrical works",
                "status": "In Progress",
                "owner": "Electrical Supervisor",
                "start_time": datetime(2025, 8, 17),
                "due_time": datetime(2025, 10, 11),
                "total_job": 18,
                "completed": 0,
                "stuck": 0,
                "est_duration": 55,
                "est_cost": 2000000,
                "parent_task_id": main_task_ids[3]
            },
            
            # Inside Plaster subtasks
            {
                "name": "   Cement Purchase",
                "description": "Cement purchase cost for inside plaster",
                "status": "In Progress",
                "owner": "Procurement Team",
                "start_time": datetime(2025, 8, 12),
                "due_time": datetime(2025, 8, 27),
                "total_job": 18,
                "completed": 0,
                "stuck": 0,
                "est_duration": 15,
                "est_cost": 4586400,
                "parent_task_id": main_task_ids[4]
            },
            {
                "name": "   Sand Purchase",
                "description": "Sand purchase cost for inside plaster",
                "status": "In Progress",
                "owner": "Procurement Team",
                "start_time": datetime(2025, 8, 17),
                "due_time": datetime(2025, 9, 1),
                "total_job": 18,
                "completed": 0,
                "stuck": 0,
                "est_duration": 15,
                "est_cost": 3672000,
                "parent_task_id": main_task_ids[4]
            },
            {
                "name": "   Plaster Labor",
                "description": "Labor bill for inside plaster (1st to 18th floor)",
                "status": "In Progress",
                "owner": "Plastering Supervisor",
                "start_time": datetime(2025, 8, 22),
                "due_time": datetime(2025, 11, 20),
                "total_job": 18,
                "completed": 0,
                "stuck": 0,
                "est_duration": 90,
                "est_cost": 19429456,
                "parent_task_id": main_task_ids[4]
            },
            
            # Grills, Railing, Door Frames subtasks
            {
                "name": "   Window Grills",
                "description": "Window grills installation",
                "status": "In Progress",
                "owner": "Fabrication Team",
                "start_time": datetime(2025, 8, 22),
                "due_time": datetime(2025, 9, 21),
                "total_job": 18,
                "completed": 0,
                "stuck": 0,
                "est_duration": 30,
                "est_cost": 8718280,
                "parent_task_id": main_task_ids[5]
            },
            {
                "name": "   Stair & Lobby Grills",
                "description": "Stair & lobby window grills installation",
                "status": "In Progress",
                "owner": "Fabrication Team",
                "start_time": datetime(2025, 9, 1),
                "due_time": datetime(2025, 9, 26),
                "total_job": 18,
                "completed": 0,
                "stuck": 0,
                "est_duration": 25,
                "est_cost": 435200,
                "parent_task_id": main_task_ids[5]
            },
            {
                "name": "   Verandah Railing",
                "description": "Verandah railing installation (1st to 18th floor)",
                "status": "In Progress",
                "owner": "Fabrication Team",
                "start_time": datetime(2025, 8, 27),
                "due_time": datetime(2025, 10, 1),
                "total_job": 18,
                "completed": 0,
                "stuck": 0,
                "est_duration": 35,
                "est_cost": 2880000,
                "parent_task_id": main_task_ids[5]
            },
            {
                "name": "   Door Frames",
                "description": "Bed room and main door frames installation",
                "status": "In Progress",
                "owner": "Carpentry Team",
                "start_time": datetime(2025, 9, 6),
                "due_time": datetime(2025, 10, 21),
                "total_job": 18,
                "completed": 0,
                "stuck": 0,
                "est_duration": 45,
                "est_cost": 9000000,
                "parent_task_id": main_task_ids[5]
            },
            
            # Sanitary & Kitchen Wiring subtasks
            {
                "name": "   Sanitary Materials",
                "description": "Toilet & kitchen wiring sanitary materials cost for 1st to 18th floor",
                "status": "In Progress",
                "owner": "Procurement Team",
                "start_time": datetime(2025, 8, 17),
                "due_time": datetime(2025, 9, 1),
                "total_job": 18,
                "completed": 0,
                "stuck": 0,
                "est_duration": 15,
                "est_cost": 7656120,
                "parent_task_id": main_task_ids[6]
            },
            {
                "name": "   Sanitary Labor",
                "description": "Approximately labor cost for internal sanitary wiring",
                "status": "In Progress",
                "owner": "Plumbing Supervisor",
                "start_time": datetime(2025, 8, 27),
                "due_time": datetime(2025, 10, 16),
                "total_job": 18,
                "completed": 0,
                "stuck": 0,
                "est_duration": 50,
                "est_cost": 3500000,
                "parent_task_id": main_task_ids[6]
            },
            
            # Overhead Costs subtasks
            {
                "name": "   Utility Bills",
                "description": "Electric bill, Wasa bill & others (90,000/- @ 6 months)",
                "status": "In Progress",
                "owner": "Admin Team",
                "start_time": datetime(2025, 7, 23),
                "due_time": datetime(2026, 1, 19),
                "total_job": 180,
                "completed": 10,
                "stuck": 0,
                "est_duration": 180,
                "est_cost": 540000,
                "parent_task_id": main_task_ids[7]
            },
            {
                "name": "   Staff Salary",
                "description": "Staff salary with security guard (2.05 Lac @ 6 months)",
                "status": "In Progress",
                "owner": "HR Team",
                "start_time": datetime(2025, 7, 23),
                "due_time": datetime(2026, 1, 19),
                "total_job": 180,
                "completed": 10,
                "stuck": 0,
                "est_duration": 180,
                "est_cost": 1230000,
                "parent_task_id": main_task_ids[7]
            }
        ]
        
        # Create subtasks
        for subtask_data in subtasks_data:
            subtask = Task(**subtask_data)
            db.add(subtask)
        
        # Create manpower records
        manpower_data = [
            # July 20, 2025
            {"date": datetime(2025, 7, 20), "manpower_type": "Admin", "engaged_to": "General", "number_of_manpower": 1, "perday_cost": None},
            {"date": datetime(2025, 7, 20), "manpower_type": "Engineer", "engaged_to": "General", "number_of_manpower": 2, "perday_cost": None},
            {"date": datetime(2025, 7, 20), "manpower_type": "Labour", "engaged_to": "Brick Work", "number_of_manpower": 53, "perday_cost": None},
            {"date": datetime(2025, 7, 20), "manpower_type": "Labour", "engaged_to": "Structure Work", "number_of_manpower": 28, "perday_cost": None},
            
            # July 21, 2025
            {"date": datetime(2025, 7, 21), "manpower_type": "Admin", "engaged_to": "General", "number_of_manpower": 1, "perday_cost": None},
            {"date": datetime(2025, 7, 21), "manpower_type": "Engineer", "engaged_to": "General", "number_of_manpower": 2, "perday_cost": None},
            {"date": datetime(2025, 7, 21), "manpower_type": "Labour", "engaged_to": "Brick Work", "number_of_manpower": 56, "perday_cost": None},
            {"date": datetime(2025, 7, 21), "manpower_type": "Labour", "engaged_to": "Structure Work", "number_of_manpower": 28, "perday_cost": None},
            
            # July 22, 2025
            {"date": datetime(2025, 7, 22), "manpower_type": "Admin", "engaged_to": "General", "number_of_manpower": 1, "perday_cost": None},
            {"date": datetime(2025, 7, 22), "manpower_type": "Engineer", "engaged_to": "General", "number_of_manpower": 2, "perday_cost": None},
            {"date": datetime(2025, 7, 22), "manpower_type": "Labour", "engaged_to": "Brick Work", "number_of_manpower": 48, "perday_cost": None},
            {"date": datetime(2025, 7, 22), "manpower_type": "Labour", "engaged_to": "Structure Work", "number_of_manpower": 26, "perday_cost": None},
            
            # July 23, 2025
            {"date": datetime(2025, 7, 23), "manpower_type": "Admin", "engaged_to": "General", "number_of_manpower": 1, "perday_cost": None},
            {"date": datetime(2025, 7, 23), "manpower_type": "Engineer", "engaged_to": "General", "number_of_manpower": 2, "perday_cost": None},
            {"date": datetime(2025, 7, 23), "manpower_type": "Labour", "engaged_to": "Brick Work", "number_of_manpower": 50, "perday_cost": None},
            {"date": datetime(2025, 7, 23), "manpower_type": "Labour", "engaged_to": "Structure Work", "number_of_manpower": 24, "perday_cost": None},
            
            # July 24, 2025
            {"date": datetime(2025, 7, 24), "manpower_type": "Admin", "engaged_to": "General", "number_of_manpower": 1, "perday_cost": None},
            {"date": datetime(2025, 7, 24), "manpower_type": "Engineer", "engaged_to": "General", "number_of_manpower": 2, "perday_cost": None},
            {"date": datetime(2025, 7, 24), "manpower_type": "Labour", "engaged_to": "Brick Work", "number_of_manpower": 52, "perday_cost": None},
            {"date": datetime(2025, 7, 24), "manpower_type": "Labour", "engaged_to": "Structure Work", "number_of_manpower": 23, "perday_cost": None}
        ]
        
        for mp_data in manpower_data:
            manpower = Manpower(**mp_data)
            db.add(manpower)
        
        db.commit()
        print("Database initialized successfully!")
        print(f"Created {len(tasks_data)} main tasks and {len(subtasks_data)} subtasks")
        print(f"Created {len(manpower_data)} manpower records")
        
    except Exception as e:
        print(f"Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_db() 