import { useEffect, useState } from "react";
import Folder from "../Folder/Folder";
import "./overviewDashboard.css";
import OverviewFile from "../OverviewFile/OverviewFile";
import RecentActivity from "../RecentActivity/RecentActivity";
import { OverviewData } from "../../utils/types";
import logApiCalls from "../../services/logApiCalls";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

//import from react-toastify
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS for styling
import apiCalls from "../../utils/apiCalls";
import folderApiCalls from "../../services/folderApiCalls";
import {
  calculateTotalFileSize,
  countNonNullValues,
} from "../../utils/helpers";

const OverviewDashboard = () => {
  const token = useSelector((state: RootState) => state.auth.user.token);
  const user = useSelector((state: RootState) => state.auth.user);

  console.log(user);

  const [logLoadingState, setLogLoadingState] = useState<boolean>(true);
  const [userLoadingState, setUserLoadingState] = useState<boolean>(true);
  const [folderLoadingState, setFolderLoadingState] = useState<boolean>(true);

  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);

  const fetchUsers = async () => {
    try {
      apiCalls.getUsersCall().then((res) => {
        setUserLoadingState(false);
        console.log(res.data);
        setUsers(res.data);
      });
    } catch (error) {
      setUserLoadingState(false);

      toast.error("Error fetching users", {
        position: "top-right",
      });
      console.error("Error fetching users:", error);
    }
  };

  const getAllLogs = async () => {
    try {
      const res = await logApiCalls.getAllLogs(token);
      setLogs(res.data);

      setLogLoadingState(false);
    } catch (error) {
      console.error("Error fetching logs:", error);
      toast.error("Error fetching logs", {
        position: "top-right",
      });
      setLogLoadingState(false);
    }
  };

  const fetchFolders = async () => {
    try {
      const res = await folderApiCalls.getFoldersCall(token);
      const shortenedData = res.data.slice(0, 3); // Shorten the array to the first 3 elements
      setFolders(shortenedData);
      setFolderLoadingState(false);
    } catch (error) {
      toast.error("Error fetching folders", {
        position: "top-right",
      });
      console.error("Error fetching folders:", error);
      setFolderLoadingState(false);
    }
  };

  useEffect(() => {
    getAllLogs();
    fetchUsers();
    fetchFolders();
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<number>(1);
  const [sortedArray, setSortedArray] = useState<OverviewData[]>([]);

  const handleSortBasedOnRole = (
    category: string | null,
    secondCategory = ""
  ) => {
    const filteredArray = users.filter((data: OverviewData) => {
      return data.role === category || data.role === secondCategory;
    });

    setSortedArray(filteredArray);
  };

  return (
    <div className="overview-dashboard">
      <div className="overview-dashboard-top">
        {folderLoadingState ? (
          <div className="spinner"></div>
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
      <div className="overview-dashboard-middle">
        <span className="users-access-text">User's access permissions</span>

        <div className="overview-roles">
          <span
            className={selectedCategory === 1 ? "dashboard-nav-selected" : ""}
            onClick={() => {
              setSelectedCategory(1);
              setSortedArray([]);
              handleSortBasedOnRole(null);
            }}
          >
            All users
          </span>
          <span
            className={selectedCategory === 2 ? "dashboard-nav-selected" : ""}
            onClick={() => {
              setSelectedCategory(2);
              handleSortBasedOnRole("super_admin", "admin");
            }}
          >
            Administrator
          </span>
          <span
            className={selectedCategory === 3 ? "dashboard-nav-selected" : ""}
            onClick={() => {
              setSelectedCategory(3);
              handleSortBasedOnRole("manager");
            }}
          >
            Manager
          </span>
          <span
            className={selectedCategory === 4 ? "dashboard-nav-selected" : ""}
            onClick={() => {
              setSelectedCategory(4);
              handleSortBasedOnRole("employee");
            }}
          >
            Employee
          </span>
        </div>
      </div>

      <div className="overview-dashboard-bottom">
        <div className="overview-dashboard-bottom-left">
          <div className="overview-dashboard-table-header">
            <span>Name</span>
            <span>Status</span>
            <span>Role</span>
          </div>
          <div className="overview-dashboard-table-content">
            {userLoadingState ? (
              <div className="loading-div">
                <div className="spinner"></div>
              </div>
            ) : selectedCategory === 1 ? (
              users.map((user: OverviewData, index) => (
                <OverviewFile data={user} key={index} />
              ))
            ) : selectedCategory === 2 && sortedArray.length > 0 ? (
              sortedArray.map((user: OverviewData, index) => (
                <OverviewFile data={user} key={index} />
              ))
            ) : selectedCategory === 3 && sortedArray.length > 0 ? (
              sortedArray.map((user: OverviewData, index) => (
                <OverviewFile data={user} key={index} />
              ))
            ) : selectedCategory === 4 && sortedArray.length > 0 ? (
              sortedArray.map((user: OverviewData, index) => (
                <OverviewFile data={user} key={index} />
              ))
            ) : selectedCategory === 2 ? (
              <span className="decline-span">There are no administrators</span>
            ) : selectedCategory === 3 ? (
              <span className="decline-span">There are no managers</span>
            ) : selectedCategory === 4 ? (
              <span className="decline-span">There are no employees</span>
            ) : null}
          </div>
        </div>
        {
          user.role === "super_admin" &&
          <div className="overview-dashboard-bottom-right">
            <span className="recent-activities-text">Recent Activites</span>

            <div className="recent-activities">
              {logLoadingState ? (
                <div className="loading-div">
                  <div className="spinner"></div>
                </div>
              ) : (
                logs
                  .slice()
                  .reverse()
                  .map((activity, index) => {
                    return <RecentActivity {...activity} key={index} />;
                  })
              )}
            </div>

          </div>
        }

      </div>
    </div>
  );
};

export default OverviewDashboard;
