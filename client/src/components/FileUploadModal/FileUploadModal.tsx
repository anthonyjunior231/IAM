import { useState } from "react";
import "./fileUploadModal.css";
import { useNavigate } from "react-router-dom";

const FileUploadModal = ({ setIsLoading }: any) => {
  const [encryptionProcess, setEncryptionProcess] = useState<number>(100);
  const [awsIntro, setAwsIntro] = useState<number>(100);

  const navigate = useNavigate();
  
  return (
    <div className="file-upload-modal-container">
      <div className="file-upload-modal-inner">
        <div className="file-upload-modal-top">
          <span>Files Uploading</span>
        </div>

        <div className="file-upload-process">
          <div className="process-container">
            <div className="process">
              <span>Encryption Process</span>
              <div>
                <span>{encryptionProcess}%</span>
                {encryptionProcess === 100 && <span>Encrypted</span>}
              </div>
            </div>

            <div className="progress-bar">
              <div
                className="progress-bar-inner"
                style={{ width: `${encryptionProcess}%` }}
              ></div>
            </div>
          </div>
          <div className="process-container">
            <div className="process">
              <span>AWS Introduction</span>
              <div>
                <span>{awsIntro}%</span>
                {awsIntro !== 100 ? (
                  <button>Encrypt file</button>
                ) : (
                  <span>Encrypted</span>
                )}
              </div>
            </div>

            <div className="progress-bar">
              <div
                className="progress-bar-inner"
                style={{ width: `${awsIntro}%` }}
              ></div>
            </div>
          </div>
        </div>

        {awsIntro === 100 && encryptionProcess === 100 ? (
          <div className="file-uplaod-modal-button-container">
            <button
              className="cancel-button"
              onClick={() => setIsLoading(false)}
            >
              Cancel
            </button>
            <button
              className="upload-button"
              onClick={() => setIsLoading(true)}
            >
              Store to cloud
            </button>
          </div>
        ) : (
          <div
            className="file-upload-modal-button"
            onClick={() => setIsLoading(false)}
          >
            Cancel
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadModal;
