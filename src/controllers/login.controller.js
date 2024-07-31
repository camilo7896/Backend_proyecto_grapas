import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

export const userLoginController = {
    authLogin: async (req, res) => {   
        try {
            const { username, password } = req.body;

            // Busca el usuario en la base de datos por nombre de usuario
            const [rows] = await pool.query('SELECT * FROM listado_usuarios WHERE usuario = ?', [username]);

            if (rows.length === 0) {
                return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
            }

            const user = rows[0];

            // Compara la contraseña proporcionada con la almacenada en la base de datos
            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
            }

            // Genera un token JWT
            const token = jwt.sign({ id: user.id, role: user.rol }, SECRET_KEY, { expiresIn: '1h' });

            res.json({
                message: 'Autenticación exitosa',
                token,
                role: user.rol
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Hubo un error en la autenticación' });
        }
    }
};
