import axios from "axios";
import { PermissionDetails } from "../utils/types";

const url = "http://localhost:8000/api/v1";

const createPermission = async (
  { user_id, can_read, can_write, can_delete }: PermissionDetails,
  token: string
) => {
  const response = await axios.post(
    `${url}/permission/`,
    {
      user_id,
      can_read,
      can_write,
      can_delete,
    },
    {
      headers: {
        authorization: `authorization ${token} `,
      },
    }
  );
  // Handle the response from the server (optional)
  return response;
};

const updatePermission = async (
  {
    user_id,
    can_read,
    can_write,
    can_delete,
    is_active,
    role,
  }: PermissionDetails,
  token: string
) => {
  const response = await axios.put(
    `${url}/permission/${user_id}`,
    {
      can_read,
      can_write,
      can_delete,
      is_active,
      role,
    },
    {
      headers: {
        authorization: `authorization ${token} `,
      },
    }
  );
  // Handle the response from the server (optional)
  return response;
};

export default { createPermission, updatePermission };
