import { useRef, useState, useEffect } from "react";
import EditPermissionFile from "../../components/EditPermissionFile/EditPermissionFile";
import "./editPermissions.css";
import permissionApiCalls from "../../services/permissionApiCalls";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

//import from react-toastify
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS for styling
import { useNavigate } from "react-router-dom";

const EditPermissions = () => {
  const optionsRef = useRef(null);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [assignedRole, setAssignedRole] = useState("manager");

  const [canRead, setCanRead] = useState(false);
  const [canWrite, setCanWrite] = useState(true);
  const [canDelete, setCanDelete] = useState(false);
  const [is_active, setIsActive] = useState(false);

  const [loadingState, setLoadingState] = useState(true);

  const userToBeEdited = useSelector(
    (state: RootState) => state.auth.userPermissionToBeEdited
  );

  const token = useSelector((state: RootState) => state.auth.user.token);

  useEffect(() => {
    if (userToBeEdited) {
      setLoadingState(false);
      setCanRead(userToBeEdited.can_read);
      setCanWrite(true);
      setCanDelete(userToBeEdited.can_delete);
      setIsActive(!userToBeEdited.is_active);
    }
  }, [userToBeEdited]);

  const navigate = useNavigate();

  const handleEditPermission = async (e: any) => {
    e.preventDefault();

    try {
      // Await the promise from editPermission
      const res = await editPermission();

      console.log(res);
      toast.success("User permission changed successfully", {
        position: "top-right",
      });

      navigate("/permissions");
    } catch (error) {
      console.error("Error editing permission:", error);
      toast.error("Error changing user permission", {
        position: "top-right",
      });
      // You can also display a user-friendly error message here
    }
  };

  const editPermission = () => {
    const data = {
      user_id: userToBeEdited.user_id,
      can_read: canRead,
      can_write: canWrite,
      can_delete: canDelete,
      is_active: !is_active,
      role: assignedRole,
    };
    return permissionApiCalls.updatePermission(data, token);
  };

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
    <>
      {loadingState ? (
        <>Loading . . . . </>
      ) : (
        <div className="edit-permissions-cont">
          <div className="edit-permissions">
            <div className="edit-permissions-header">
              <div className="edit-permissions-header-left">
                {/* <img src="/assets/avatar-mini.png" alt="Avatar" /> */}
                <div>
                  <span className="edit-permissions-name">
                    {userToBeEdited.username}
                  </span>
                  <span className="edit-permissions-email">
                    {userToBeEdited.email}
                  </span>
                </div>
              </div>
              {/* <div className="edit-permissions-header-right">
                <span>View Profile</span>
                <img src="/assets/link-square-colored.png" alt="" />
              </div> */}
            </div>
            <div className="edit-permissions-content">
              <div className="edit-permissions-content-header">
                <div className="edit-permissions-content-header-left">
                  <span>User</span>
                </div>
                <div
                  className="edit-permissions-content-header-right"
                  onClick={() => setIsOptionsOpen(!isOptionsOpen)}
                >
                  <span>Administrator</span>
                  <div className="edit-permission-absolute-container">
                    <img src="/assets/arrow-down.png" alt="drop-down" />

                    <div
                      className="edit-permission-absolute"
                      ref={optionsRef}
                      style={
                        isOptionsOpen
                          ? { display: "flex" }
                          : { display: "none" }
                      }
                    >
                      <div onClick={() => setAssignedRole("admin")}>
                        <span>Administrator</span>
                        {assignedRole === "admin" && (
                          <img src="/assets/check-mark.png" alt="Check" />
                        )}
                      </div>
                      <div onClick={() => setAssignedRole("manager")}>
                        <span>Manager</span>
                        {assignedRole === "manager" && (
                          <img src="/assets/check-mark.png" alt="Check" />
                        )}
                      </div>
                      <div onClick={() => setAssignedRole("employee")}>
                        <span>Employee</span>
                        {assignedRole === "employee" && (
                          <img src="/assets/check-mark.png" alt="Check" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="edit-permissions-content-content">
                <EditPermissionFile
                  state={canRead}
                  setState={setCanRead}
                  texts={[
                    "Can Read",
                    "Makes user able to download and read files",
                  ]}
                />
                {/* <EditPermissionFile
                  state={canWrite}
                  setState={setCanWrite}
                  texts={["Can Read", "Makes user able to write files"]}
                /> */}
                <EditPermissionFile
                  state={canDelete}
                  setState={setCanDelete}
                  texts={["Can Delete", "Makes user able to delete files"]}
                />
                <EditPermissionFile
                  state={is_active}
                  setState={setIsActive}
                  texts={["Disable User", "Disable this user"]}
                />
              </div>

              <div className="edit-permissions-bottom">
                <button onClick={handleEditPermission}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditPermissions;
