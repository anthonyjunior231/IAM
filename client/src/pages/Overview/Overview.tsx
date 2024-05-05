import OverviewDashboard from "../../components/OverviewDashboard/OverviewDashboard";
// import Sidebar from "../../components/Sidebar/Sidebar";
import "./overview.css";

const Overview = () => {
  return (
    <div className="overview">
      {/* <div className="overview-sidebar">
        <Sidebar />
      </div> */}

      <div className="overview-board">
        <OverviewDashboard />
      </div>
    </div>
  );
};

export default Overview;
