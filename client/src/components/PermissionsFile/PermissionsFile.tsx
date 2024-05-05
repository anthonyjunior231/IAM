import { useEffect, useRef, useState } from "react";
import "./permissionsFile.css";
import { Link } from "react-router-dom";

import { PermissionsDataType } from "../../utils/types";
import { reviseRole } from "../../utils/helpers";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useDispatch } from "react-redux";
import { setUserToBeEdited } from "../../redux/slices/authSlice";

const PermissionsData: React.FC<{
  data: PermissionsDataType;
}> = ({ data }) => {
  const {
    username,
    email,
    role,
    is_active,
    id,
    // can_read,
    // can_delete,
    // can_write,
  } = data;

  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null); // Ref for the options container

  const dispatch = useDispatch<AppDispatch>();

  const handleSetState = () => {
    dispatch(setUserToBeEdited(data));
    console.log("user setted successfulyly");
  };

  //get user role from state
  const userRole = useSelector((state: RootState) => state.auth.user.role);

  useEffect(() => {
    // Function to handle clicks outside the options container
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(event.target as Node)
      ) {
        setIsOptionsOpen(false); // Close the options container
      }
    };

    // Add event listener for clicks on the document
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="permissions-file"
      style={
        userRole === "super_admin"
          ? {
              gridTemplateColumns:
                "minmax(300px, 6fr) minmax(200px, 3fr) minmax(100px, 3fr) minmax(15px, 0.5fr)",
            }
          : {
              gridTemplateColumns:
                "minmax(300px, 6fr) minmax(200px, 3fr) minmax(150px, 3fr)",
            }
      }
    >
      <div className="permissions-file-pic-and-name">
        <div>
          <span className="permissions-name">{username}</span>
          <span className="permissions-email">{email}</span>
        </div>
      </div>

      <span>{reviseRole(role)}</span>
      <span>{is_active ? "Active" : "Inactive"}</span>

      <div className="view-profile-cont">
        {/* <div>
          <span>View Profile</span>
          <img src="/assets/link-square.png" alt="" />
        </div> */}

        {userRole === "super_admin" && (
          <div
            className="permission-options-icon"
            onClick={() => setIsOptionsOpen(!isOptionsOpen)}
          >
            <img
              src="/assets/options-dark.png"
              alt="Options"
              className="options-icon"
            />

            <div
              className="permissions-file-options-absolute-container"
              ref={optionsRef}
              style={isOptionsOpen ? { display: "flex" } : { display: "none" }}
            >
              <Link
                onClick={handleSetState}
                to={`/edit-permissions/${id}`}
                className="permissions-file-options-absolute-container-file"
              >
                <img src="/assets/file-download.png" alt="" />
                <span>Edit permissions</span>
              </Link>
              {/* <Link
              to="/edit-permissions"
              className="permissions-file-options-absolute-container-file"
            >
              <img src="/assets/file-edit.png" alt="" />
              <span>Add to a group</span>
            </Link> */}
              <Link
                to="/edit-permissions"
                className="permissions-file-options-absolute-container-file"
              >
                <img src="/assets/link-square.png" alt="" />
                <span>Assign role</span>
              </Link>
              <Link
                to="/edit-permissions"
                className="permissions-file-options-absolute-container-file"
              >
                <img src="/assets/wifi-disconnected.png" alt="" />
                <span>Disable user</span>
              </Link>
              <Link
                to="/edit-permissions"
                className="permissions-file-options-absolute-container-file"
              >
                <img src="/assets/delete.png" alt="" />
                <span>Remove user</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PermissionsData;
