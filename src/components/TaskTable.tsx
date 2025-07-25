import { Fragment, useState } from "react";
import type { Task, UserRole } from "../types";
import TaskForm from "./TaskForm";

// Tree view icons
const TreeIcons = {
  expanded: "▼",
  collapsed: "▶",
  leaf: "•",
  branch: "├─",
  lastBranch: "└─",
  indent: "│  "
};

const STATUS_COLORS: Record<string, string> = {
  "Not Started": "bg-gray-200 text-gray-800",
  "In Progress": "bg-blue-200 text-blue-800",
  "Completed": "bg-green-200 text-green-800",
  "Stuck": "bg-red-200 text-red-800",
};

interface TaskTableProps {
  tasks: Task[];
  role: UserRole;
  onUpdate: (taskId: number, updates: Partial<Task>) => void;
  onDelete: (taskId: number) => void;
  onAddSubtask: (parentId: number, subtask: Partial<Task>) => void;
}

export default function TaskTable({ tasks, role, onUpdate, onDelete, onAddSubtask }: TaskTableProps) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [editing, setEditing] = useState<Record<number, boolean>>({});
  const [showSubtaskForm, setShowSubtaskForm] = useState<Record<number, boolean>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; taskId: number; taskName: string } | null>(null);

  // Get all task IDs that have subtasks
  const getTaskIdsWithSubtasks = (taskList: Task[]): number[] => {
    const ids: number[] = [];
    const processTask = (task: Task) => {
      if (task.subtasks && task.subtasks.length > 0) {
        ids.push(task.id);
        task.subtasks.forEach(processTask);
      }
    };
    taskList.forEach(processTask);
    return ids;
  };

  // Expand all tasks with subtasks
  const expandAll = () => {
    const taskIds = getTaskIdsWithSubtasks(tasks);
    const newExpanded: Record<number, boolean> = {};
    taskIds.forEach(id => {
      newExpanded[id] = true;
    });
    setExpanded(newExpanded);
  };

  // Collapse all tasks
  const collapseAll = () => {
    setExpanded({});
  };

  // Handle delete confirmation
  const handleDeleteClick = (taskId: number, taskName: string) => {
    setDeleteConfirm({ show: true, taskId, taskName });
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirm) {
      onDelete(deleteConfirm.taskId);
      setDeleteConfirm(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  const renderRow = (task: Task, level = 0, isLast = false) => {
    const hasSubtasks = task.subtasks && task.subtasks.length > 0;
    const isExpanded = expanded[task.id];
    
    return (
      <Fragment key={task.id}>
        <tr className={`${level > 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 transition-colors`}>
          <td className="py-2 font-medium whitespace-nowrap">
            <div className="flex items-center">
              {/* Indentation and tree structure */}
              <div className="flex items-center" style={{ paddingLeft: `${level * 20}px` }}>
                {level > 0 && (
                  <span className="text-gray-400 mr-1">
                    {isLast ? TreeIcons.lastBranch : TreeIcons.branch}
                  </span>
                )}
                
                {/* Expand/collapse button for tasks with subtasks */}
                {hasSubtasks && (
                  <button
                    onClick={() => setExpanded(e => ({ ...e, [task.id]: !e[task.id] }))}
                    className="mr-2 text-gray-500 hover:text-gray-700 transition-colors"
                    title={isExpanded ? "Collapse" : "Expand"}
                  >
                    {isExpanded ? TreeIcons.expanded : TreeIcons.collapsed}
                  </button>
                )}
                
                {/* Task name with level indicator */}
                <span className={level > 0 ? "text-sm" : "font-semibold"}>
                  {task.name}
                </span>
                
                {/* Subtask count indicator */}
                {hasSubtasks && (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {task.subtasks!.length} subtask{task.subtasks!.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          </td>
          <td className="py-2 whitespace-nowrap">{task.owner || "-"}</td>
          <td className="py-2 whitespace-nowrap">
            <span className={`px-2 py-1 rounded text-xs font-semibold ${STATUS_COLORS[task.status] || "bg-gray-200"}`}>
              {task.status}
            </span>
          </td>
          <td className="py-2 whitespace-nowrap">{task.start_time?.slice(0, 10)} → {task.due_time?.slice(0, 10)}</td>
          <td className="py-2 text-center">{task.est_duration} days</td>
          <td className="py-2 text-center">${task.est_cost?.toLocaleString()}</td>
          <td className="py-2 text-center">{task.total_job}</td>
          <td className="py-2 text-center">{task.completed}</td>
          <td className="py-2 text-center">{task.stuck}</td>
          <td className="py-2 flex gap-2 items-center">
            {role === "admin" ? (
              <>
                <button 
                  className="text-blue-600 hover:underline text-sm" 
                  onClick={() => setEditing(e => ({ ...e, [task.id]: !e[task.id] }))}
                  title="Edit Task"
                >
                  Edit
                </button>
                <button 
                  className="text-red-600 hover:underline text-sm" 
                  onClick={() => handleDeleteClick(task.id, task.name)}
                  title="Delete Task"
                >
                  Delete
                </button>
                <button 
                  className="text-green-600 hover:underline text-sm" 
                  onClick={() => setShowSubtaskForm(f => ({ ...f, [task.id]: !f[task.id] }))}
                  title="Add Subtask"
                >
                  Add Subtask
                </button>
              </>
            ) : (
              <span className="text-gray-400 text-sm">Read-only</span>
            )}
          </td>
        </tr>
        
        {/* Edit form row */}
        {editing[task.id] && role === "admin" && (
          <tr>
            <td colSpan={11} className="bg-gray-100">
              {/* Inline edit form with pre-filled data */}
              <TaskForm
                onAdd={updates => {
                  onUpdate(task.id, updates);
                  setEditing(e => ({ ...e, [task.id]: false }));
                }}
                initialData={task}
                isEdit={true}
              />
            </td>
          </tr>
        )}
        
        {/* Add subtask form row */}
        {showSubtaskForm[task.id] && role === "admin" && (
          <tr>
            <td colSpan={11} className="bg-gray-50">
              <TaskForm
                onAdd={subtask => {
                  onAddSubtask(task.id, subtask);
                  setShowSubtaskForm(f => ({ ...f, [task.id]: false }));
                }}
                parentTaskId={task.id}
              />
            </td>
          </tr>
        )}
        
        {/* Render subtasks if expanded */}
        {isExpanded && task.subtasks && task.subtasks.length > 0 && (
          <>
            {task.subtasks.map((subtask, index) => 
              renderRow(subtask, level + 1, index === task.subtasks!.length - 1)
            )}
          </>
        )}
      </Fragment>
    );
  };

  return (
    <div className="space-y-6">
      {/* Global expand/collapse controls */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={expandAll}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
            title="Expand all tasks with subtasks"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
            title="Collapse all tasks"
          >
            Collapse All
          </button>
        </div>
        <div className="text-sm text-gray-600">
          {getTaskIdsWithSubtasks(tasks).length} task{getTaskIdsWithSubtasks(tasks).length !== 1 ? 's' : ''} with subtasks
        </div>
      </div>

      {/* Spacing before task list */}
      <div className="h-6"></div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Task</th>
              <th className="px-4 py-2 text-left">Owner</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Timeline</th>
              <th className="px-4 py-2 text-center">Est. Duration</th>
              <th className="px-4 py-2 text-center">Est. Cost</th>
              <th className="px-4 py-2 text-center">Total Job</th>
              <th className="px-4 py-2 text-center">Completed</th>
              <th className="px-4 py-2 text-center">Stuck</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => renderRow(task, 0, index === tasks.length - 1))}
          </tbody>
        </table>
      </div>
      
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-semibold">"{deleteConfirm.taskName}"</span>?
              {(() => {
                const task = tasks.find(t => t.id === deleteConfirm.taskId);
                return task?.subtasks && task.subtasks.length > 0;
              })() && (
                <span className="block mt-2 text-red-600">
                  This will also delete all its subtasks!
                </span>
              )}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 