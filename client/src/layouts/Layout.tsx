import { Outlet } from "react-router-dom";
import "./layout.css";
import Sidebar from "../components/Sidebar/Sidebar";
import { useEffect, useState } from "react";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1130) {
        setIsSidebarOpen(true);
      }
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Call handleResize once on initial mount
    handleResize();

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="layout">
      <div className="header">{/* <h1>Header</h1> */}</div>
      <div className="content">
        <div
          className="layout-sidebar"
          style={isSidebarOpen ? { left: "0" } : { left: "-100%" }}
        >
          <Sidebar setIsSidebarOpen={setIsSidebarOpen} />
        </div>
        <div className="layout-outlet">
          <img
            src="/assets/menu-icon.svg"
            alt="Menu"
            className="layout-outlet-image"
            onClick={() => setIsSidebarOpen(true)}
          />
          <Outlet />
        </div>
      </div>
      <div className="footer">{/* <h1>Footer</h1> */}</div>
    </div>
  );
};

export default Layout;
