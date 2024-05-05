import { Pool } from "pg";
import { File } from "../models/File";
import pool from "../db/connect";

const createFile = async (file: File): Promise<void> => {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO files (user_id, folder_id, file_name, file_size, access_type, description, cloud_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    const values: any[] = [
      file.user_id,
      file.folder_id,
      file.file_name,
      file.file_size,
      file.access_type,
      file.description,
      file.cloud_url,
    ];
    const result = await client.query(query, values);
  } finally {
    client.release();
  }
};

const getAllFiles = async (): Promise<File[]> => {
  const client = await pool.connect();
  try {
    const query = `
      SELECT 
        files.*, 
        folders.name AS folder_name, 
        
        users.username AS owner_username 
      FROM files 
      LEFT JOIN folders ON files.folder_id = folders.id 
      
      LEFT JOIN users ON files.user_id = users.id
    `;
    const { rows } = await client.query(query);
    return rows;
  } finally {
    client.release();
  }
};

const getFileById = async (id: number): Promise<File | undefined> => {
  const client = await pool.connect();
  try {
    const query = "SELECT * FROM files WHERE id = $1";
    const { rows } = await client.query(query, [id]);
    return rows[0];
  } finally {
    client.release();
  }
};

const updateFile = async (id: number, file: File): Promise<void> => {
  const client = await pool.connect();
  try {
    const query = `
      UPDATE files
      SET user_id = $1, folder_id = $2, file_name = $3, file_size = $4, access_type=$5, description = $6, cloud_url = $7
      WHERE id = $8
    `;
    const values: any[] = [
      file.user_id,
      file.folder_id,
      file.file_name,
      file.file_size,
      file.access_type,
      file.description,
      file.cloud_url,
      id,
    ];
    await client.query(query, values);
  } finally {
    client.release();
  }
};

const deleteFileById = async (id: number): Promise<void> => {
  const client = await pool.connect();
  try {
    const query = "DELETE FROM files WHERE id = $1";
    await client.query(query, [id]);
  } finally {
    client.release();
  }
};

export { createFile, getFileById, getAllFiles, updateFile, deleteFileById };
