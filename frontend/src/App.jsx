import { useState } from "react";
import CustomerView from "./components/CustomerView";
import AdminView from "./components/AdminView";

export default function App() {
  const [mode, setMode] = useState("customer");

  return (
    <main className="container">
      <header className="card">
        <h1>Maa Ki Rasoi</h1>
        <p>Ghar jaisa khana, seedha aapke ghar.</p>
        <div className="row compact">
          <button className={mode === "customer" ? "active" : ""} onClick={() => setMode("customer")}>Customer</button>
          <button className={mode === "admin" ? "active" : ""} onClick={() => setMode("admin")}>Admin</button>
        </div>
      </header>

      {mode === "customer" ? <CustomerView /> : <AdminView />}
    </main>
  );
}
