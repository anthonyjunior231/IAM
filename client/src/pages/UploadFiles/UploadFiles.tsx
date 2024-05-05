import "./uploadFiles.css";

//importing nessesary imports
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Link, useNavigate } from "react-router-dom";
import FileUploadModal from "../../components/FileUploadModal/FileUploadModal";
import { AppDispatch, RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
// import { CreateFile } from "../../redux/slices/fileSlice";

import { calculateFileSize, customUploadStyles } from "../../utils/helpers";
import { GetFolders } from "../../redux/slices/folderSlice";
import Select from "react-select";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS for styling
import fileApiCalls from "../../services/fileApiCalls";

const permissionOptions = [
  { value: "request_only", label: "Request access only" },
  { value: "org_wide", label: "Orgarnization wide" },
];

const UploadFiles = () => {
  const [loadingState, setLoadingState] = useState<boolean>(true);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);

  const [options, setOptions] = useState<any>();

  const token = useSelector((state: RootState) => state.auth.user.token);

  const [formData, setFormData] = useState<any>({
    file_name: "",
    file_size: "",
    folder_id: -1,
    permission_type: "",
    description: "",
    file: null,
  });
  //declaring dispatch
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (formData.file) {
      const fileSize = calculateFileSize(formData.file);
      setFormData((prevFormData: any) => ({
        ...prevFormData,
        file_size: fileSize,
        file_name: prevFormData.file.name,
      }));
    }
  }, [formData.file]);

  //call the getFolders method when the app loads and categories
  const getFolders = async () => {
    return await dispatch(GetFolders());
  };

  useEffect(() => {
    getFolders().then((res: any) => {
      console.log(res);
      setLoadingState(false);

      const updatedOptions = res.payload.map((item: any) => ({
        id: item.id,
        value: item.name,
        label: item.name.charAt(0).toUpperCase() + item.name.slice(1),
      }));

      setOptions(updatedOptions);
    });
  }, []);

  const handleSubmit = async () => {
    if (
      !formData.file ||
      formData.permission_type === "" ||
      formData.folder_id === -1 ||
      formData.description === "" ||
      formData.file_name === ""
    ) {
      toast.error("You are required to fill all the fields", {
        position: "top-right",
      });
      return;
    }
    try {
      setLoadingButton(true);
      const res = await fileApiCalls.createFileCall(formData, token);

      navigate("/");
      setLoadingButton(false);
      toast.success(res.data.message, {
        position: "top-right",
      });
    } catch (error) {
      console.error("Error:", error);
      setLoadingButton(false);
      toast.error("Something went wrong", {
        position: "top-right",
      });
    }
  };

  //react dropzone config
  const onDrop = useCallback((acceptedFiles: any) => {
    // Do something with the files
    console.log("accepted files = ", acceptedFiles);
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      file: acceptedFiles[0],
    }));
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  //mock loading state
  const [isLoading, setIsLoading] = useState(false);

  //usenavigate for navigation
  const navigate = useNavigate();

  //handle select chnage
  const handleFolderChange = (selectedOption: any) => {
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      folder_id: selectedOption.id,
    }));
  };
  const handlePermissionChange = (selectedOption: any) => {
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      permission_type: selectedOption.value,
    }));
  };
  return (
    <>
      {loadingState ? (
        <>Loading ...</>
      ) : (
        <div className="file-upload-content-container">
          <div className="file-upload-absolute">
            {isLoading && <FileUploadModal setIsLoading={setIsLoading} />}
          </div>
          <Link className="file-upload-upper" to="/">
            <img src="/assets/arrow-left.png" alt="Back" />
            <span>Back to overview</span>
          </Link>

          <div className="file-upload-content">
            <span className="upload-files-text">Upload Files</span>

            <Select
              styles={customUploadStyles}
              isMulti={false} // Set isMulti to false to allow only one option selection
              options={permissionOptions}
              placeholder="Select Permission Option"
              onChange={handlePermissionChange}
            />

            <Select
              styles={customUploadStyles}
              isMulti={false} // Set isMulti to false to allow only one option selection
              onChange={handleFolderChange}
              options={options}
              placeholder="Select Folder"
            />

            <div className="file-upload-input-container" {...getRootProps()}>
              <input {...getInputProps()} />
              <img src="/assets/folder.png" alt="Folder" />
              {formData.file_name ? (
                <span>{formData.file_name}</span>
              ) : isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p>Drag and drop files here or browse</p>
              )}
            </div>

            <textarea
              name="description"
              id=""
              cols={30}
              rows={4}
              className="upload-file-desc"
              placeholder="Description"
              onChange={(e: any) => {
                setFormData((prevFormData: any) => ({
                  ...prevFormData,
                  description: e.target.value,
                }));
              }}
            ></textarea>

            <div className="file-upload-buttons-container">
              <button className="cancel-button" onClick={() => navigate("/")}>
                Cancel
              </button>
              <button
                className="upload-button"
                onClick={() => {
                  // setIsLoading(true);
                  handleSubmit();
                }}
              >
                {loadingButton ? "Loading . . . " : "Upload File"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadFiles;
