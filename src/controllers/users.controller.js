import bcrypt from 'bcrypt';

import { pool } from '../db.js  ';
export const userController = {
    getUsers: async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM listado_usuarios');
            res.send(rows);
        } catch (error) {
            console.error(error);
        }
    },

    getUser: async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM listado_usuarios WHERE id_usuarios = ?', [req.params.id]);
            if (rows.length > 0) {
                res.send(rows[0]);
            } else {
                res.status(404).send('Empleado no encontrado');
            }
        } catch (error) {
            console.error(error);
        }
    },

    createUser: async (req, res) => {
        const { id_usuarios, nombres, apellidos, usuario, password, rol } = req.body;

        try {
            // Verifica que todos los campos necesarios están presentes
            if (!id_usuarios || !nombres || !apellidos || !usuario || !password || !rol) {
                return res.status(400).send('Faltan campos requeridos');
            }

            // Cifrar la contraseña antes de guardarla
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Insertar el nuevo usuario con la contraseña cifrada
            const [result] = await pool.query(
                'INSERT INTO listado_usuarios (id_usuarios, nombres, apellidos, usuario, password, rol) VALUES (?, ?, ?, ?, ?, ?)',
                [id_usuarios, nombres, apellidos, usuario, hashedPassword, rol]
            );

            res.status(201).send({
                id: result.insertId,
                nombres,
                apellidos,
                usuario,
                hashedPassword,
                rol
            });
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            res.status(500).send('Hubo un error al crear el usuario');
        }
    },
    updateUser: async (req, res) => {
        const saltRounds = 10;
        const { id_usuarios } = req.params; // Obtener id_usuarios desde los parámetros de la URL
        const { nombres, usuario, password, rol } = req.body;

        try {
            let updateFields = [];
            let values = [];

            // Construir la consulta de actualización dinámicamente
            if (nombres) {
                updateFields.push('nombres = ?');
                values.push(nombres);
            }
            if (usuario) {
                updateFields.push('usuario = ?');
                values.push(usuario);
            }
            if (password) {
                // Si se proporciona una nueva contraseña, cifrarla
                const hashedPassword = await bcrypt.hash(password, saltRounds);
                updateFields.push('password = ?');
                values.push(hashedPassword);
            }
            if (rol) {
                // Si se proporciona un nuevo rol, añadirlo a la consulta
                updateFields.push('rol = ?');
                values.push(rol);
            }

            if (updateFields.length === 0) {
                return res.status(400).json({ message: 'No hay campos para actualizar' });
            }

            // Añadir el id_usuarios a los valores
            values.push(id_usuarios);

            // Construir la consulta SQL
            const query = `UPDATE listado_usuarios SET ${updateFields.join(', ')} WHERE id_usuarios = ?`;

            const [result] = await pool.query(query, values);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            // Obtener los datos actualizados del usuario
            const [rows] = await pool.query('SELECT * FROM listado_usuarios WHERE id_usuarios = ?', [id_usuarios]);

            res.json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },


    deleteUser: async (req, res) => {
        const { id_usuarios } = req.params;

        try {
            const [result] = await pool.query('DELETE FROM listado_usuarios WHERE id_usuarios = ?', [id_usuarios]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            res.json({ message: 'Usuario eliminado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}