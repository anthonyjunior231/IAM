import axios from "axios";
import { FileDetails } from "../utils/types";

const url = "http://localhost:8000/api/v1";

//FILE CALLS
const createFileCall = async (
  { file_name, file_size, folder_id, description, file, permission_type }: any,
  token: string
) => {
  console.log("woeeking in the api service");
  const formData = new FormData();
  formData.append("file", file);
  formData.append("file_name", file_name);
  formData.append("file_size", String(file_size)); // Convert file_size to string
  formData.append("folder_id", String(folder_id));
  formData.append("permission_type", String(permission_type));

  formData.append("description", String(description));

  const response = await axios.post(`${url}/file/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data", // Set the content type to multipart/form-data
      authorization: `authorization ${token}`,
    },
  });

  return response;
};

const getAllFilesCall = async (token: string) => {
  const response = await axios.get(`${url}/file/`, {
    headers: {
      authorization: `authorization ${token}`,
    },
  });

  return response;
};

const getFileCall = async (id: any, token: string) => {
  const response = await axios.get(`${url}/file/${id}`, {
    headers: {
      authorization: `authorization ${token}`,
    },
  });

  return response;
};

const updateFileCall = async (
  file_name: string,
  id: number,
  token: string,
  file: File
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("file_name", file_name);

  const response = await axios.put(
    `${url}/file/${id}`,
    formData, // Pass formData directly as the data parameter
    {
      headers: {
        "Content-Type": "multipart/form-data", // Corrected content type
        authorization: `authorization ${token}`,
      },
    }
  );

  return response;
};

const deleteFileCall = async (id: number, token: string) => {
  const response = await axios.delete(`${url}/file/${id}`, {
    headers: {
      authorization: `authorization ${token}`,
    },
  });

  return response;
};

//FILE ACCESS CALLS
const createFileAccessCall = async (
  fileDetails: FileDetails,
  token: string
) => {
  const response = await axios.post(
    `${url}/file/access/`,
    {
      fileDetails,
    },
    {
      headers: {
        authorization: `authorization ${token}`,
      },
    }
  );

  return response;
};

const getFileAccessByFileIDCall = async (fileId: number, token: string) => {
  const response = await axios.get(`${url}/file/access/file/${fileId}`, {
    headers: {
      authorization: `authorization ${token}`,
    },
  });

  return response;
};

const getFileAccessByIDCall = async (id: number, token: string) => {
  const response = await axios.get(`${url}/file/access/${id}`, {
    headers: {
      authorization: `authorization ${token}`,
    },
  });

  return response;
};

const updateFileAccessCall = async (
  id: number,
  fileDetails: FileDetails,
  token: string
) => {
  const response = await axios.post(
    `${url}/file/access/${id}`,
    fileDetails, // Pass fileDetails as the request body
    {
      headers: {
        authorization: `authorization ${token}`,
      },
    }
  );

  return response;
};

const deleteFileAccessCall = async (id: number, token: string) => {
  const response = await axios.post(`${url}/file/access/${id}`, {
    headers: {
      authorization: `authorization ${token}`,
    },
  });

  return response;
};

const createAccessRequestCall = async (
  fileId: number,
  reason: string,
  token: string
) => {
  const response = await axios.post(
    `${url}/access/request/`,
    {
      reason,
      file_id: fileId,
    }, // Pass fileDetails as the request body
    {
      headers: {
        authorization: `authorization ${token}`,
      },
    }
  );

  return response;
};

export default {
  createFileCall,
  getAllFilesCall,
  getFileCall,
  updateFileCall,
  deleteFileCall,

  //FILE ACCESS CALLS
  createFileAccessCall,
  getFileAccessByFileIDCall,
  getFileAccessByIDCall,
  updateFileAccessCall,
  deleteFileAccessCall,

  //ACCESS REQUEST
  createAccessRequestCall,
};
