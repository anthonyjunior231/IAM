import axios from "axios";

const url = "http://localhost:8000/api/v1";

const getAllLogs = async (token: string) => {
  const response = await axios.get(`${url}/log`, {
    headers: {
      Authorization: `authorzation ${token}`,
    },
  });

  return response;
};

const getUserLogs = async (id: number, token: string) => {
  const response = await axios.get(`${url}/log/user/${id}`, {
    headers: {
      authorization: `authorzation ${token}`,
    },
  });

  return response;
};

const getFileLogs = async (id: number, token: string) => {
  const response = await axios.get(`${url}/log/file/${id}`, {
    headers: {
      authorization: `authorzation ${token}`,
    },
  });

  return response;
};

export default { getAllLogs, getUserLogs, getFileLogs };
