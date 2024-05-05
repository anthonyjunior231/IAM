import { Pool } from "pg";
import { Folder } from "../models/Folder";
import pool from "../db/connect";

const createFolder = async (folder: Folder): Promise<void> => {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO folders (name, description)
      VALUES ($1, $2)
    `;
    const values: any[] = [folder.name, folder.description];
    await client.query(query, values);
  } finally {
    client.release();
  }
};

const getFolderById = async (id: number) => {
  const client = await pool.connect();
  try {
    const query = `
      SELECT 
  folders.id as folder_id,
  folders.name,
  json_agg(json_build_object(
    'file_id', files.id, 
    'file_name', files.file_name, 
    'access_type', files.access_type,
    'user_id', files.user_id,
    'owner_username', users.username,
    'file_size', files.file_size
  )) as files
FROM 
  folders
LEFT JOIN 
  files ON folders.id = files.folder_id
LEFT JOIN
  users ON files.user_id = users.id
WHERE 
  folders.id = $1
GROUP BY
  folders.id;
    `;
    const { rows } = await client.query(query, [id]);

    if (rows.length === 0) {
      return undefined; // Return undefined if no folder with the given ID is found
    }

    // Extract folder data and format the result
    const folderData = rows[0];
    const folder = {
      id: folderData.folder_id,
      name: folderData.name,
      files: folderData.files || [], // If there are no files, set it to an empty array
    };

    return folder;
  } finally {
    client.release();
  }
};

const getFolders = async () => {
  const client = await pool.connect();
  try {
    const query = `
     SELECT 
  folders.id as folder_id,
  folders.name,
  json_agg(json_build_object(
    'file_id', files.id, 
    'file_name', files.file_name, 
    'access_type', files.access_type,
    'owner_username', users.username,
    'file_size', files.file_size
  )) as files
FROM 
  folders
LEFT JOIN 
  files ON folders.id = files.folder_id
LEFT JOIN
  users ON files.user_id = users.id
GROUP BY
  folders.id;
    `;

    const { rows } = await client.query(query);

    // Map the result rows to Folder objects
    const folders = rows.map((row: any) => {
      return {
        id: row.folder_id,
        name: row.name,
        files: row.files || [], // If there are no files, set it to an empty array
      };
    });

    return folders;
  } finally {
    client.release();
  }
};

const updateFolder = async (id: number, folder: Folder): Promise<void> => {
  const client = await pool.connect();
  try {
    const query = `
      UPDATE folders
      SET name = $1, description = $2
      WHERE id = $3
    `;
    const values: any[] = [folder.name, folder.description, id];
    await client.query(query, values);
  } finally {
    client.release();
  }
};

const deleteFolderById = async (id: number): Promise<void> => {
  const client = await pool.connect();
  try {
    const query = "DELETE FROM folders WHERE id = $1";
    await client.query(query, [id]);
  } finally {
    client.release();
  }
};

export {
  createFolder,
  getFolderById,
  getFolders,
  updateFolder,
  deleteFolderById,
};
