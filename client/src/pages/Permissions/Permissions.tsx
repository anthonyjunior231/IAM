import PermissionsDashboard from "../../components/PermissionsDashboard/PermissionsDashboard";

// import Sidebar from "../../components/Sidebar/Sidebar";
import "./permissions.css";

const Permissions = () => {
  return (
    <div className="permissions">
      {/* <div className="permissions-sidebar">
        <Sidebar />
      </div> */}

      <div className="permissions-board">
        <PermissionsDashboard />
      </div>
    </div>
  );
};

export default Permissions;
