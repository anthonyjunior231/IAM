import { FormEvent, useState } from "react";
import "./login.css";
import { LoginCredentials } from "../../utils/types.ts";

import InputField from "../../components/inputField/inputField.tsx";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../redux/store.ts";
import { LoginUser, setUserHasToVerify } from "../../redux/slices/authSlice.ts";

//import from react-toastify
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS for styling

const Login = () => {
  //credentials
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });

  //loading state
  const [loadingState, setLoadingState] = useState<boolean>(false);

  //declaring useDispatch and useNavigate
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  //handle change
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  //submit function
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingState(true);
    const result: any = await dispatch(LoginUser(credentials));

    if (result.type === "auth/login/fulfilled") {
      setLoadingState(false);
      dispatch(setUserHasToVerify(true));
      navigate("/verify");
    } else {
      console.log(result.payload);
      setLoadingState(false);

      toast.error(result.payload, {
        position: "top-right", // Adjust position if needed
      });
    }
  };
  return (
    <div className="login-container">
      <div className="login-page">
        {/* <span className="login-title">FileShield</span> */}
        <span className="login-subtitle">Log in to your account</span>

        <form className="login-form" onSubmit={onSubmit}>
          <InputField
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            label="Email"
            placeholder="Email"
            shouldValidate
          />
          <InputField
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            label="Password"
            placeholder="Password"
            shouldValidate
          />

          <span className="login-forgot-password">Forgot password?</span>

          <button className="login-button" disabled={loadingState}>
            {loadingState ? "Loading ..." : "Login"}
          </button>
        </form>

        <span className="terms-and-conditions-text">
          By logging in, you are agreeing to our
          <span className="link-text">Terms of Service</span> and
          <span className="link-text">Privacy</span> Policy.
        </span>
      </div>
    </div>
  );
};

export default Login;
