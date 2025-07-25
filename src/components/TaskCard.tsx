import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { useState } from "react";
import type { Task, UserRole } from "../types";

const COLORS = ["#22c55e", "#3b82f6", "#fbbf24", "#ef4444"];

interface TaskCardProps {
  task: Task;
  role?: UserRole;
  onUpdate?: (taskId: number, updatedTask: Task) => void;
}

export default function TaskCard({ task, role = "guest", onUpdate }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<Task>({ ...task });

  const chartData = [
    { name: "Completed", value: task.completed },
    { name: "Stuck", value: task.stuck },
    { name: "Remaining", value: task.total_job - task.completed - task.stuck },
  ].filter(item => item.value > 0);

  const totalItems = task.total_job;
  const completionPercentage = totalItems > 0 ? Math.round((task.completed / totalItems) * 100) : 0;

  const handleEdit = () => {
    setEditing(true);
    // Convert datetime strings to date format for input fields
    const formattedTask = {
      ...task,
      start_time: task.start_time ? task.start_time.split('T')[0] : '',
      due_time: task.due_time ? task.due_time.split('T')[0] : '',
    };
    setEditData(formattedTask);
  };

  const handleSave = () => {
    onUpdate && onUpdate(task.id, editData);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
    setEditData({ ...task });
  };

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setEditData(prev => {
      const newData = {
        ...prev,
        [name]: name === "name" || name === "description" ? value : Number(value),
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

  const renderSubtask = (subtask: Task, level = 1) => {
    const subtaskChartData = [
      { name: "Completed", value: subtask.completed },
      { name: "Stuck", value: subtask.stuck },
      { name: "Remaining", value: subtask.total_job - subtask.completed - subtask.stuck },
    ].filter(item => item.value > 0);

    const subtaskTotal = subtask.total_job;
    const subtaskCompletion = subtaskTotal > 0 ? Math.round((subtask.completed / subtaskTotal) * 100) : 0;

    return (
      <div key={subtask.id} className={`ml-${level * 4} border-l-2 border-gray-200 pl-4 mt-4`}>
        <div className="bg-gray-50 rounded p-3 flex gap-4 items-center">
          <div className="w-16 h-16">
            <PieChart width={64} height={64}>
              <Pie
                data={subtaskChartData}
                cx="50%"
                cy="50%"
                innerRadius={15}
                outerRadius={30}
                dataKey="value"
              >
                {subtaskChartData.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={COLORS[i]} />
                ))}
              </Pie>
            </PieChart>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-sm">{subtask.name}</h4>
            <p className="text-xs text-gray-600">{subtask.description}</p>
            <p className="text-xs text-gray-500">
              {subtask.start_time} → {subtask.due_time}
            </p>
            <div className="text-xs text-gray-600">
              Progress: {subtaskCompletion}% ({subtask.completed}/{subtaskTotal})
            </div>
          </div>
        </div>
        
        {/* Render nested subtasks */}
        {subtask.subtasks && subtask.subtasks.length > 0 && level < 2 && (
          <div className="mt-2">
            {subtask.subtasks.map(nestedSubtask => renderSubtask(nestedSubtask, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex gap-6 items-start">
        {/* Chart */}
        <div className="w-32 h-32 flex-shrink-0">
          <PieChart width={130} height={130}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={35}
              outerRadius={60}
              dataKey="value"
            >
              {chartData.map((_, i) => (
                <Cell key={`cell-${i}`} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        {/* Task Info */}
        <div className="flex-1">
          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Name</label>
                <input
                  name="name"
                  value={editData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={editData.description}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  rows={2}
                />
              </div>
              
              {/* Timeline */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    name="start_time"
                    type="date"
                    value={editData.start_time}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    name="due_time"
                    type="date"
                    value={editData.due_time}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Est. Duration (days)</label>
                  <input
                    name="est_duration"
                    type="number"
                    value={editData.est_duration}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    min="0"
                  />
                </div>
              </div>

              {/* Cost */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Est. Cost ($)</label>
                <input
                  name="est_cost"
                  type="number"
                  value={editData.est_cost}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Quantities */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Job</label>
                  <input
                    name="total_job"
                    type="number"
                    value={editData.total_job}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Completed</label>
                  <input
                    name="completed"
                    type="number"
                    value={editData.completed}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stuck</label>
                  <input
                    name="stuck"
                    type="number"
                    value={editData.stuck}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    min="0"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{task.name}</h3>
                  <p className="text-gray-600 mt-1">{task.description}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {task.start_time} → {task.due_time}
                  </p>
                </div>
                {role === "admin" && (
                  <button
                    onClick={handleEdit}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    Edit
                  </button>
                )}
              </div>

              {/* Progress Info */}
              <div className="mt-4 grid grid-cols-5 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-blue-600">{task.total_job}</div>
                  <div className="text-gray-600">Total Job</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-green-600">{task.completed}</div>
                  <div className="text-gray-600">Completed</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-red-600">{task.stuck}</div>
                  <div className="text-gray-600">Stuck</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-purple-600">{task.est_duration}h</div>
                  <div className="text-gray-600">Est. Duration</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-orange-600">${task.est_cost?.toLocaleString()}</div>
                  <div className="text-gray-600">Est. Cost</div>
                </div>
              </div>

              <div className="mt-3 text-center">
                <div className="text-2xl font-bold text-gray-800">{completionPercentage}%</div>
                <div className="text-sm text-gray-600">Complete</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Subtasks */}
      {task.subtasks && task.subtasks.length > 0 && (
        <div className="mt-6">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <span>{expanded ? "▼" : "▶"}</span>
            <span>Subtasks ({task.subtasks.length})</span>
          </button>
          
          {expanded && (
            <div className="mt-4">
              {task.subtasks.map(subtask => renderSubtask(subtask))}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 