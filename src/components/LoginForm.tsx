import { useState } from "react";

interface LoginFormProps {
  onLogin: (token: string, username: string, role: "admin" | "guest") => void;
  error?: string | null;
}

export default function LoginForm({ onLogin, error }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);
    try {
      const res = await fetch("/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username,
          password,
        }),
      });
      if (!res.ok) {
        setFormError("Invalid username or password");
        setLoading(false);
        return;
      }
      const data = await res.json();
      
      // Fetch user details to get role
      const userRes = await fetch("/api/users/me/", {
        headers: { Authorization: `Bearer ${data.access_token}` }
      });
      
      if (userRes.ok) {
        const userData = await userRes.json();
        const role = userData.is_admin ? "admin" : "guest";
        onLogin(data.access_token, username, role);
      } else {
        // Fallback to guest if user details can't be fetched
        onLogin(data.access_token, username, "guest");
      }
    } catch (err) {
      setFormError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-16 bg-white p-8 rounded shadow space-y-4">
      <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
      <input
        className="input w-full"
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />
      <input
        className="input w-full"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      {(formError || error) && <div className="text-red-600 text-center">{formError || error}</div>}
    </form>
  );
} 