import { ChangeEvent, useState } from "react";
import InputField from "../../components/inputField/inputField.tsx";
import "./addFolderPage.css";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store.ts";
import { useNavigate } from "react-router-dom";
import { CreateFolder } from "../../redux/slices/folderSlice.ts";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS for styling

interface FormData {
  description: string;
  name: string;
}

const initialFormData: FormData = {
  description: "", // Initial values can be empty strings or whatever default values you prefer
  name: "",
};

const AddFolderPage = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loadingState, setLoadingState] = useState<boolean>(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  //declaring dispatch
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoadingState(true);
    const result = await dispatch(CreateFolder(formData));

    console.log(result);

    if (result.type === "folder/create-folders/fulfilled") {
      navigate("/folder");
      toast.success("Folder created successfully", {
        position: "top-right", // Adjust position if needed
      });
      setLoadingState(false);
    } else {
      toast.error("Something went wrong", {
        position: "top-right", // Adjust position if needed
      });
      setLoadingState(false);
    }
  };
  return (
    <div className="add-folder-page">
      <div className="add-folder-container">
        <span className="add-folder-text">Create folder</span>
        <InputField
          type="text"
          name="name"
          label="Name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        <InputField
          type="text"
          name="description"
          placeholder="Description"
          label="Description"
          value={formData.description}
          onChange={handleChange}
        />

        <button
          onClick={handleSubmit}
          disabled={loadingState}
          className="add-folder-button"
        >
          {loadingState ? "Loading . . . " : "Create folder"}
        </button>
      </div>
    </div>
  );
};

export default AddFolderPage;
