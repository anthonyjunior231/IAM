import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Navigate } from "react-router-dom";

interface ManagerOrAdminProps {
  // Define any props needed by the Component
}

const ManagerOrAdminOnly = <P extends ManagerOrAdminProps>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> => {
  const SecuredComponent: React.FC<P> = (props) => {
    const userRole = useSelector((state: RootState) => state.auth.user.role);

    if (
      userRole === "super_admin" ||
      userRole === "manager" ||
      userRole === "admin"
    ) {
      return <WrappedComponent {...props} />;
    } else {
      return <Navigate to="/" />;
    }
  };

  return SecuredComponent;
};

export default ManagerOrAdminOnly;
