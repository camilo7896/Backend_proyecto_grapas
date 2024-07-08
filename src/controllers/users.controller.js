import { pool } from '../db.js  ';
export const userController = {
    getUsers: async(req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM usuarios');
            res.send(rows);
        } catch (error) {
            console.error(error);
        }
    },

    getUser:async(req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM usuarios WHERE id_usuarios = ?', [req.params.id]);
            if (rows.length >0) {
                res.send(rows[0]);
            }else {
            res.status(404).send('Empleado no encontrado');
            }
        } catch (error) {
        console.error(error);
        }
    },

    createUser: async (req, res) => {
        const { id_usuarios, nombres, usuario } = req.body;
        const [result] = await pool.query('INSERT INTO usuarios (id_usuarios, nombres,usuario) VALUES (?,?,?)', [id_usuarios, nombres, usuario])
        res.send({ 
            id: result.insertId,
            nombres,
            usuario
         });
    },

    updateUser: async (req, res) => {
        const { id_usuarios } = req.params; // Obtener id_usuarios desde los parámetros de la URL
        const { nombres, usuario } = req.body;
    
        try {
            const [result] = await pool.query(
                'UPDATE usuarios SET nombres = ?, usuario = ? WHERE id_usuarios = ?',
                [nombres, usuario, id_usuarios]
            );
    
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado' }); 
            }
    
            const [rows] = await pool.query('SELECT * FROM usuarios WHERE id_usuarios = ?', [id_usuarios]);
    
            res.json(rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    

    deleteUser: async(req, res) => {
        const { id_usuarios } = req.params;

        try {
            const [result] = await pool.query('DELETE FROM usuarios WHERE id_usuarios = ?', [id_usuarios]);
    
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
    
            res.json({ message: 'Usuario eliminado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    }

