import { ChangeEvent, useEffect, useState } from "react";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import File from "../../components/FIle/File";
import "./filesPage.css";
import { FileData } from "../../utils/types";
import { Link, useParams } from "react-router-dom";
import folderApiCalls from "../../services/folderApiCalls";

//import from react-toastify
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS for styling
import fileApiCalls from "../../services/fileApiCalls";

//FIMME - ADD THE ADMIN FROM BACKEND

const FilesPage = () => {
  const { id } = useParams();
  // Loading state
  const [loadingState, setLoadingState] = useState<boolean>(true);
  // const [selectAll, setSelectAll] = useState<boolean>(false);
  const [fetchedFolderFiles, setFetchedFolderFiles] = useState<FileData[]>([]);
  const [folderName, setFolderName] = useState<string>("");

  const token = useSelector((state: RootState) => state.auth.user.token);


  const getFilesInAFolder = async () => {
    try {
      const res = await folderApiCalls.getFolderCall(Number(id), token);
      console.log(res.data, "res")
      setFetchedFolderFiles(res.data.files);
      setFolderName(res.data.name);
      setLoadingState(false);
    } catch (error) {
      setLoadingState(false);
      toast.error("Error fetching files", {
        position: "top-right",
      });
    }
  };


  useEffect(() => {
    getFilesInAFolder();
  }, []);

  // Inside FilesPage component
  const handleFileDelete = async (file: FileData) => {
    // Call the API again to fetch updated files after deletion
    try {
     console.log(file, "file")
      await fileApiCalls.deleteFileCall(file.file_id as number, token).then((res: any) => {

        if (res.status === 200) {
          toast.success(res.data.message, {
            position: "top-right", // Adjust position if needed
          });
          // const updatedFiles = files.filter((currentFile : {id: number}) => currentFile.id !== file.id);
          const updatedFolders = fetchedFolderFiles.filter((file) => file.file_id !== file.file_id);
          setFetchedFolderFiles(updatedFolders);
        } else {
          toast.error("Something went wrong", {
            position: "top-right", // Adjust position if needed
          });
        }
      });
      //  const res=  await getFilesInAFolder();

    } catch (error) {
      // Handle error if needed
      console.error("Error fetching files after deletion:", error);
    }
  };


  console.log(fetchedFolderFiles, "folderfiles")
  return (
    <div className="file-page-container">
      <div className="file-page">
        <Link className="file-upload-upper" to="../">
          <img src="/assets/arrow-left.png" alt="Back" />
          <span>Back to overview</span>
        </Link>

        <span className="file-page-text">
          Files from "<strong>{folderName}</strong>" folder
        </span>

        <div className="file-page-bottom">
          <div className="file-page-table-header">
            <span>File name</span>
            <span>Uploaded By</span>
            <span>Size</span>
            <span>Last Modified</span>
          </div>

          {loadingState ? (
            <div className="loading-div">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="file-page-table-content">
              {
                fetchedFolderFiles.length === 1 && !fetchedFolderFiles[0].file_id && <span style={{
                  display: "flex",
                  justifyContent: "center",
                }}>No files found</span>
              }
              {
                fetchedFolderFiles.length === 0 && <span style={{
                  display: "flex",
                  justifyContent: "center",
                }}>No files found</span>
              }
              {
                fetchedFolderFiles.length >= 1 && fetchedFolderFiles[0].file_id && fetchedFolderFiles?.map((file: FileData, index: number) => (
                  <File file={file} key={index} onDelete={() => handleFileDelete(file)} />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilesPage;
