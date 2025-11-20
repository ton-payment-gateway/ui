import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  shouldRedirect: boolean;
  redirectTo: string;
  children: ReactNode;
}

const ProtectedRoute = ({
  shouldRedirect,
  redirectTo,
  children,
}: ProtectedRouteProps) => {
  if (shouldRedirect) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
