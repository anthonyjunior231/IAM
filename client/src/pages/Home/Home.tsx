import Dashboard from "../../components/Dashboard/Dashboard";
// import Sidebar from "../../components/Sidebar/Sidebar";
import "./home.css";

const Home = () => {
  return (
    <div className="home">
      {/* <div className="home-sidebar">
        <Sidebar />
      </div> */}

      <div className="home-dashboard">
        <Dashboard />
      </div>
    </div>
  );
};

export default Home;
