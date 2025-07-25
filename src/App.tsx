import DashboardLayout from "./layout/DashboardLayout";
import ProjectOverview from "./components/ProjectOverview";
import { useState, useEffect } from "react";
import TaskForm from "./components/TaskForm";
import type { Task, UserRole, Manpower } from "./types";
import { getTasks, createTask, updateTask, deleteTask } from "./api/tasks";
import { getManpower, createManpower, updateManpower, deleteManpower } from "./api/manpower";
import TaskTable from "./components/TaskTable";
import ManpowerTable from "./components/ManpowerTable";
import LoginForm from "./components/LoginForm";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [manpower, setManpower] = useState<Manpower[]>([]);
  const [role, setRole] = useState<UserRole>(() => localStorage.getItem("role") as UserRole || "guest");
  const [activePage, setActivePage] = useState<"overview" | "tasks" | "manpower" | "reports">("overview");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [username, setUsername] = useState<string | null>(() => localStorage.getItem("username"));
  const [showAddForm, setShowAddForm] = useState(false);

  // Helper to add Authorization header
  const authHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

  // Fetch tasks from backend
  const loadTasks = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getTasks(authHeaders);
      setTasks(data);
    } catch (error) {
      setError("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  // Fetch manpower from backend
  const loadManpower = async () => {
    if (!token) return;
    try {
      const data = await getManpower(authHeaders);
      setManpower(data);
    } catch (error) {
      console.error("Failed to fetch manpower:", error);
    }
  };

  useEffect(() => {
    if (token) {
      loadTasks();
      loadManpower();
    }
  }, [token]);

  // Add new task
  const handleAddTask = async (task: Partial<Task>) => {
    setLoading(true);
    try {
      await createTask(task, authHeaders);
      await loadTasks();
      setShowAddForm(false); // Hide form after successful addition
    } catch (e) {
      setError("Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  // Add subtask
  const handleAddSubtask = async (parentId: number, subtask: Partial<Task>) => {
    setLoading(true);
    try {
      await createTask({ ...subtask, parent_task_id: parentId }, authHeaders);
      await loadTasks();
    } catch (e) {
      setError("Failed to add subtask");
    } finally {
      setLoading(false);
    }
  };

  // Update task
  const handleUpdateTask = async (taskId: number, updates: Partial<Task>) => {
    setLoading(true);
    try {
      await updateTask(taskId, updates, authHeaders);
      await loadTasks();
    } catch (e) {
      setError("Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId: number) => {
    setLoading(true);
    try {
      await deleteTask(taskId, authHeaders);
      await loadTasks();
    } catch (e) {
      setError("Failed to delete task");
    } finally {
      setLoading(false);
    }
  };

  // Add new manpower
  const handleAddManpower = async (manpower: Partial<Manpower>) => {
    setLoading(true);
    try {
      await createManpower(manpower, authHeaders);
      await loadManpower();
    } catch (e) {
      setError("Failed to add manpower record");
    } finally {
      setLoading(false);
    }
  };

  // Update manpower
  const handleUpdateManpower = async (manpowerId: number, updates: Partial<Manpower>) => {
    setLoading(true);
    try {
      await updateManpower(manpowerId, updates, authHeaders);
      await loadManpower();
    } catch (e) {
      setError("Failed to update manpower record");
    } finally {
      setLoading(false);
    }
  };

  // Delete manpower
  const handleDeleteManpower = async (manpowerId: number) => {
    setLoading(true);
    try {
      await deleteManpower(manpowerId, authHeaders);
      await loadManpower();
    } catch (e) {
      setError("Failed to delete manpower record");
    } finally {
      setLoading(false);
    }
  };

  // Handle login
  const handleLogin = (newToken: string, username: string, userRole: UserRole) => {
    setToken(newToken);
    setUsername(username);
    setRole(userRole);
    localStorage.setItem("token", newToken);
    localStorage.setItem("username", username);
    localStorage.setItem("role", userRole);
    setError(null);
  };

  // Handle logout
  const handleLogout = () => {
    setToken(null);
    setUsername(null);
    setRole("guest");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setTasks([]);
    setManpower([]);
  };

  if (!token) {
    return <LoginForm onLogin={handleLogin} error={error} />;
  }

  // Render the appropriate page content
  const renderPageContent = () => {
    if (loading) {
      return <div className="flex items-center justify-center h-full">Loading...</div>;
    }

    if (error) {
      return <div className="text-red-600 text-center">{error}</div>;
    }

    switch (activePage) {
      case "overview":
        return <ProjectOverview tasks={tasks} manpower={manpower} />;
      
      case "tasks":
        return (
          <div className="space-y-6">
            {role === "admin" && (
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Tasks</h2>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {showAddForm ? "Cancel" : "Add New Task"}
                </button>
              </div>
            )}
            
            {role === "admin" && showAddForm && (
              <div className="bg-white p-6 shadow rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Task</h3>
                <TaskForm onAdd={handleAddTask} />
              </div>
            )}
            
            <TaskTable
              tasks={tasks}
              role={role}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
              onAddSubtask={handleAddSubtask}
            />
          </div>
        );
      
      case "manpower":
        return (
          <ManpowerTable 
            role={role}
            manpower={manpower}
            onAdd={handleAddManpower}
            onUpdate={handleUpdateManpower}
            onDelete={handleDeleteManpower}
          />
        );
      
      case "reports":
        return (
          <div className="bg-white p-6 shadow rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Reports</h2>
            <p className="text-gray-600">Reports functionality coming soon...</p>
          </div>
        );
      
      default:
        return <ProjectOverview tasks={tasks} manpower={manpower} />;
    }
  };

  return (
    <DashboardLayout
      activePage={activePage}
      onPageChange={setActivePage}
      username={username}
      role={role}
      onLogout={handleLogout}
    >
      {renderPageContent()}
    </DashboardLayout>
  );
}

export default App;
