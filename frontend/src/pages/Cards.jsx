import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function Cards() {
    const [items, setItems] = useState([]);
    const [err, setErr] = useState("");
    const [name, setName] = useState("");
    const [setNameValue, setSetNameValue] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editSetName, setEditSetName] = useState("");
    const [editCardNumber, setEditCardNumber] = useState("");

    async function load() {
        setErr("");
        try {
        setItems(await api.cards.list());
        } catch (e) {
        setErr(e.message);
        }
    }

    useEffect(() => { load(); }, []);

    async function add(e) {
        e.preventDefault();
        setErr("");
        try {
        await api.cards.create({ name, setName: setNameValue, cardNumber });
        setName(""); setSetNameValue(""); setCardNumber("");
        await load();
        } catch (e) {
        setErr(e.message);
        }
    }

    function startEdit(card) {
        setEditingId(card.id);
        setEditName(card.name ?? "");
        setEditSetName(card.setName ?? "");
        setEditCardNumber(card.cardNumber ?? "");
    }

    function cancelEdit() {
        setEditingId(null);
        setEditName(""); setEditSetName(""); setEditCardNumber("");
    }

    async function saveEdit(id) {
        setErr("");
        try {
        await api.cards.update(id, {
            name: editName,
            setName: editSetName,
            cardNumber: editCardNumber,
        });
        cancelEdit();
        await load();
        } catch (e) {
        setErr(e.message);
        }
    }

    async function remove(id) {
        setErr("");
        try {
        await api.cards.delete(id);
        await load();
        } catch (e) {
        setErr(e.message);
        }
    }

    return (
        <div>
        <h1>Cards</h1>

        <form onSubmit={add} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input placeholder="Set Name" value={setNameValue} onChange={(e) => setSetNameValue(e.target.value)} />
            <input placeholder="#" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
            <button type="submit">Add</button>
        </form>

        {err && <p style={{ color: "crimson" }}>{err}</p>}

        <table width="100%" cellPadding="8">
            <thead>
            <tr>
                <th>Name</th><th>Set</th><th>#</th><th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {items.map((c) => (
                <tr key={c.id}>
                {editingId === c.id ? (
                    <>
                    <td><input value={editName} onChange={(e) => setEditName(e.target.value)} /></td>
                    <td><input value={editSetName} onChange={(e) => setEditSetName(e.target.value)} /></td>
                    <td><input value={editCardNumber} onChange={(e) => setEditCardNumber(e.target.value)} /></td>
                    <td>
                        <button onClick={() => saveEdit(c.id)}>Save</button>{" "}
                        <button type="button" onClick={cancelEdit}>Cancel</button>
                    </td>
                    </>
                ) : (
                    <>
                    <td>{c.name}</td>
                    <td>{c.setName}</td>
                    <td>{c.cardNumber}</td>
                    <td>
                        <button type="button" onClick={() => startEdit(c)}>Edit</button>{" "}
                        <button type="button" onClick={() => remove(c.id)}>Delete</button>
                    </td>
                    </>
                )}
                </tr>
            ))}

            {items.length === 0 && (
                <tr><td colSpan="4">No cards yet.</td></tr>
            )}
            </tbody>
        </table>
        </div>
    );
}
