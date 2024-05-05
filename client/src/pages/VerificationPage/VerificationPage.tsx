import { useState } from "react";
import InputField from "../../components/inputField/inputField.tsx";
import "./verification.css";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store.ts";
import apiCalls from "../../utils/apiCalls.ts";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setUserHasToVerify } from "../../redux/slices/authSlice.ts";

const VerificationPage = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const email = useSelector((state : RootState) => state.auth.user.email);
  const Navigate = useNavigate()

  const handleVerification = async () => {
    const res = await  apiCalls.verifyUser(verificationCode)
    if(!res.data) {
      toast.error("Error verifying user", {
        position: "top-right",
      });
    } else {
      toast.success("user verified");
      setUserHasToVerify(false);
      Navigate("/");
    }
  }

  return (
    <div className="verification-page-container">
      <div className="verificatoion-page">
        <span className="verification-page-text-header">
          Verify
        </span>
        <span className="verification-page-text">
          Please enter verification code sent to your email - {email}
        </span>
        <div className="verification-page-form">
          <InputField
            label="Verification code"
            placeholder="Verification code"
            type="text"
            value={verificationCode}
            onChange={(e: any) => setVerificationCode(e.target.value)}
          />

          <button onClick={handleVerification}>Verify</button>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
