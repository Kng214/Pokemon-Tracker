import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [err, setErr] = useState("");

    useEffect(() => {
        (async () => {
        setErr("");
        try {
            setData(await api.dashboard.get());
        } catch (e) {
            setErr(e.message);
        }
        })();
    }, []);

    return (
        <div>
        <h1>Dashboard</h1>
        {err && <p style={{ color: "crimson" }}>{err}</p>}
        {!data && !err && <p>Loading...</p>}
        {data && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, maxWidth: 900 }}>
            <Card title="Cards" value={data.cardsCount} />
            <Card title="Sealed" value={data.sealedCount} />
            <Card title="Purchases" value={data.purchasesCount} />
            <Card title="Sales" value={data.salesCount} />
            <Card title="Total Spent" value={`$${Number(data.totalSpent).toFixed(2)}`} />
            <Card title="Total Sales" value={`$${Number(data.totalSales).toFixed(2)}`} />
            <Card title="Realized Profit" value={`$${Number(data.realizedProfit).toFixed(2)}`} />
            </div>
        )}
        </div>
    );
}

function Card({ title, value }) {
    return (
        <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
        <div style={{ opacity: 0.7 }}>{title}</div>
        <div style={{ fontSize: 24, fontWeight: 700 }}>{value}</div>
        </div>
    );
}
