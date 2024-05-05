import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface SuperAdminOnlyProps {
  // Define any props needed by the Component
}

const SuperAdminOnly = <P extends SuperAdminOnlyProps>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> => {
  const AuthenticatedComponent: React.FC<P> = (props) => {
    const userRole = useSelector((state: RootState) => state.auth.user.role);

    if (userRole !== "super_admin") {
      return <Navigate to="/" />;
    } else {
      return <WrappedComponent {...props} />;
    }
  };

  return AuthenticatedComponent;
};

export default SuperAdminOnly;
