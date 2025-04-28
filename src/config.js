import { config } from "dotenv";

config();


export const PORT = process.env.PORT || 3000;

export const DB_HOST = process.env.DB_HOST || "localhost";

export const DB_USER = process.env.DB_USER || "root";

export const DB_PASSWORD = process.env.DB_PASSWORD || "Lpnn3a1970";

export const DB_DATABASE = process.env.DB_DATABASE || 'db_puntilas';

export const DB_PORT = process.env.DB_PORT || 3306

export const APP_URL = process.env.APP_URL || 'http://localhost';

//mysql -hviaduct.proxy.rlwy.net -u gypcaballo -p nEQKrkCfshUjBcfWnAffdykWKAmXydvI --port 35902 --protocol=TCP railway
/*
DB_HOST=  viaduct.proxy.rlwy.net   mysql.railway.internal
DB_USER=gypcaballo
DB_PASSWORD=  SpxvpTfFTORMMfKaWrTTFHaARWWkzUqP
DB_PORT=35902   3306
DB_NAME=railway
DB_PROTOCOL=TCP
MYSQLUSER
*/