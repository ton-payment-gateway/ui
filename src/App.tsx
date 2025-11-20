import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import type { IApiResponse } from "./lib/types";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Merchant from "./pages/Merchant";
import NotFound from "./components/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import api from "./lib/api";
import useAuth from "./store/auth";
import { useEffect } from "react";

function App() {
  const { setLoggedIn, isLoading, isLoggedIn } = useAuth();

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      setLoggedIn(false);
      return;
    }

    api
      .get<IApiResponse<{ id: string; username: string }>>("auth/session")
      .then((response) => {
        setLoggedIn(!!response?.data?.data?.id);
      })
      .catch(() => {
        setLoggedIn(false);
      });
  }, [setLoggedIn]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <ProtectedRoute shouldRedirect={isLoggedIn} redirectTo="/">
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute shouldRedirect={isLoggedIn} redirectTo="/">
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute shouldRedirect={!isLoggedIn} redirectTo="login">
              <Layout>
                <Home />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="merchants/:id"
          element={
            <ProtectedRoute shouldRedirect={!isLoggedIn} redirectTo="login">
              <Layout>
                <Merchant />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
