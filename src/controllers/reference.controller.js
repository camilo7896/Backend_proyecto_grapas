import { pool } from "../db.js";
export const referenceController={
    getReferences: async(req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM listado_referencias');
            res.send(rows);
        } catch (error) {
            console.error(error);
        }
    },
    getReference:async(req, res) => {
        const id = req.params.id;
        try {
            const [rows] = await pool.query('SELECT * FROM listado_referencias WHERE id_referencia = ?', [id]);
            if (rows.length >0) {
                res.send(rows[0]);
            }else {
            res.status(404).send('No se ha encontrado referencia');
            }
        } catch (error) {
        console.error(error);
        }
    },
    createreference:  async (req, res) => {
        const { id_referencia,nombre_referencia, codigo_referencia} = req.body;
        const [result] = await pool.query('INSERT INTO listado_referencias ( id_referencia,nombre_referencia, codigo_referencia) VALUES (?,?,?)', [ id_referencia,nombre_referencia, codigo_referencia])
        res.send({ 
            id: result.insertId,
            nombre_referencia,
            codigo_referencia,
         });
    },

    updateReference: async (req, res) => {
        const { id_referencia } = req.params; // Obtener id_usuarios desde los parámetros de la URL
        const { codigo_referencia, nombre_referencia } = req.body;
    
        try {
            const [result] = await pool.query(
                'UPDATE listado_referencias SET codigo_referencia = ?, nombre_referencia = ? WHERE id_referencia = ?',
                [codigo_referencia, nombre_referencia, id_referencia]
            );
    
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'No se encontro referencia' }); 
            }
    
            const [rows] = await pool.query('SELECT * FROM listado_referencias WHERE id_referencia = ?', [id_referencia]);
    
            res.json(rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    deleteRereference: async(req, res) => {
        const { id_referencia } = req.params;

        try {
            const [result] = await pool.query('DELETE FROM listado_referencias WHERE id_referencia = ?', [id_referencia]);
    
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Referencia no encontrada' });
            }
    
            res.json({ message: 'Referencia eliminada exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },


}