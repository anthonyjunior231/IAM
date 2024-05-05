import "./folder.css";
import { useRef, useState } from "react";
import { FolderType } from "../../utils/types";
import { useNavigate } from "react-router-dom";
import { countNonNullValues } from "../../utils/helpers";

const Folder = (folder: FolderType) => {
  const { name, id, files, fileSize } = folder;

  let len;
  console.log(files, "files")


  if (files && files.length > 0) {
    console.log(files);
    if(files[0].file_id === null){
      len = 0;
    } else {
      len = countNonNullValues(files);
    }
  }

  const folderRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const onHandleClick = () => {
    navigate(`/file/${id}`);
  };

  const navigate = useNavigate();
  console.log(files, "file")
  return (
    <div
      className="folder"
      ref={folderRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onHandleClick}
    >
      <div className="folder-top">
        <img
          src={`/assets/folder-${isHovered ? "light.png" : "dark.png"}`}
          alt="folder"
          className="folder-file-img"
        />
        <img
          src={`/assets/options-${isHovered ? "light.png" : "dark.png"}`}
          alt="options"
          className="folder-options"
        />
      </div>
      <div className="folder-middle">{name}</div>
      <div className="folder-bottom">
        <span> {len} file(s)</span>
        { fileSize !== undefined &&
          <span>{fileSize}</span>
          }
      </div>
    </div>
  );
};

export default Folder;
