import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface WithAuthProps {
  // Define any props needed by the Component
}

const WithAuth = <P extends WithAuthProps>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> => {
  const AuthenticatedComponent: React.FC<P> = (props) => {
    const user = useSelector((state: RootState) => state.auth.user);

    console.log(user);

    if (!user) {
      return <Navigate to="/login" />;
    } else {
      return <WrappedComponent {...props} />;
    }
  };

  return AuthenticatedComponent;
};

export default WithAuth;
