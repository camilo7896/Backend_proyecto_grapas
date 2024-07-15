import { pool } from "../db.js";
export const asignamentsController = {
    // Obtener todas las asignaciones
    getAsignaciones: async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM asignaciones_picado');
            res.send(rows);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al obtener las asignaciones');
        }
    },

    // Obtener asignaciones por usuario
    getAsignacionesByUser: async (req, res) => {
        const { id_usuarioAsignado } = req.params;
        try {
            const [rows] = await pool.query('SELECT * FROM asignaciones_picado WHERE id_usuarioAsignado = ?', [id_usuarioAsignado]);
            if (rows.length >0) {
                res.send(rows[0]);
            }else {
            res.status(404).send('Asignacion no encontrada');
            }
        } catch (error) {
        console.error(error);
        }
    },

    // Crear una nueva asignación
    createAsignacion: async (req, res) => {
        const { id_usuarioAsignado, id_maquinaAsignada, id_referenciaAsignada } = req.body;
        try {
            const [result] = await pool.query('INSERT INTO asignaciones_picado (id_usuarioAsignado, id_maquinaAsignada, id_referenciaAsignada) VALUES (?, ?, ?)', [id_usuarioAsignado, id_maquinaAsignada, id_referenciaAsignada]);
            res.send({
                id: result.insertId,
                id_usuarioAsignado,
                id_maquinaAsignada,
                id_referenciaAsignada,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al crear la asignación');
        }
    },

    // Actualizar una asignación
    updateAsignacion: async (req, res) => {
        const { id } = req.params;
        const { id_usuarioAsignado, id_maquinaAsignada, id_referenciaAsignada } = req.body;
        try {
            const [result] = await pool.query(
                'UPDATE asignaciones_picado SET id_usuarioAsignado = ?, id_maquinaAsignada = ?, id_referenciaAsignada= ? WHERE id = ?',
                [id_usuarioAsignado, id_maquinaAsignada, id_referenciaAsignada,id]
            );
    
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'No se ha encontrado maquina' }); 
            }
    
            const [rows] = await pool.query('SELECT * FROM asignaciones_picado WHERE id_usuarioAsignado = ?', [id_usuarioAsignado]);
    
            res.json(rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Eliminar una asignación
    deleteAsignacion: async (req, res) => {
        const { id } = req.params;
        try {
            const [result] = await pool.query('DELETE FROM asignaciones_picado WHERE id = ?', [id]);
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Asignación no encontrada' });
            }
            res.send({ message: 'Asignación eliminada correctamente' });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al eliminar la asignación');
        }
    },
};
