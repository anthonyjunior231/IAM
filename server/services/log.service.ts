import { Pool } from "pg";
import { Log } from "../models/Log";
import pool from "../db/connect";

const createLog = async (log: Log): Promise<void> => {
  console.log("this function is working");
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO logs (user_id, action_taken, file_id)
      VALUES ($1, $2, $3)
    `;
    const values: any[] = [log.user_id, log.action_taken, log.file_id];
    await client.query(query, values);
  } finally {
    client.release();
  }
};

const getAllLogs = async (): Promise<Log[]> => {
  const client = await pool.connect();
  try {
    const query = `
      SELECT 
        logs.*, 
        users.username 
      FROM 
        logs
      LEFT JOIN 
        users ON logs.user_id = users.id;
    `;
    const { rows } = await client.query(query);
    return rows;
  } finally {
    client.release();
  }
};

const getLogsByUserId = async (userId: number): Promise<Log[]> => {
  const client = await pool.connect();
  try {
    const query = `
      SELECT 
        logs.*, 
        users.username 
      FROM 
        logs
      WHERE user_id = $1
      LEFT JOIN 
        users ON logs.user_id = users.id;
    `;
    const { rows } = await client.query(query, [userId]);
    return rows;
  } finally {
    client.release();
  }
};

const getLogsByFileId = async (fileId: number): Promise<Log[]> => {
  const client = await pool.connect();
  try {
    const query = "SELECT * FROM logs WHERE file_id = $1";
    const { rows } = await client.query(query, [fileId]);
    return rows;
  } finally {
    client.release();
  }
};

export { createLog, getAllLogs, getLogsByFileId, getLogsByUserId };
