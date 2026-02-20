import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [cards, setCards] = useState([]);
  const [sealed, setSealed] = useState([]);
  const [err, setErr] = useState("");

  // add form
  const [date, setDate] = useState(todayISO());
  const [type, setType] = useState("card"); // "card" | "sealed"
  const [cardId, setCardId] = useState("");
  const [sealedId, setSealedId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState("");
  const [platform, setPlatform] = useState("");

  // edit state
  const [editingId, setEditingId] = useState(null);
  const [editDate, setEditDate] = useState(todayISO());
  const [editType, setEditType] = useState("card");
  const [editCardId, setEditCardId] = useState("");
  const [editSealedId, setEditSealedId] = useState("");
  const [editQty, setEditQty] = useState(1);
  const [editPrice, setEditPrice] = useState("");
  const [editPlatform, setEditPlatform] = useState("");

  async function load() {
    setErr("");
    try {
      const [salesData, cardsData, sealedData] = await Promise.all([
        api.sales.list(),
        api.cards.list(),
        api.sealed.list(),
      ]);

      setSales(salesData);
      setCards(cardsData);
      setSealed(sealedData);

      if (!cardId && cardsData.length > 0) setCardId(String(cardsData[0].id));
      if (!sealedId && sealedData.length > 0) setSealedId(String(sealedData[0].id));
    } catch (e) {
      setErr(e.message);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function add(e) {
    e.preventDefault();
    setErr("");

    try {
      const body = {
        date,
        quantity: Number(quantity) || 1,
        price: Number(price),
        platform,
        ...(type === "card"
          ? { cardId: Number(cardId), sealedProductId: null }
          : { sealedProductId: Number(sealedId), cardId: null }),
      };

      await api.sales.create(body);

      setQuantity(1);
      setPrice("");
      setPlatform("");
      await load();
    } catch (e) {
      setErr(e.message);
    }
  }

  function startEdit(s) {
    setEditingId(s.id);

    setEditDate(s.date ?? todayISO());
    setEditQty(s.quantity ?? 1);
    setEditPrice(s.price ?? "");
    setEditPlatform(s.platform ?? "");

    // supports either nested objects OR id fields
    const hasCard = !!(s.card || s.cardId);
    setEditType(hasCard ? "card" : "sealed");

    setEditCardId(
      s.card ? String(s.card.id) : (s.cardId != null ? String(s.cardId) : "")
    );
    setEditSealedId(
      s.sealedProduct ? String(s.sealedProduct.id) : (s.sealedProductId != null ? String(s.sealedProductId) : "")
    );
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEdit(id) {
    setErr("");
    try {
      const body = {
        date: editDate,
        quantity: Number(editQty) || 1,
        price: Number(editPrice),
        platform: editPlatform,
        ...(editType === "card"
          ? { cardId: Number(editCardId), sealedProductId: null }
          : { sealedProductId: Number(editSealedId), cardId: null }),
      };

      await api.sales.update(id, body);
      cancelEdit();
      await load();
    } catch (e) {
      setErr(e.message);
    }
  }

  async function remove(id) {
    if (!window.confirm("Delete this sale?")) return;
    setErr("");
    try {
      await api.sales.delete(id);
      await load();
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div>
      <h1>Sales</h1>

      <form onSubmit={add} style={{ display: "grid", gap: 10, maxWidth: 950, marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 10 }}>
          <label style={{ display: "grid", gap: 4 }}>
            <span>Date</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>

          <label style={{ display: "grid", gap: 4 }}>
            <span>Type</span>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="card">Card</option>
              <option value="sealed">Sealed</option>
            </select>
          </label>

          {type === "card" ? (
            <label style={{ display: "grid", gap: 4, flex: 1 }}>
              <span>Card</span>
              <select value={cardId} onChange={(e) => setCardId(e.target.value)} disabled={cards.length === 0}>
                {cards.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.setName})
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <label style={{ display: "grid", gap: 4, flex: 1 }}>
              <span>Sealed</span>
              <select value={sealedId} onChange={(e) => setSealedId(e.target.value)} disabled={sealed.length === 0}>
                {sealed.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.setName})
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <label style={{ display: "grid", gap: 4, width: 120 }}>
            <span>Qty</span>
            <input
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </label>

          <label style={{ display: "grid", gap: 4, width: 180 }}>
            <span>Price (total)</span>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="25.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </label>

          <label style={{ display: "grid", gap: 4, flex: 1 }}>
            <span>Platform</span>
            <input
              placeholder="eBay, TCGPlayer, Local..."
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            />
          </label>

          <div style={{ display: "grid", alignContent: "end" }}>
            <button
              type="submit"
              disabled={!price || (type === "card" ? !cardId : !sealedId)}
            >
              Add Sale
            </button>
          </div>
        </div>
      </form>

      {err && <p style={{ color: "crimson" }}>{err}</p>}

      <table width="100%" cellPadding="8">
        <thead>
          <tr>
            <th>Date</th>
            <th>Item</th>
            <th>Type</th>
            <th>Qty</th>
            <th>Price (total)</th>
            <th>Platform</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {sales.map((s) => {
            const qty = Number(s.quantity ?? 1);

            const itemName =
              s.card?.name ??
              s.sealedProduct?.name ??
              (s.cardId ? `Card #${s.cardId}` : (s.sealedProductId ? `Sealed #${s.sealedProductId}` : "Unknown"));

            const itemType = (s.card || s.cardId) ? "Card" : "Sealed";

            return (
              <tr key={s.id}>
                {editingId === s.id ? (
                  <>
                    <td>
                      <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} />
                    </td>

                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <select value={editType} onChange={(e) => setEditType(e.target.value)}>
                          <option value="card">Card</option>
                          <option value="sealed">Sealed</option>
                        </select>

                        {editType === "card" ? (
                          <select
                            value={editCardId}
                            onChange={(e) => setEditCardId(e.target.value)}
                            disabled={cards.length === 0}
                          >
                            {cards.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name} ({c.setName})
                              </option>
                            ))}
                          </select>
                        ) : (
                          <select
                            value={editSealedId}
                            onChange={(e) => setEditSealedId(e.target.value)}
                            disabled={sealed.length === 0}
                          >
                            {sealed.map((sp) => (
                              <option key={sp.id} value={sp.id}>
                                {sp.name} ({sp.setName})
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </td>

                    <td>{editType === "card" ? "Card" : "Sealed"}</td>

                    <td>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={editQty}
                        onChange={(e) => setEditQty(e.target.value)}
                        style={{ width: 80 }}
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        style={{ width: 130 }}
                      />
                    </td>

                    <td>
                      <input value={editPlatform} onChange={(e) => setEditPlatform(e.target.value)} />
                    </td>

                    <td>
                      <button
                        type="button"
                        onClick={() => saveEdit(s.id)}
                        disabled={!editPrice || (editType === "card" ? !editCardId : !editSealedId)}
                      >
                        Save
                      </button>{" "}
                      <button type="button" onClick={cancelEdit}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{s.date}</td>
                    <td>{itemName}</td>
                    <td>{itemType}</td>
                    <td>{qty}</td>
                    <td>${Number(s.price ?? 0).toFixed(2)}</td>
                    <td>{s.platform}</td>
                    <td>
                      <button type="button" onClick={() => startEdit(s)}>Edit</button>{" "}
                      <button type="button" onClick={() => remove(s.id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            );
          })}

          {sales.length === 0 && (
            <tr><td colSpan="7">No sales yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}