// import { RootState } from "../redux/store";
import axios from "axios";
import { RootState } from "../redux/store";

const url = "http://localhost:8000/api/v1";

const getFoldersCall = async (token: string) => {
  // Assuming token is a simple string

  const response = await axios.get(`${url}/folder`, {
    headers: {
      Authorization: `authorization ${token}`, // Corrected header key and value format
    },
  });
  return response; // You might want to return response.data if only data is needed
};

const createFolderCall = async (
  name: string,
  description: string,
  getState: any
) => {
  const token = (getState() as RootState).auth.user.token;

  const response = await axios.post(
    `${url}/folder`,
    {
      name,
      description,
    },
    {
      headers: {
        authorization: `authorization ${token}`,
      },
    }
  );

  console.log(response, "response")

  return response;
};

const getFolderCall = async (id: number, token: string) => {
  const response = await axios.get(`${url}/folder/${id}`, {
    headers: {
      authorization: `authorization ${token}`,
    },
  });

  return response;
};

const updateFolderCall = async (
  id: number,
  name: string,
  description: string,
  token: string
) => {
  const response = await axios.put(
    `${url}/folder/${id}`,
    {
      name,
      description,
    },
    {
      headers: {
        authorization: `authorization ${token}`,
      },
    }
  );

  return response;
};

const deleteFolderCall = async (id: number, token: string) => {
  const response = await axios.delete(`${url}/folder,${id}`, {
    headers: {
      authorization: `authorization ${token}`,
    },
  });

  return response;
};

export default {
  getFoldersCall,
  createFolderCall,
  getFolderCall,
  updateFolderCall,
  deleteFolderCall,
};
