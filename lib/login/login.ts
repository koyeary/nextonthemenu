import { useRouter } from "next/navigation";

export async function login(pin: string) {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pin }),
  });
  if (!res.ok) throw new Error("Invalid PIN");
  return res.json();
}

export async function logout() {
  await fetch("/api/login", { method: "DELETE" });
}

export async function getCurrentUser() {
  const res = await fetch("/api/me"); // We'll add this route next
  if (!res.ok) return null;
  return res.json();
}
