import { useState } from "react";
import type { Task } from "../types";

const STATUS_OPTIONS = [
  { value: "Not Started", label: "Not Started", color: "bg-gray-400" },
  { value: "In Progress", label: "In Progress", color: "bg-blue-500" },
  { value: "Completed", label: "Completed", color: "bg-green-500" },
  { value: "Stuck", label: "Stuck", color: "bg-red-500" },
];

interface TaskFormProps {
  onAdd: (task: Partial<Task>) => void;
  parentTaskId?: number;
  initialData?: Partial<Task>;
  isEdit?: boolean;
}

export default function TaskForm({ onAdd, parentTaskId, initialData, isEdit = false }: TaskFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    start_time: initialData?.start_time ? initialData.start_time.split('T')[0] : "",
    due_time: initialData?.due_time ? initialData.due_time.split('T')[0] : "",
    total_job: initialData?.total_job || 0,
    completed: initialData?.completed || 0,
    stuck: initialData?.stuck || 0,
    est_duration: initialData?.est_duration || 0,
    est_cost: initialData?.est_cost || 0,
    status: initialData?.status || "Not Started",
    owner: initialData?.owner || "",
    parent_task_id: parentTaskId || initialData?.parent_task_id || undefined,
  });

  // Calculate duration in days between start and end dates
  const calculateDuration = (startDate: string, endDate: string): number => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Calculate end date based on start date and duration
  const calculateEndDate = (startDate: string, duration: number): string => {
    if (!startDate || duration <= 0) return "";
    const start = new Date(startDate);
    const end = new Date(start.getTime() + (duration * 24 * 60 * 60 * 1000));
    return end.toISOString().split('T')[0];
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: ["name", "description", "status", "owner", "start_time", "due_time"].includes(name)
          ? value
          : Number(value),
      };

      // Auto-calculate duration when start or end date changes
      if (name === "start_time" || name === "due_time") {
        if (newData.start_time && newData.due_time) {
          newData.est_duration = calculateDuration(newData.start_time, newData.due_time);
        }
      }

      // Auto-calculate end date when start date or duration changes
      if (name === "start_time" || name === "est_duration") {
        if (newData.start_time && newData.est_duration > 0) {
          newData.due_time = calculateEndDate(newData.start_time, newData.est_duration);
        }
      }

      return newData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert date strings to datetime format for backend
    const taskData = {
      ...formData,
      start_time: formData.start_time ? `${formData.start_time}T00:00:00` : undefined,
      due_time: formData.due_time ? `${formData.due_time}T00:00:00` : undefined,
    };
    
    onAdd(taskData);
    setFormData({
      name: "",
      description: "",
      start_time: "",
      due_time: "",
      total_job: 0,
      completed: 0,
      stuck: 0,
      est_duration: 0,
      est_cost: 0,
      status: "Not Started",
      owner: "",
      parent_task_id: parentTaskId || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Task Name *</label>
          <input name="name" className="input w-full" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Owner</label>
          <input name="owner" className="input w-full" value={formData.owner} onChange={handleChange} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
        <textarea name="description" className="input w-full" value={formData.description} onChange={handleChange} rows={3} required />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
        <select name="status" className="input w-full" value={formData.status} onChange={handleChange} required>
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
          <input name="start_time" type="date" className="input w-full" value={formData.start_time} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
          <input name="due_time" type="date" className="input w-full" value={formData.due_time} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Est. Duration (days)</label>
          <input name="est_duration" type="number" className="input w-full" value={formData.est_duration} onChange={handleChange} min="0" />
        </div>
      </div>

      {/* Cost */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Est. Cost ($)</label>
        <input name="est_cost" type="number" className="input w-full" value={formData.est_cost} onChange={handleChange} min="0" step="0.01" />
      </div>

      {/* Quantities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Total Job *</label>
          <input name="total_job" type="number" className="input w-full" value={formData.total_job} onChange={handleChange} min="0" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Completed Qty</label>
          <input name="completed" type="number" className="input w-full" value={formData.completed} onChange={handleChange} min="0" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stuck Qty</label>
          <input name="stuck" type="number" className="input w-full" value={formData.stuck} onChange={handleChange} min="0" />
        </div>
      </div>

      <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        {isEdit ? "Update Task" : "Add Task"}
      </button>
    </form>
  );
} 