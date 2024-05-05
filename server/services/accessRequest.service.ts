import { Pool } from "pg";
import { AccessRequest } from "../models/AccessRequest";
import pool from "../db/connect";

const createAccessRequest = async (
  accessRequest: AccessRequest
): Promise<void> => {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO access_request (file_id, user_id, status, reason)
      VALUES ($1, $2, $3, $4)
    `;
    const values: any[] = [
      accessRequest.file_id,
      accessRequest.user_id,
      accessRequest.status,
      accessRequest.reason,
    ];
    await client.query(query, values);
  } finally {
    client.release();
  }
};

const getAccessRequestById = async (
  id: number
): Promise<AccessRequest | undefined> => {
  const client = await pool.connect();
  try {
    const query = "SELECT * FROM access_request WHERE id = $1";
    const { rows } = await client.query(query, [id]);
    return rows[0];
  } finally {
    client.release();
  }
};
const getAccessRequestByUserFileId = async (
  user_id: number,
  file_id: number
): Promise<AccessRequest | undefined> => {
  const client = await pool.connect();
  try {
    const query =
      "SELECT * FROM access_request WHERE user_id = $1 AND file_id = $2";
    const { rows } = await client.query(query, [user_id, file_id]);
    return rows[0];
  } finally {
    client.release();
  }
};
const getAccessRequestByUserId = async (
  user_id: number
): Promise<AccessRequest[] | undefined> => {
  const client = await pool.connect();
  try {
    const query = "SELECT * FROM access_request WHERE user_id = $1";
    const { rows } = await client.query(query, [user_id]);
    return rows;
  } finally {
    client.release();
  }
};

const getAccessRequests = async (): Promise<AccessRequest[] | undefined> => {
  const client = await pool.connect();
  try {
    const query = "SELECT * FROM access_request";
    const { rows } = await client.query(query);
    return rows;
  } finally {
    client.release();
  }
};

const updateAccessRequest = async (
  id: number,
  accessRequest: AccessRequest
): Promise<void> => {
  const client = await pool.connect();
  try {
    const query = `
      UPDATE access_request
      SET file_id = $1, user_id = $2, status = $3, reason = $4
      WHERE id = $5
    `;
    const values: any[] = [
      accessRequest.file_id,
      accessRequest.user_id,
      accessRequest.status,
      accessRequest.reason,
      id,
    ];
    await client.query(query, values);
  } finally {
    client.release();
  }
};

const deleteAccessRequestById = async (id: number): Promise<void> => {
  const client = await pool.connect();
  try {
    const query = "DELETE FROM access_request WHERE id = $1";
    await client.query(query, [id]);
  } finally {
    client.release();
  }
};

export {
  createAccessRequest,
  getAccessRequestById,
  getAccessRequestByUserId,
  getAccessRequestByUserFileId,
  getAccessRequests,
  updateAccessRequest,
  deleteAccessRequestById,
};
