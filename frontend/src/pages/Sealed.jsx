import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function Sealed() {
    const [items, setItems] = useState([]);
    const [err, setErr] = useState("");
    const [name, setName] = useState("");
    const [setNameValue, setSetNameValue] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editSetName, setEditSetName] = useState("");
    const [editQuantity, setEditQuantity] = useState(1);

    async function load() {
        setErr("");
        try {
        setItems(await api.sealed.list());
        } catch (e) {
        setErr(e.message);
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function add(e) {
        e.preventDefault();
        setErr("");

        try {
        await api.sealed.create({
            name,
            setName: setNameValue,
            quantity: Number(quantity) || 0,
        });

        setName("");
        setSetNameValue("");
        setQuantity(1);
        await load();
        } catch (e) {
        setErr(e.message);
        }
    }

    function startEdit(s) {
        setEditingId(s.id);
        setEditName(s.name ?? "");
        setEditSetName(s.setName ?? "");
        setEditQuantity(s.quantity ?? 0);
    }

    function cancelEdit() {
        setEditingId(null);
        setEditName("");
        setEditSetName("");
        setEditQuantity(1);
    }

    async function saveEdit(id) {
        setErr("");
        try {
        await api.sealed.update(id, {
            name: editName,
            setName: editSetName,
            quantity: Number(editQuantity) || 0,
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
        await api.sealed.delete(id);
        await load();
        } catch (e) {
        setErr(e.message);
        }
    }

    return (
        <div>
        <h1>Sealed</h1>

        <form onSubmit={add} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input placeholder="Set Name" value={setNameValue} onChange={(e) => setSetNameValue(e.target.value)} />
            <input
            placeholder="Qty"
            type="number"
            min="0"
            step="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            style={{ width: 120 }}
            />
            <button type="submit">Add</button>
        </form>

        {err && <p style={{ color: "crimson" }}>{err}</p>}

        <table width="100%" cellPadding="8">
            <thead>
            <tr>
                <th>Name</th>
                <th>Set</th>
                <th>Qty</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {items.map((s) => (
                <tr key={s.id}>
                {editingId === s.id ? (
                    <>
                    <td><input value={editName} onChange={(e) => setEditName(e.target.value)} /></td>
                    <td><input value={editSetName} onChange={(e) => setEditSetName(e.target.value)} /></td>
                    <td>
                        <input
                        type="number"
                        min="0"
                        step="1"
                        value={editQuantity}
                        onChange={(e) => setEditQuantity(e.target.value)}
                        style={{ width: 120 }}
                        />
                    </td>
                    <td>
                        <button type="button" onClick={() => saveEdit(s.id)}>Save</button>{" "}
                        <button type="button" onClick={cancelEdit}>Cancel</button>
                    </td>
                    </>
                ) : (
                    <>
                    <td>{s.name}</td>
                    <td>{s.setName}</td>
                    <td>{s.quantity}</td>
                    <td>
                        <button type="button" onClick={() => startEdit(s)}>Edit</button>{" "}
                        <button type="button" onClick={() => remove(s.id)}>Delete</button>
                    </td>
                    </>
                )}
                </tr>
            ))}

            {items.length === 0 && (
                <tr><td colSpan="4">No sealed products yet.</td></tr>
            )}
            </tbody>
        </table>
        </div>
    );
}
