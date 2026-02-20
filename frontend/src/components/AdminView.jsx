import { useState } from "react";
import { request } from "../services/api";

const defaultMenuItem = { name: "", description: "", price: "", category: "" };

export default function AdminView() {
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [revenue, setRevenue] = useState(0);
  const [menuForm, setMenuForm] = useState(defaultMenuItem);
  const [message, setMessage] = useState("");

  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  async function login(e) {
    e.preventDefault();
    try {
      const res = await request("/auth/admin/login", {
        method: "POST",
        body: JSON.stringify(credentials)
      });
      localStorage.setItem("adminToken", res.data.token);
      setToken(res.data.token);
      setMessage("Logged in");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function loadDashboard() {
    try {
      const [ordersRes, menuRes, revRes] = await Promise.all([
        request(`/admin/orders${statusFilter ? `?status=${statusFilter}` : ""}`, { headers: authHeader }),
        request("/menu/admin", { headers: authHeader }),
        request("/admin/revenue/today", { headers: authHeader })
      ]);
      setOrders(ordersRes.data);
      setMenuItems(menuRes.data);
      setRevenue(revRes.data.totalRevenueToday);
      setMessage("Dashboard refreshed");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function updateOrderStatus(orderId, status) {
    try {
      await request(`/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: authHeader,
        body: JSON.stringify({ status })
      });
      loadDashboard();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function createMenuItem(e) {
    e.preventDefault();
    try {
      await request("/menu/admin", {
        method: "POST",
        headers: authHeader,
        body: JSON.stringify({ ...menuForm, price: Number(menuForm.price), isAvailable: true })
      });
      setMenuForm(defaultMenuItem);
      loadDashboard();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function toggleAvailability(item) {
    try {
      await request(`/menu/admin/${item.id}`, {
        method: "PATCH",
        headers: authHeader,
        body: JSON.stringify({ isAvailable: !item.isAvailable })
      });
      loadDashboard();
    } catch (error) {
      setMessage(error.message);
    }
  }

  if (!token) {
    return (
      <form className="card stack" onSubmit={login}>
        <h2>Admin Login</h2>
        {message && <p className="message">{message}</p>}
        <input
          type="email"
          required
          placeholder="Email"
          value={credentials.email}
          onChange={(e) => setCredentials((prev) => ({ ...prev, email: e.target.value }))}
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={credentials.password}
          onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
        />
        <button>Login</button>
      </form>
    );
  }

  return (
    <div className="stack">
      <div className="row">
        <h2>Admin Dashboard</h2>
        <button onClick={loadDashboard}>Refresh</button>
      </div>
      {message && <p className="message">{message}</p>}

      <section className="card">
        <h3>Today's Revenue: ₹{Number(revenue).toFixed(0)}</h3>
      </section>

      <section className="card stack">
        <h3>Create Menu Item</h3>
        <form className="stack" onSubmit={createMenuItem}>
          <input required placeholder="Name" value={menuForm.name} onChange={(e) => setMenuForm((p) => ({ ...p, name: e.target.value }))} />
          <textarea required placeholder="Description" value={menuForm.description} onChange={(e) => setMenuForm((p) => ({ ...p, description: e.target.value }))} />
          <input required type="number" placeholder="Price" value={menuForm.price} onChange={(e) => setMenuForm((p) => ({ ...p, price: e.target.value }))} />
          <input required placeholder="Category" value={menuForm.category} onChange={(e) => setMenuForm((p) => ({ ...p, category: e.target.value }))} />
          <button>Add Item</button>
        </form>

        {menuItems.map((item) => (
          <div key={item.id} className="row compact">
            <span>{item.name} ({item.isAvailable ? "Available" : "Off"})</span>
            <button onClick={() => toggleAvailability(item)}>Toggle</button>
          </div>
        ))}
      </section>

      <section className="card stack">
        <h3>Orders</h3>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Preparing">Preparing</option>
          <option value="Delivered">Delivered</option>
        </select>
        <button onClick={loadDashboard}>Apply Filter</button>

        {orders.map((order) => (
          <div key={order.id} className="card">
            <p><strong>{order.customerName}</strong> ({order.customerPhone})</p>
            <p>{order.address}</p>
            <p>Total: ₹{Number(order.totalAmount).toFixed(0)}</p>
            <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)}>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Preparing">Preparing</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </section>
    </div>
  );
}
