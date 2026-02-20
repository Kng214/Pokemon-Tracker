import React, { useState } from "react";
import { api, setToken } from "../api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const nav = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");

    async function onSubmit(e) {
        e.preventDefault();
        setErr("");
        try {
        const { token } = await api.auth.signup(username, password);
        setToken(token);
        nav("/dashboard");
        } catch (e) {
        setErr(e.message);
        }
    }

    return (
        <div style={{ maxWidth: 360 }}>
        <h1>Signup</h1>
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" type="password" />
            <button type="submit">Create Account</button>
        </form>
        {err && <p style={{ color: "crimson" }}>{err}</p>}
        </div>
    );
}
