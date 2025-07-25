import type { Task } from "../types";

const API_BASE = "/api/tasks";

type HeadersArg = { [key: string]: string };

export async function getTasks(headers: HeadersArg = {}): Promise<Task[]> {
  const res = await fetch(`${API_BASE}/`, { credentials: "include", headers });
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}

export async function createTask(task: Partial<Task>, headers: HeadersArg = {}): Promise<Task> {
  const res = await fetch(`${API_BASE}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    credentials: "include",
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
}

export async function updateTask(taskId: number, updates: Partial<Task>, headers: HeadersArg = {}): Promise<Task> {
  const res = await fetch(`${API_BASE}/${taskId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...headers },
    credentials: "include",
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
}

export async function deleteTask(taskId: number, headers: HeadersArg = {}): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/${taskId}`, {
    method: "DELETE",
    credentials: "include",
    headers,
  });
  if (!res.ok) throw new Error("Failed to delete task");
  return res.json();
} 