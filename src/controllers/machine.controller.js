import { pool } from "../db.js";
export const machineController={
    getMachines: async(req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM listado_maquinas');
            res.send(rows);
        } catch (error) {
            console.error(error);
        }
    },
    getMachine:async(req, res) => {
        const id = req.params.id;
        try {
            const [rows] = await pool.query('SELECT * FROM listado_maquinas WHERE id_maquinas = ?', [id]);
            if (rows.length >0) {
                res.send(rows[0]);
            }else {
            res.status(404).send('Maquina no encontrada');
            }
        } catch (error) {
        console.error(error);
        }
    },
    createMachine:  async (req, res) => {
        const { id_maquinas,maquina, nombre_maquina, capacidad } = req.body;
        const [result] = await pool.query('INSERT INTO listado_maquinas ( id_maquinas,maquina, nombre_maquina, capacidad) VALUES (?,?,?,?)', [ id_maquinas,maquina, nombre_maquina, capacidad])
        res.send({ 
            id: result.insertId,
            maquina,
            nombre_maquina,
            capacidad
         });
    },

    updateMachine: async (req, res) => {
        const { id_maquinas } = req.params; // Obtener id_usuarios desde los parámetros de la URL
        const { capacidad, nombre_maquina } = req.body;
    
        try {
            const [result] = await pool.query(
                'UPDATE maquinas SET capacidad = ?, nombre_maquina = ? WHERE id_maquinas = ?',
                [capacidad, nombre_maquina, id_maquinas]
            );
    
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'No se ha encontrado maquina' }); 
            }
    
            const [rows] = await pool.query('SELECT * FROM listado_maquinas WHERE id_maquinas = ?', [id_maquinas]);
    
            res.json(rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    deleteMachine: async (req, res) => {
        const { id_maquinas } = req.params;

        try {
            const [result] = await pool.query('DELETE FROM listado_maquinas WHERE id_maquinas = ?', [id_maquinas]);
    
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'No se ha encontrado maquina' });
            }
    
            res.json({ message: 'Maquina eliminada exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },


}