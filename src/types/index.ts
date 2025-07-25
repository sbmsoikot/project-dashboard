export interface Task {
  id: number;
  name: string;
  description: string;
  start_time: string;
  due_time: string;
  total_job: number;
  completed: number;
  stuck: number;
  est_duration: number;  // in days
  est_cost: number;      // in currency units
  status: string;
  owner?: string;
  parent_task_id?: number;
  created_at?: string;
  updated_at?: string;
  subtasks?: Task[];
}

export interface ProjectMetrics {
  completed: number;
  stuck: number;
  total_job: number;
  totalTasks: number;
}

export type UserRole = "admin" | "guest";

export interface Manpower {
  id: number;
  date: string;
  manpower_type: string;
  engaged_to: string;
  number_of_manpower: number;
  perday_cost?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ManpowerMetrics {
  total_manpower: number;
  total_cost: number;
  by_type: { [key: string]: number };
  by_work: { [key: string]: number };
} 