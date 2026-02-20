const API_BASE = "http://localhost:8080/api";

export function getToken() {
  return localStorage.getItem("token");
}
export function setToken(token) {
  localStorage.setItem("token", token);
}
export function clearToken() {
  localStorage.removeItem("token");
}

async function request(path, { method = "GET", body } = {}) {
  const token = getToken();

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed (${res.status})`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export const api = {
  auth: {
    signup: (username, password) =>
      request("/auth/signup", { method: "POST", body: { username, password } }),
    login: (username, password) =>
      request("/auth/login", { method: "POST", body: { username, password } }),
  },
  dashboard: {
    get: () => request("/dashboard"),
  },
  cards: {
    list: () => request("/cards"),
    create: (data) => request("/cards", { method: "POST", body: data }),
    update: (id, data) => request(`/cards/${id}`, { method: "PUT", body: data }),
    delete: (id) => request(`/cards/${id}`, { method: "DELETE" }),
  },
  sealed: {
    list: () => request("/sealed"),
    create: (data) => request("/sealed", { method: "POST", body: data }),
    update: (id, data) => request(`/sealed/${id}`, { method: "PUT", body: data }),
    delete: (id) => request(`/sealed/${id}`, { method: "DELETE" }),
  },
  purchases: {
    list: () => request("/purchases"),
    create: (data) => request("/purchases", { method: "POST", body: data }),
    update: (id, data) => request(`/purchases/${id}`, { method: "PUT", body: data }),
    delete: (id) => request(`/purchases/${id}`, { method: "DELETE" }),
  },
  sales: {
    list: () => request("/sales"),
    create: (data) => request("/sales", { method: "POST", body: data }),
    update: (id, data) => request(`/sales/${id}`, { method: "PUT", body: data }),
    delete: (id) => request(`/sales/${id}`, { method: "DELETE" }),
  },
};
