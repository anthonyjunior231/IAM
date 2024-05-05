import Folder from "../Folder/Folder";
import File from "../FIle/File";

import "./dashboard.css";
import { useEffect, useState } from "react";
import { Data, FileData } from "../../utils/types";

import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";

//import from react-toastify
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS for styling

import fileApiCalls from "../../services/fileApiCalls";
import folderApiCalls from "../../services/folderApiCalls";
import { removeHasToVerify } from "../../redux/slices/authSlice";
import { GetAllFiles } from "../../redux/slices/fileSlice";
import { calculateTotalFileSize, countNonNullValues } from "../../utils/helpers";

const Dashboard = () => {
  //loading states
  const [loadingState, setLoadingState] = useState<boolean>(true);
  const [folderLoadingState, setFolderLoadingState] = useState<boolean>(true);

  // const files = useSelector((state: RootState) => state.file.files);

  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState<any[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchedFiles, setSearchedFiles] = useState<any[]>([]);

  //get token from state
  const token = useSelector((state: RootState) => state.auth.user.token);

  //get role from state
  const userRole: string = useSelector(
    (state: RootState) => state.auth.user.role
  );

  const getAllFiles = async () => {
    try {
      const res = await fileApiCalls.getAllFilesCall(token);
      setFiles(res.data);
      setLoadingState(false);
    } catch (error) {
      console.log(error);
      setLoadingState(false);
      toast.error("Error fetching files", {
        position: "top-right",
      });
    }
  };

  const getFolders = async () => {
    try {
      const res = await folderApiCalls.getFoldersCall(token);
      setFolders(res.data);
      setFolderLoadingState(false);
    } catch (error) {
      console.log(error);
      setFolderLoadingState(false);
      toast.error("Error fetching files", {
        position: "top-right",
      });
    }
  };

  //call the getAllFiles method at intialization
  useEffect(() => {
    getAllFiles();
    getFolders();
  }, []);

  //correct the loading state
  useEffect(() => {
    if (files) {
      setLoadingState(false);
    }
  }, [files]);

  const [sortedArray, setSortedArray] = useState<Data[]>([]);

  const [selectedCategory, setSelectedCategory] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const handleSortBasedOnType = (type: string) => {
    const filteredArray = files.filter((file: any) => {
      // Extracting the file extension
      const fileExtension = file.file_name.split('.').pop();
      // Checking if the file extension matches the provided fileType
      return fileExtension === type;
    });
    console.log(filteredArray, "filteredArray");
    setSortedArray(filteredArray);
  };

  const handleSearch = (searchString: string, arr: any[]): void => {
    // Convert the search string to lowercase for case-insensitive matching.
    const searchStringLower = searchString.toLowerCase();

    // Filter the array to find entries where `file_name` contains the search string.
    // This is done in a case-insensitive manner to ensure user input can match files
    // regardless of how the file names are cased.
    const searchResults = arr.filter((obj) => {
      // Convert `file_name` to lowercase for case-insensitive matching.
      const nameLower = obj.file_name.toLowerCase();

      // Check if the lowercase `file_name` includes the lowercase search string.
      // This will allow partial matches such as 'n' or 'nf' to find 'nfhg'.
      return nameLower.includes(searchStringLower);
    });

    setSearchedFiles(searchResults);
  };



  useEffect(() => {
    if (searchQuery.length > 0) {
      handleSearch(searchQuery, files);
    }
  }, [searchQuery]);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(removeHasToVerify());
  }, []);

  const handleDelete = async (file: { id: number; }) => {
    setDeleteLoading(true);
    await fileApiCalls.deleteFileCall(file.id, token).then((res: any) => {
      setDeleteLoading(false);

      if (res.status === 200) {
        toast.success(res.data.message, {
          position: "top-right", // Adjust position if needed
        });
        const updatedFiles = files.filter((currentFile : {id: number}) => currentFile.id !== file.id);

        setFiles(updatedFiles);
        // Call all the files from the backend again
        // dispatch(GetAllFiles(token));
        
      } else {
        toast.error("Something went wrong", {
          position: "top-right", // Adjust position if needed
        });
      }
    });
  };


  return (
    <div className="dashboard">
      <div className="dashboard-top">
        <div className="dashboard-folder-collection">
          <div className="dashboard-top-upper">
            <span>Folders</span>

            <div className="dashboard-top-upper-right">
              <Link to="/folder" className="show-all-button">
                <span>Show all</span>
                <img src="/assets/arrow-down.png" alt="arrow_down" />
              </Link>

              {(userRole === "super_admin" ||
                userRole === "admin" ||
                userRole === "manager") && (
                <>
                  <Link to="/file-upload" className="dashboard-link">
                    <div className="uplaod-button">
                      Upload
                      <img src="/assets/cloud-upload.png" alt="cloud_icon" />
                    </div>
                  </Link>

                  <div className="uplaod-button">
                    <Link to="/folder/add" className="dashboard-link">
                      Add new folder
                    </Link>
                    <img src="/assets/cloud-upload.png" alt="cloud_icon" />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="dashboard-folders">
            {folderLoadingState ? (
              <div className="loading-div">
                <div className="spinner"></div>
              </div>
            ) : (
              folders.map((box, index) => {
                let fileSize = "0 Kb";
                if (countNonNullValues(box.files) > 0) {
                  fileSize = calculateTotalFileSize(box.files);
                  if(fileSize === "NaNKB") fileSize = "0.00 KB";
                }
                return <Folder {...box} key={index} fileSize={fileSize} />;
              })
            )}
          </div>
        </div>

        <div className="dashboard-folder-collection"></div>
      </div>
      <div className="dashboard-bottom">
        <span className="all-files-text">All Files</span>

        <div className="dashboard-nav">
          <div className="dashboard-nav-left">
            <span
              className={selectedCategory === 1 ? "dashboard-nav-selected" : ""}
              onClick={() => {
                setSelectedCategory(1);
                setSortedArray([]);
              }}
            >
              View All
            </span>
            <span
              className={selectedCategory === 2 ? "dashboard-nav-selected" : ""}
              onClick={() => {
                setSelectedCategory(2);
                handleSortBasedOnType("document");
              }}
            >
              Documents
            </span>
            <span
              className={selectedCategory === 3 ? "dashboard-nav-selected" : ""}
              onClick={() => {
                setSelectedCategory(3);
                handleSortBasedOnType("pdf");
              }}
            >
              PDFs
            </span>
            <span
              className={selectedCategory === 4 ? "dashboard-nav-selected" : ""}
              onClick={() => {
                setSelectedCategory(4);
                handleSortBasedOnType("image");
              }}
            >
              Images
            </span>
          </div>
          <div className="dashboard-nav-right">
            <div className="dashboard-input-cont">
              <img src="/assets/search.png" alt="Search" />
              <input
                type="text"
                placeholder="Search"
                onChange={(e: any) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="dashboard-table-header">
          <span>File name</span>
          <span>Uploaded By</span>
          <span>Size</span>
          <span>Last Modified</span>
        </div>

        {loadingState || folderLoadingState ? (
          <div className="loading-div">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="dashboard-table-content">
            {searchQuery.length > 0 ? (
              searchedFiles.map((file, index) => {
                return <File file={file} key={index} onDelete={() => handleDelete(file)} />;
              })
            ) : selectedCategory === 1 ? (
              files?.map((file: FileData, index: number) => (
                <File file={file} key={index} onDelete={() => handleDelete(file)}/>
              ))
            ) : selectedCategory === 2 && files!.length > 0 ? (
              files?.map((file: FileData, index: number) => (
                <File file={file} key={index}  onDelete={() => handleDelete(file)}/>
              ))
            ) : selectedCategory === 3 && files!.length > 0 ? (
              files?.map((file: FileData, index: number) => (
                <File file={file} key={index} onDelete={() => handleDelete(file)}/>
              ))
            ) : selectedCategory === 4 && files!.length > 0 ? (
              files?.map((file: FileData, index: number) => (
                <File file={file} key={index} onDelete={() => handleDelete(file)}/>
              ))
            ) : selectedCategory === 2 ? (
              <span className="decline-span">There are no documents</span>
            ) : selectedCategory === 3 ? (
              <span className="decline-span">There are no PDFs</span>
            ) : selectedCategory === 4 ? (
              <span className="decline-span">There are no images</span>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
