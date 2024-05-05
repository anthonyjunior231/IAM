import { useEffect, useState } from "react";
import "./permissionsDashboard.css";

import PermissionFile from "../PermissionsFile/PermissionsFile";

import { PermissionsDataType } from "../../utils/types";
import { Link } from "react-router-dom";
import apiCalls from "../../utils/apiCalls";

//import from react-toastify
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS for styling
import { AppDispatch, RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { removeUserToBeEdited } from "../../redux/slices/authSlice";

const PermissionsDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState(1);

  const [users, setUsers] = useState<any[]>([]);

  //loading state
  const [userLoadingState, setUserLoadingState] = useState<boolean>(true);

  //get user role
  const userRole = useSelector((state: RootState) => state.auth.user.role);

  const [sortedArray, setSortedArray] = useState<PermissionsDataType[]>([]);

  const handleSortBasedOnRole = (category: string | null) => {
    const filteredArray = users.filter((data: PermissionsDataType) => {
      return data.role === category;
    });

    setSortedArray(filteredArray);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [searchedUsers, setSearchedUsers] = useState<any[]>([]);
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

  const dispatch = useDispatch<AppDispatch>();

  //call the fecth functions when the oage loads
  useEffect(() => {
    fetchUsers();
    dispatch(removeUserToBeEdited());
  }, []);

  const handleSearch = (searchString: string, arr: any[]): void => {
    // Convert the search string to lowercase for case-insensitive matching.
    const searchStringLower = searchString.toLowerCase();

    // Filter the array to find entries where `file_name` contains the search string.
    // This is done in a case-insensitive manner to ensure user input can match files
    // regardless of how the file names are cased.
    const searchResults = arr.filter((obj) => {
      console.log(obj);
      // Convert `file_name` to lowercase for case-insensitive matching.
      const nameLower = obj.username.toLowerCase();

      // Check if the lowercase `file_name` includes the lowercase search string.
      // This will allow partial matches such as 'n' or 'nf' to find 'nfhg'.
      return nameLower.includes(searchStringLower);
    });

    setSearchedUsers(searchResults);
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      handleSearch(searchQuery, users);
      console.log(searchedUsers);
    }
  }, [searchQuery]);

  return (
    <div className="permissions-dashboard">
      <span className="users-access-text">User's access and permission</span>

      <div className="permissions-dashboard-top">
        <div className="permissions-dashboaord-top-left">
          <span
            className={selectedCategory === 1 ? "dashboard-nav-selected" : ""}
            onClick={() => {
              setSelectedCategory(1);
              setSortedArray([]);
            }}
          >
            All users
          </span>
          <span
            className={selectedCategory === 2 ? "dashboard-nav-selected" : ""}
            onClick={() => {
              setSelectedCategory(2);
              handleSortBasedOnRole("super_admin");
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

        <div className="permissions-dashboard-top-right">
          <div className="permissions-input-cont">
            <img src="/assets/search.png" alt="Search" />
            <input
              type="text"
              placeholder="Search"
              onChange={(e: any) => setSearchQuery(e.target.value)}
            />
          </div>

          {userRole === "super_admin" && (
            <Link to="/add-user" className="permissions-add-new-button">
              <span>Add new user</span>
              <img src="/assets/user-add.png" alt="" />
            </Link>
          )}
        </div>
      </div>

      <div className="permissions-dashboard-bottom">
        <div
          className="permissions-dashboard-table-header"
          style={
            userRole === "super_admin"
              ? {
                  gridTemplateColumns:
                    " minmax(300px, 6fr) minmax(200px, 3fr) minmax(100px, 3fr) minmax(15px, 0.5fr)",
                }
              : {
                  gridTemplateColumns:
                    "minmax(300px, 6fr) minmax(200px, 3fr) minmax(150px, 3fr)",
                }
          }
        >
          <span>Name</span>
          <span>Role assigned</span>
          <span>Status</span>
          {userRole === "super_admin" && <div>&nbsp; </div>}
        </div>

        <div className="permissions-dashboard-table-content">
          {searchQuery.length > 0 ? (
            searchedUsers.map((file, index) => {
              return <PermissionFile data={file} key={index} />;
            })
          ) : userLoadingState ? (
            <div className="loading-div">
              <div className="spinner"></div>
            </div>
          ) : selectedCategory === 1 ? (
            users.map((file: PermissionsDataType, index) => (
              <PermissionFile data={file} key={index} />
            ))
          ) : selectedCategory === 2 && sortedArray.length > 0 ? (
            sortedArray.map((file: PermissionsDataType, index) => (
              <PermissionFile data={file} key={index} />
            ))
          ) : selectedCategory === 3 && sortedArray.length > 0 ? (
            sortedArray.map((file: PermissionsDataType, index) => (
              <PermissionFile data={file} key={index} />
            ))
          ) : selectedCategory === 4 && sortedArray.length > 0 ? (
            sortedArray.map((file: PermissionsDataType, index) => (
              <PermissionFile data={file} key={index} />
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
    </div>
  );
};

export default PermissionsDashboard;
