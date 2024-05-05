import { useState } from "react";
import InputField from "../../components/inputField/inputField.tsx";
import "./requestAccessPage.css";
import fileApiCalls from "../../services/fileApiCalls.ts";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store.ts";

//import from react-toastify
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS for styling

const RequestAccessPage = () => {
  const [reason, setReason] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleReasonChnage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReason(e.target.value);
  };

  const { id } = useParams();

  const token = useSelector((state: RootState) => state.auth.user.token);

  const navigate = useNavigate();

  const handleReqeust = async () => {
    setLoading(true);
    try {
      const res = await fileApiCalls.createAccessRequestCall(
        Number(id),
        reason,
        token
      );

      setLoading(false);
      toast.success("Request sent successfully", {
        position: "top-right", // Adjust position if needed
      });

      navigate("/");
    } catch (error) {
      setLoading(false);

      toast.error("Error sending request", {
        position: "top-right", // Adjust position if needed
      });
    }
  };
  return (
    <div className="request-access-page">
      <div className="manage-access-top">
        <span className="manage-access-top-title">Request Access</span>
        <span className="manage-access-top-subtitle">
          Send a request to access this file
        </span>

        <form className="manage-access-form">
          <InputField
            value={reason}
            onChange={handleReasonChnage}
            name="reason"
            placeholder="Reason"
            label="Reason"
          />
          <button onClick={handleReqeust} disabled={loading}>
            {loading ? "Loading . . ." : "Request Access"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestAccessPage;
