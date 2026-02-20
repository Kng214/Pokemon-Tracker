import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearToken, getToken } from "../api";

export default function NavBar() {
  const nav = useNavigate();
  const authed = !!getToken();

  return (
    <div style={{ display: "flex", gap: 12, padding: 12, borderBottom: "1px solid #ddd" }}>
      {authed ? (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/cards">Cards</Link>
          <Link to="/sealed">Sealed</Link>
          <Link to="/purchases">Purchases</Link>
          <Link to="/sales">Sales</Link>

          <button
            type="button"
            onClick={() => {
              clearToken();
              nav("/login");
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </>
      )}
    </div>
  );
}
