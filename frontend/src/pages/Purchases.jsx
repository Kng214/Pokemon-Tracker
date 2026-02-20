import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [cards, setCards] = useState([]);
  const [sealed, setSealed] = useState([]);
  const [err, setErr] = useState("");

  // add form
  const [date, setDate] = useState(todayISO());
  const [type, setType] = useState("card");
  const [cardId, setCardId] = useState("");
  const [sealedId, setSealedId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [priceEach, setPriceEach] = useState("");

  // edit state
  const [editingId, setEditingId] = useState(null);
  const [editDate, setEditDate] = useState(todayISO());
  const [editType, setEditType] = useState("card");
  const [editCardId, setEditCardId] = useState("");
  const [editSealedId, setEditSealedId] = useState("");
  const [editQty, setEditQty] = useState(1);
  const [editPriceEach, setEditPriceEach] = useState("");

  async function load() {
    setErr("");
    try {
      const [purchaseData, cardsData, sealedData] = await Promise.all([
        api.purchases.list(),
        api.cards.list(),
        api.sealed.list(),
      ]);

      setPurchases(purchaseData);
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
        priceEach: Number(priceEach),
        ...(type === "card"
          ? { cardId: Number(cardId), sealedProductId: null }
          : { sealedProductId: Number(sealedId), cardId: null }),
      };

      await api.purchases.create(body);

      setQuantity(1);
      setPriceEach("");
      await load();
    } catch (e) {
      setErr(e.message);
    }
  }

  function startEdit(p) {
    setEditingId(p.id);

    setEditDate(p.date ?? todayISO());
    setEditQty(p.quantity ?? 1);
    setEditPriceEach(p.priceEach ?? "");

    // supports either nested objects OR id fields
    const hasCard = !!(p.card || p.cardId);
    setEditType(hasCard ? "card" : "sealed");

    setEditCardId(
      p.card ? String(p.card.id) : (p.cardId != null ? String(p.cardId) : "")
    );
    setEditSealedId(
      p.sealedProduct ? String(p.sealedProduct.id) : (p.sealedProductId != null ? String(p.sealedProductId) : "")
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
        priceEach: Number(editPriceEach),
        ...(editType === "card"
          ? { cardId: Number(editCardId), sealedProductId: null }
          : { sealedProductId: Number(editSealedId), cardId: null }),
      };

      await api.purchases.update(id, body);

      cancelEdit();
      await load();
    } catch (e) {
      setErr(e.message);
    }
  }

  async function remove(id) {
    if (!window.confirm("Delete this purchase?")) return;
    setErr("");
    try {
      await api.purchases.delete(id);
      await load();
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div>
      <h1>Purchases</h1>

      <form onSubmit={add} style={{ display: "grid", gap: 10, maxWidth: 800, marginBottom: 14 }}>
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
          <label style={{ display: "grid", gap: 4, width: 140 }}>
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
            <span>Price Each</span>
            <input
              placeholder="12.50"
              value={priceEach}
              onChange={(e) => setPriceEach(e.target.value)}
              type="number"
              step="0.01"
              min="0"
            />
          </label>

          <div style={{ display: "grid", alignContent: "end" }}>
            <button type="submit" disabled={!priceEach || (type === "card" ? !cardId : !sealedId)}>
              Add Purchase
            </button>
          </div>
        </div>

        {(type === "card" && cards.length === 0) && (
          <p style={{ color: "crimson", margin: 0 }}>You have no cards. Add a card first.</p>
        )}
        {(type === "sealed" && sealed.length === 0) && (
          <p style={{ color: "crimson", margin: 0 }}>You have no sealed products. Add one first.</p>
        )}
      </form>

      {err && <p style={{ color: "crimson" }}>{err}</p>}

      <table width="100%" cellPadding="8">
        <thead>
          <tr>
            <th>Date</th>
            <th>Item</th>
            <th>Type</th>
            <th>Qty</th>
            <th>Price Each</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {purchases.map((p) => {
            const qty = Number(p.quantity ?? 1);
            const pe = Number(p.priceEach ?? 0);
            const total = qty * pe;

            const itemName =
              p.card?.name ??
              p.sealedProduct?.name ??
              (p.cardId ? `Card #${p.cardId}` : (p.sealedProductId ? `Sealed #${p.sealedProductId}` : "Unknown"));

            const itemType = (p.card || p.cardId) ? "Card" : "Sealed";

            return (
              <tr key={p.id}>
                {editingId === p.id ? (
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
                        style={{ width: 90 }}
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={editPriceEach}
                        onChange={(e) => setEditPriceEach(e.target.value)}
                        style={{ width: 120 }}
                      />
                    </td>

                    <td>${((Number(editQty || 1)) * (Number(editPriceEach || 0))).toFixed(2)}</td>

                    <td>
                      <button
                        type="button"
                        onClick={() => saveEdit(p.id)}
                        disabled={!editPriceEach || (editType === "card" ? !editCardId : !editSealedId)}
                      >
                        Save
                      </button>{" "}
                      <button type="button" onClick={cancelEdit}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{p.date}</td>
                    <td>{itemName}</td>
                    <td>{itemType}</td>
                    <td>{qty}</td>
                    <td>${pe.toFixed(2)}</td>
                    <td>${total.toFixed(2)}</td>
                    <td>
                      <button type="button" onClick={() => startEdit(p)}>Edit</button>{" "}
                      <button type="button" onClick={() => remove(p.id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            );
          })}

          {purchases.length === 0 && (
            <tr>
              <td colSpan="7">No purchases yet.</td>
            </tr>
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