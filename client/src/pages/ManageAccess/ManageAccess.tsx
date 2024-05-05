import { useEffect, useState } from "react";
import "./manageAccess.css";
import ManageAccessFile from "../../components/ManageAccessFile/ManageAccessFile";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import requestAccessApiCalls from "../../services/requestAccessApiCalls";

const ManageAccess = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loadingState, setLoadingState] = useState<boolean>(true);

  const role = useSelector((state: RootState) => state.auth.user.role);
  const token = useSelector((state: RootState) => state.auth.user.token);

  // const [getrequestAgain, setGetRequestAgain] = useState(0);
  const id = useSelector((state: RootState) => state.auth.user.id);

  const getAllRequests = async () => {
    setLoadingState(true);
    const res = await requestAccessApiCalls.getAllAccessRequests(token);

    setRequests(res.data);

    setLoadingState(false);
  };

  const getRequestsById = async () => {
    setLoadingState(true);

    const res = await requestAccessApiCalls.getRequestAccessesByID(id, token);

    setRequests(res.data);
    setLoadingState(false);
  };
  // useEffect(() => {
  //   getAllRequests();
  // }, [getrequestAgain]);

  useEffect(() => {
    if (role === "super_admin" || role === "admin") {
      getAllRequests();
    } else {
      getRequestsById();
    }
  }, []);

  return (
    <div className="manage-access">
      {loadingState ? (
        <div className="loading-div">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="manage-access-bottom">
          <span className="manage-access-bottom-title">Request History</span>

          <div className="manage-access-table">
            <div className="manage-access-table-header">
              <span>Request</span>
              <span>Reason for request</span>
              <span>Date of Request</span>
              <span>Status of Request</span>
            </div>
            <div className="manage-access-table-content">
              {
                requests.length === 0 && (
                  <div className="no-requests" style={{
                    textAlign: "center",
                    marginTop: "20px",
                  }}>No requests found</div>
                )
              }
              {requests.map((data, index) => {
                return (
                  <ManageAccessFile
                    {...data}
                    key={index}
                    // setGetRequestAgain={setGetRequestAgain}
                    setLoading={setLoadingState}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAccess;
