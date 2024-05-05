import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Assuming these imports and definitions are correct
import apiCalls from "../../utils/apiCalls";
import fileApiCalls from "../../services/fileApiCalls";
import requestAccessApiCalls from "../../services/requestAccessApiCalls";
import { formatDate } from "../../utils/helpers";
import { RootState } from "../../redux/store";
import "./manageAccessFile.css";

// Correctly defined interfaces above

const ManageAccessFile: React.FC<any> = ({
  user_id,
  file_id,
  status,
  created_at,
  reason,
  id,
  setLoading,
}) => {
  const [user, setUser] = useState<any>(null);
  const [file, setFile] = useState<any>(null);
  const [permissionStatus, setPermissionStatus] = useState<boolean>(status);

  const token = useSelector((state: RootState) => state.auth.user.token);
  const role = useSelector((state: RootState) => state.auth.user.role);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await apiCalls.getUserCall(user_id);
        setUser(res.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    const getFile = async () => {
      try {
        const res = await fileApiCalls.getFileCall(file_id, token);
        setFile(res.data);
      } catch (error) {
        console.error("Failed to fetch file:", error);
      }
    };

    getUser();
    getFile();
  }, [user_id, file_id, token]);

  useEffect(() => {
    if (user && file) {
      setLoading(false);
    }
  }, [user, file]);

  // Define changeStatusOfRequest and other necessary code...
  const changeStatusOfRequest = async () => {
    try {
      // Assuming id, file_id, user_id, status, reason, and token are defined elsewhere
      requestAccessApiCalls
        .updateRequestAccess(
          id,
          file_id,
          user_id,
          !permissionStatus,
          reason,
          token
        )
        .then((res) => {
          if (res) {
            toast.success("Permission updated successfully", {
              position: "top-right",
            });

            setPermissionStatus(!permissionStatus);
          }
        });
    } catch (error) {
      console.error(error); // It's good to log the actual error to the console for debugging
      toast.error("Error updating permission", {
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    console.log(file?.file?.file_name);
    console.log(user);
  }, [user, file]);

  if(!user ?? !file) {
    return <div>Loading...</div>;
  }

  return (
    <div className="manage-access-file">
      {role === "super_admin" ? (
        (user && file) &&
        <>
          <span>{`${user?.username} requested for file ${file?.file?.file_name}`}</span>
          <span>{formatDate(created_at)}</span>
          <span>{reason}</span>
          <button
            className={
              permissionStatus ? "manage-access-red" : "manage-access-green"
            }
            style={{ cursor: "pointer" }}
            onClick={changeStatusOfRequest}
          >
            {permissionStatus ? (
              <>
                <img src="/assets/cancel-circle-icon.png" alt="" />
                <span>Remove Access</span>
              </>
            ) : (
              <>
                <img src="/assets/check-mark-circle-icon.png" alt="" />
                <span>Approve</span>
              </>
            )}
          </button>
        </>

      ) : (
        <>
          <span>{`${user?.username} requested for file ${file?.file_name}`}</span>
          <span>{formatDate(created_at)}</span>
          <span>{reason}</span>
          <button
            className={
              permissionStatus ? "manage-access-green" : "manage-access-red"
            }
          >
            {permissionStatus ? (
              <>
                <img src="/assets/check-mark-circle-icon.png" alt="" />
                <span>Approved</span>
              </>
            ) : (
              <>
                <img src="/assets/cancel-circle-icon.png" alt="" />
                <span>Not approved</span>
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
};

export default ManageAccessFile;
