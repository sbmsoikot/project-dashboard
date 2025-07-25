import type { Manpower } from "../types";

const API_BASE = "/api/manpower";

type HeadersArg = { [key: string]: string };

export async function getManpower(headers: HeadersArg = {}): Promise<Manpower[]> {
  const res = await fetch(`${API_BASE}/`, { credentials: "include", headers });
  if (!res.ok) throw new Error("Failed to fetch manpower data");
  return res.json();
}

export async function createManpower(manpower: Partial<Manpower>, headers: HeadersArg = {}): Promise<Manpower> {
  const res = await fetch(`${API_BASE}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    credentials: "include",
    body: JSON.stringify(manpower),
  });
  if (!res.ok) throw new Error("Failed to create manpower record");
  return res.json();
}

export async function updateManpower(manpowerId: number, updates: Partial<Manpower>, headers: HeadersArg = {}): Promise<Manpower> {
  const res = await fetch(`${API_BASE}/${manpowerId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...headers },
    credentials: "include",
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update manpower record");
  return res.json();
}

export async function deleteManpower(manpowerId: number, headers: HeadersArg = {}): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/${manpowerId}`, {
    method: "DELETE",
    credentials: "include",
    headers,
  });
  if (!res.ok) throw new Error("Failed to delete manpower record");
  return res.json();
} 