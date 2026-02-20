import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Cards from "./pages/Cards.jsx";
import Sealed from "./pages/Sealed.jsx";
import Purchases from "./pages/Purchases.jsx";
import Sales from "./pages/Sales.jsx";
import { getToken } from "./api.js";

export default function App() {
    const authed = !!getToken();

    return (
        <div style={{ fontFamily: "Arial, sans-serif" }}>
        <NavBar />
        <div style={{ padding: 16 }}>
            <Routes>
            <Route path="/" element={<Navigate to={authed ? "/dashboard" : "/login"} replace />} />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
                path="/dashboard"
                element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
                }
            />
            <Route
                path="/cards"
                element={
                <ProtectedRoute>
                    <Cards />
                </ProtectedRoute>
                }
            />
            <Route
                path="/sealed"
                element={
                <ProtectedRoute>
                    <Sealed />
                </ProtectedRoute>
                }
            />
            <Route
                path="/purchases"
                element={
                <ProtectedRoute>
                    <Purchases />
                </ProtectedRoute>
                }
            />
            <Route
                path="/sales"
                element={
                <ProtectedRoute>
                    <Sales />
                </ProtectedRoute>
                }
            />
            </Routes>
        </div>
        </div>
    );
}
