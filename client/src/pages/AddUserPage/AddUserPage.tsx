import { useEffect, useState } from "react";
import InputField from "../../components/inputField/inputField.tsx";
import "./addUserPage.css";

import apiCalls from "../../utils/apiCalls.ts";
import { RootState } from "../../redux/store.ts";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS for styling

import Select from "react-select";

import { customStyles } from "../../utils/helpers.ts";

const options = [
  { value: "admin", label: "Administrator" },
  { value: "manager", label: "Manager" },
  { value: "employee", label: "Employee" },
  { value: "cyber_security_analyst", label: "CyberSecurity Analyst" },
  { value: "customer_service", label: "Customer Service" },
  { value: "chief_finance_officer", label: "Chief Finance Officer" },
  { value: "business_administrator", label: "Business Administrator" },
  // { value: "sha256", label: "sha256" },
];

const AddUserPage = () => {
  const [loadingState, setLoadingState] = useState<boolean>(false);

  const token = useSelector((state: RootState) => state.auth.user.token);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  //declarign navigate
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoadingState(true);

    try {
      const res = await apiCalls.signupApiCall(formData, token);

      if (res.status === 201) {
        setLoadingState(false);
        toast.success(res.data.message, {
          position: "top-right",
        });
        navigate("/permissions");
      } else {
        setLoadingState(false);
        throw new Error("Something went wrong");
      }
    } catch (error) {
      setLoadingState(false);
      toast.error("Something went wrong", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="add-user-page-container">
      <div className="add-user-page">
        <span className="add-user-text">Add user</span>

        <InputField
          name="email"
          type="email"
          placeholder="User's email"
          label="User's email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <InputField
          name="username"
          type="text"
          placeholder="User's username"
          label="User's username"
          value={formData.username}
          onChange={handleInputChange}
        />
        <InputField
          name="password"
          type="password"
          placeholder="User's password"
          label="User's password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <Select
          placeholder="Choose role"
          options={options}
          styles={customStyles}
          onChange={(selectedOption) =>
            setFormData((prevState: any) => ({
              ...prevState,
              role: selectedOption?.value,
            }))
          }
        />

        <button
          disabled={loadingState}
          onClick={handleSubmit}
          className="add-user-button"
        >
          {loadingState ? "Loading . . . ." : "Add user"}
        </button>
      </div>
    </div>
  );
};

export default AddUserPage;
