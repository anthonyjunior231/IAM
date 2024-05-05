import { useState, useRef, useEffect } from "react";
import "./file.css";
import { FileData } from "../../utils/types";
import {
  downloadFileFromUrl,
  formatDate,
  openInBrowser,
} from "../../utils/helpers";
import React from "react";

import fileApiCalls from "../../services/fileApiCalls";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS for styling
import { GetAllFiles } from "../../redux/slices/fileSlice";
import { useNavigate } from "react-router-dom";

const File: React.FC<{ file: FileData; onDelete?: any }> = ({
  file,
  onDelete,
}) => {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const optionsRef = useRef<HTMLDivElement>(null);

  const token = useSelector((state: RootState) => state.auth.user.token);
  const files = useSelector((state: RootState) => state.file.files);
  const userRole = useSelector((state: RootState) => state.auth.user.role);
  const dispatch = useDispatch<AppDispatch>();

  console.log(files, "files delete")

  // Effect to handle clicks outside the options container
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(event.target as Node)
      ) {
        setIsOptionsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDownload = async () => {
    const file_id = id || file.file_id;

    fileApiCalls.getFileCall(file_id, token).then((res) => {
      console.log(res.data);
      downloadFileFromUrl(res.data.filePath, file_name);
    });
  };

  const handleOpenInAnotherTab = () => {
    const file_id = id || file.file_id;

    fileApiCalls.getFileCall(file_id, token).then((res) => {
      console.log(res.data);
      openInBrowser(res.data.filePath, file_name);
    });
  };

  const navigate = useNavigate();


  // Effect to close options when delete loading state changes
  useEffect(() => {
    if (deleteLoading) {
      setIsOptionsOpen(false);
    }
  }, [deleteLoading]);

  if (!file) {
    return null; // Return null if file is undefined
  }

  const {
    file_name,
    owner_username,
    file_size,
    created_at,
    access_type,
    id,
    can_access,
  } = file;

  console.log(file, "file admin")

  const handReqeustHandle = async () => {
    navigate(`/request-access/${id}`);
  };

  return (
    <div className="file">
      <div className="filename-container">
        <img src="/assets/file.png" alt="File" />
        <span>{file_name}</span>
      </div>

      <div className="uploaded-by-cont">
        <div>
          <span className="file-email-text">{owner_username}</span>
        </div>
      </div>

      <span className="file-size-text">{file_size}</span>

      <div className="last-modified-and-options">
        <span className="file-last-modified-text">
          {formatDate(created_at)}
        </span>
        <div className="file-options">
          <img
            src="/assets/options-dark.png"
            alt="Options"
            onClick={() => setIsOptionsOpen(!isOptionsOpen)}
          />

          <div
            className="file-options-absolute-container"
            ref={optionsRef}
            style={isOptionsOpen ? { display: "flex" } : { display: "none" }}
          >
            <div
              onClick={
                can_access
                  ? handleDownload
                  : access_type === "request_only"
                  ? handReqeustHandle
                  : handleDownload
              }
            >
              <img src="/assets/file-download.png" alt="" />
              <span>
                {can_access
                  ? "Download"
                  : access_type === "request_only"
                  ? "Request Access"
                  : "Download"}
              </span>
            </div>

            {(can_access ||
              userRole === "super_admin" ||
              userRole === "admin") && (
              <div onClick={handleOpenInAnotherTab}>
                <img src="/assets/link-square.png" alt="" />
                <span>Open in browser</span>
              </div>
            )}

            {/* <div>
              <img src="/assets/wifi-disconnected.png" alt="" />
              <span>Make available offline</span>
            </div> */}
            {userRole === "super_admin" && (
              <div onClick={onDelete}>
                <img src="/assets/delete.png" alt="" />
                <span style={{ color: "red" }}>Delete file</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default File;
