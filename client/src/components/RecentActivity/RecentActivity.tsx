import { calculateTimePassed } from "../../utils/helpers";
import { LogDetail } from "../../utils/types";
import "./recentActivity.css";

const RecentActivity = (logs: LogDetail) => {
  return (
    <div className="recent-activity">
      <div className="recent-activity-middle">{`${
        logs.username.charAt(0).toUpperCase() +
        logs.username.slice(1).toLowerCase()
      } ${logs.action_taken.toLowerCase()}`}</div>
      <div className="recent-activity-right">
        {calculateTimePassed(logs.created_at)}
      </div>
    </div>
  );
};

export default RecentActivity;
