/* eslint-disable @typescript-eslint/no-explicit-any */

import { FormEvent, useState } from "react";
import "./signup.css";
import { SignupCredentials } from "../../utils/types.ts";

import InputField from "../../components/inputField/inputField.tsx";

import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store.ts";
import { SignupUser } from "../../redux/slices/authSlice.ts";
import { useNavigate } from "react-router-dom";

//import from react-toastify
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS for styling

const Signup = () => {
  //signup credentials
  const [credentials, setCredentials] = useState<SignupCredentials>({
    username: "",
    password: "",
    email: "",
  });

  //loading state
  const [loadingState, setLoadingState] = useState<boolean>(false);

  //declaring useDispatch and useNavigate
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  //handlechnage
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials: any) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  //submit function
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingState(true);
    const result: any =await dispatch(SignupUser(credentials));

    if (result.type === "/auth/signup/fulfilled") {
      console.log(result);
      navigate("/login");
      setLoadingState(false);
    } else {
      console.log(result);
      setLoadingState(false);
      toast.error(result.payload, {
        position: "top-right", // Adjust position if needed
      });
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-page">
        {/* <span className="signup-title">FileShield</span> */}
        <span className="signup-subtitle">Sign in to your account</span>

        <form className="signup-form" onSubmit={onSubmit}>
          <InputField
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            label="Username"
            placeholder="Username"
            shouldValidate
          />
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

          <span className="signup-forgot-password">Forgot password?</span>

          <button className="signup-button" disabled={loadingState}>
            {loadingState ? "loading . . . " : "Sign Up"}
          </button>
        </form>

        <span className="terms-and-conditions-text">
          By logging in, you are agreeing to our{" "}
          <span className="link-text">Terms of Service</span> and{" "}
          <span className="link-text">Privacy</span> Policy.
        </span>
      </div>
    </div>
  );
};

export default Signup;
