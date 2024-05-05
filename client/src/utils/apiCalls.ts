//importing axios
import axios from "axios";
import {
  // FileData,
  LoginCredentials,
  SignupCredentials,
} from "./types";

const url = "http://localhost:8000/api/v1";

//AUTH CALLS
const signupApiCall = async (
  { username, email, password, role }: SignupCredentials,
  token: string
) => {
  console.log("username", username);
  console.log("email", email);

  const response = await axios.post(
    `${url}/auth/register`,
    {
      username: username,
      password: password,
      email: email,
      role: role,
      is_active: true,
      is_admin: false,
    },
    {
      headers: {
        authorization: `authorization ${token}`,
      },
    }
  );

  return response;
};


const verifyUser = async (code: string) => {
  const response = await axios.post(
    `${url}/auth/verify`,
    {
      code
    });

  return response;
}
const loginApiCall = async ({ email, password }: LoginCredentials) => {
  const response = await axios.post(`${url}/auth/signin`, {
    email,
    password,
  });

  return response;
};

const getUsersCall = async () => {
  const response = await axios.get(`${url}/auth/users`);

  return response;
};

const getUserCall = async (userId: number) => {
  const response = await axios.get(`${url}/auth/user/${userId}`);

  return response;
};

export default {
  signupApiCall,
  loginApiCall,
  getUsersCall,
  getUserCall,
  verifyUser,
};
