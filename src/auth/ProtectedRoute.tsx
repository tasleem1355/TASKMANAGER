import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface Props {
  children: React.ReactElement;
}

export default function ProtectedRoute({ children }: Props) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  return children;
}
