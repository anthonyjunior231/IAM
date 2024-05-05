import React from "react";
import "./editPermissionFile.css";

const EditPermissionFile = ({ state, setState, texts }: any) => {
  const [isTrue, setIsTrue] = React.useState(state);

  const handleToggle = () => {
    const newValue = !isTrue;
    setIsTrue(newValue);
    setState(newValue);
  };

  return (
    <div className="edit-permission-file">
      <div className="edit-permission-file-left">
        <img src="/assets/edit-file.png" alt="File" />
        <div>
          <span className="edit-permission-file-big-text">{texts[0]}</span>
          <span className="edit-permission-file-small-text">{texts[1]}</span>
        </div>
      </div>
      <div className="edit-permission-file-right">
        <div
          className="permission-input-slider"
          style={{
            backgroundColor: isTrue ? "#34c759" : "#F2F2F7",
          }}
          onClick={handleToggle}
        >
          <span
            className="permission-input-circle"
            style={{
              left: isTrue ? "75%" : "25%",
              color: isTrue ? "green" : "white",
            }}
          ></span>
        </div>
      </div>
    </div>
  );
};

export default EditPermissionFile;
