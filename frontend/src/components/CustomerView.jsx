import { useEffect, useMemo, useState } from "react";
import { request } from "../services/api";

const initialCheckout = { customerName: "", customerPhone: "", address: "" };

export default function CustomerView() {
  const [menu, setMenu] = useState([]);
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [checkout, setCheckout] = useState(initialCheckout);
  const [placing, setPlacing] = useState(false);
  const [message, setMessage] = useState("");

  const categories = useMemo(() => ["All", ...new Set(menu.map((item) => item.category))], [menu]);

  useEffect(() => {
    request("/menu")
      .then((res) => setMenu(res.data))
      .catch((err) => setMessage(err.message));
  }, []);

  const filteredMenu = category === "All" ? menu : menu.filter((item) => item.category === category);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function addToCart(item) {
    setCart((prev) => {
      const existing = prev.find((x) => x.id === item.id);
      if (existing) {
        return prev.map((x) => (x.id === item.id ? { ...x, quantity: x.quantity + 1 } : x));
      }
      return [...prev, { id: item.id, name: item.name, price: Number(item.price), quantity: 1 }];
    });
  }

  function updateQty(id, delta) {
    setCart((prev) =>
      prev
        .map((x) => (x.id === id ? { ...x, quantity: Math.max(0, x.quantity + delta) } : x))
        .filter((x) => x.quantity > 0)
    );
  }

  async function placeOrder(e) {
    e.preventDefault();
    if (!cart.length) return;

    setPlacing(true);
    setMessage("");

    try {
      await request("/orders", {
        method: "POST",
        body: JSON.stringify({
          ...checkout,
          paymentMethod: "COD",
          items: cart.map((item) => ({ menuItemId: item.id, quantity: item.quantity }))
        })
      });
      setCart([]);
      setCheckout(initialCheckout);
      setMessage("Order placed successfully! We will call you shortly.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="stack">
      <h2>Fresh Home-Style Meals</h2>
      {message && <p className="message">{message}</p>}

      <div className="chips">
        {categories.map((cat) => (
          <button key={cat} className={cat === category ? "active" : ""} onClick={() => setCategory(cat)}>
            {cat}
          </button>
        ))}
      </div>

      <div className="stack">
        {filteredMenu.map((item) => (
          <div className="card" key={item.id}>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <div className="row">
              <strong>₹{Number(item.price).toFixed(0)}</strong>
              <button onClick={() => addToCart(item)}>Add</button>
            </div>
          </div>
        ))}
      </div>

      <section className="card">
        <h3>Cart</h3>
        {!cart.length && <p>Your cart is empty.</p>}
        {cart.map((item) => (
          <div key={item.id} className="row compact">
            <span>{item.name}</span>
            <div className="row compact">
              <button onClick={() => updateQty(item.id, -1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQty(item.id, 1)}>+</button>
            </div>
          </div>
        ))}
        <h4>Total: ₹{total.toFixed(0)}</h4>

        <form onSubmit={placeOrder} className="stack">
          <input
            required
            placeholder="Your name"
            value={checkout.customerName}
            onChange={(e) => setCheckout((prev) => ({ ...prev, customerName: e.target.value }))}
          />
          <input
            required
            placeholder="Phone number"
            value={checkout.customerPhone}
            onChange={(e) => setCheckout((prev) => ({ ...prev, customerPhone: e.target.value }))}
          />
          <textarea
            required
            placeholder="Delivery address"
            value={checkout.address}
            onChange={(e) => setCheckout((prev) => ({ ...prev, address: e.target.value }))}
          />
          <button disabled={placing || !cart.length}>{placing ? "Placing..." : "Place COD Order"}</button>
        </form>
      </section>
    </div>
  );
}
