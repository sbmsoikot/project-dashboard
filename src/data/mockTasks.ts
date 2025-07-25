import type { Task } from "../types";

const mockTasks: Task[] = [
  {
    id: 1,
    name: "Design Homepage",
    description: "Create layout and styles for the main homepage",
    start_time: "2025-01-01",
    due_time: "2025-01-10",
    total_job: 100,
    completed: 60,
    stuck: 10,
    est_duration: 240,
    est_cost: 150000,
    status: "not_started",
    subtasks: [
      {
        id: 11,
        name: "Wireframe Design",
        description: "Create wireframes for all pages",
        start_time: "2025-01-01",
        due_time: "2025-01-03",
        total_job: 30,
        completed: 20,
        stuck: 2,
        est_duration: 72,
        est_cost: 45000,
        status: "not_started",
        subtasks: [
          {
            id: 111,
            name: "Homepage Wireframe",
            description: "Design homepage layout",
            start_time: "2025-01-01",
            due_time: "2025-01-02",
            total_job: 10,
            completed: 8,
            stuck: 0,
            est_duration: 24,
            est_cost: 15000,
            status: "not_started",
          },
          {
            id: 112,
            name: "Navigation Wireframe",
            description: "Design navigation structure",
            start_time: "2025-01-02",
            due_time: "2025-01-03",
            total_job: 20,
            completed: 12,
            stuck: 2,
            est_duration: 48,
            est_cost: 20000,
            status: "not_started",
          }
        ]
      },
      {
        id: 12,
        name: "Visual Design",
        description: "Create visual mockups",
        start_time: "2025-01-04",
        due_time: "2025-01-07",
        total_job: 40,
        completed: 25,
        stuck: 3,
        est_duration: 120,
        est_cost: 60000,
        status: "not_started",
        subtasks: []
      }
    ]
  },
  {
    id: 2,
    name: "Build Auth System",
    description: "Setup login and role-based access control",
    start_time: "2025-01-03",
    due_time: "2025-01-12",
    total_job: 50,
    completed: 10,
    stuck: 5,
    est_duration: 300,
    est_cost: 180000,
    status: "not_started",
    subtasks: [
      {
        id: 21,
        name: "User Authentication",
        description: "Implement login/logout functionality",
        start_time: "2025-01-03",
        due_time: "2025-01-06",
        total_job: 25,
        completed: 5,
        stuck: 2,
        est_duration: 144,
        est_cost: 75000,
        status: "not_started",
        subtasks: []
      },
      {
        id: 22,
        name: "Role Management",
        description: "Setup admin and guest roles",
        start_time: "2025-01-07",
        due_time: "2025-01-10",
        total_job: 25,
        completed: 5,
        stuck: 3,
        est_duration: 96,
        est_cost: 50000,
        status: "not_started",
        subtasks: []
      }
    ]
  }
];

export default mockTasks; 