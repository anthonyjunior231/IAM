import "./App.css";

import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import Layout from "./layouts/Layout";
import Home from "./pages/Home/Home";
import Permissions from "./pages/Permissions/Permissions";
import Overview from "./pages/Overview/Overview";
import EditPermissions from "./pages/EditPermissions/EditPermissions";
import ManageAccess from "./pages/ManageAccess/ManageAccess";
import UploadFiles from "./pages/UploadFiles/UploadFiles";
import Signup from "./pages/Signup/Signup";
import WithAuth from "./HOCs/WithAuth";
import { ToastContainer } from "react-toastify";
// import CategoryDashboard from "./pages/CategoryDashboard/CategoryDashboard";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
// import CreateCategoryPage from "./pages/CreateCategoryPage/CreateCategoryPage";
import FolderPage from "./pages/FolderPage/FolderPage";
import AddFolderPage from "./pages/AddFolderPage/AddFolderPage";
import FilesPage from "./pages/FIlesPage/FilesPage";
import AddUserPage from "./pages/AddUserPage/AddUserPage";

import SuperAdminOnly from "./HOCs/SuperAdminOnly";
import ManagerOrAdminOnly from "./HOCs/ManagerOrAdminOnly";
import RequestAccessPage from "./pages/RequestAccessPage/RequestAccessPage";
import VerificationPage from "./pages/VerificationPage/VerificationPage";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";

const App = () => {
  //secure routes usingg HOCs
  const SecureAuth = WithAuth(Layout);
  const SecureEditPermissions = WithAuth(EditPermissions);
  const SecureNotFoundPage = WithAuth(PageNotFound);
  const SecureRequestAccessPage = WithAuth(RequestAccessPage);

  const SecureAddUserPage = SuperAdminOnly(AddUserPage);

  //protected routes for admin, super_admins and managers only

  const SecureAddFolderPage = ManagerOrAdminOnly(AddFolderPage);
  const SecureAddFilePage = ManagerOrAdminOnly(UploadFiles);

  const hasToVerify = useSelector((state: RootState) => state.auth.hasToVerify);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<SecureAuth />}>
          <Route index path="/" element={<Home />} />
          <Route path="/permissions" element={<Permissions />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/manage-access/" element={<ManageAccess />} />
          <Route path="/file-upload" element={<SecureAddFilePage />} />

          {/* folder routes */}
          <Route path="/folder" element={<FolderPage />} />
          <Route path="/folder/add" element={<SecureAddFolderPage />} />

          {/* file routes */}
          <Route path="/file/:id" element={<FilesPage />} />

          {/* add user route */}
          <Route path="/add-user" element={<SecureAddUserPage />} />

          {/* request permission route */}
          <Route
            path="/request-access/:id"
            element={<SecureRequestAccessPage />}
          />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route
          path="/edit-permissions/:id"
          element={<SecureEditPermissions />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/verify"
          element={hasToVerify ? <VerificationPage /> : <Navigate to="/" />}
        />
        <Route path="*" element={<SecureNotFoundPage />} />
      </Routes>
    </>
  );
};

export default App;
