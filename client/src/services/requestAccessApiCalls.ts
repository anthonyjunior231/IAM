import axios from "axios";

const url = "http://localhost:8000/api/v1";

const getAllAccessRequests = async (token: string) => {
  const response = await axios.get(`${url}/access/request`, {
    headers: {
      authorization: `authorization ${token}`,
    },
  });

  return response;
};

const getAllAccessRequest = async (id: number, token: string) => {
  const response = await axios.get(`${url}/access/request/${id}`, {
    headers: {
      authorization: `authorization ${token}`,
    },
  });

  return response;
};

const updateRequestAccess = async (
  id: number,
  file_id: number,
  user_id: number,
  status: boolean,
  reason: string,
  token: string
) => {
  const response = await axios.put(
    `${url}/access/request/${id}`,
    {
      file_id: file_id,
      user_id: user_id,
      status: status,
      reason: reason,
    },
    {
      headers: {
        authorization: `authorization ${token}`, // Assuming a Bearer token, adjust if different
      },
    }
  );

  // Process response here, e.g., return it or log it
  return response;
};

const getRequestAccessesByID = async (id: number, token: string) => {
  const response = await axios.get(`${url}/access/request/user/${id}`, {
    headers: {
      authorization: `authorization ${token}`,
    },
  });

  return response;
};

export default {
  getAllAccessRequests,
  updateRequestAccess,
  getAllAccessRequest,
  getRequestAccessesByID,
};
