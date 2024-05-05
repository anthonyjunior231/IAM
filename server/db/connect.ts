import {Pool} from 'pg';
import {DBConfig} from "../config/config"

const pool = new Pool({
  user: DBConfig.DB_USER,
  host: DBConfig.DB_HOST,
  database: DBConfig.DB_NAME,
  password: DBConfig.DB_PASSWORD,
  port: DBConfig.DB_PORT,
});

export default pool;
