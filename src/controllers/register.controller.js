import { pool } from '../db.js  ';
export const registerController = {
    registerdata: async(req, res) => async (req, res) => {
        const { id_usuarios } = req.params;
      
        const query = `
          SELECT 
            m.id_maquinas,
            m.nombre_maquina,
            r.nombre_referencia,
            ap.horas_asignadas
          FROM asignaciones_picado ap
          JOIN listado_maquinas m ON ap.id_maquinaAsignada = m.id_maquinas
          LEFT JOIN listado_referencias r ON ap.id_referenciaAsignada = r.id_referencia
          WHERE ap.id_usuarioAsignado = ?;
        `;
      
        try {
          const [rows] = await pool.query(query, [id_usuarios]);
          if (rows.length === 0) {
            return res.status(404).send('No se encontraron máquinas asignadas para este usuario.');
          }
          res.json(rows);
        } catch (error) {
          console.error('Error al obtener las máquinas asignadas:', error);
          res.status(500).send('Error al obtener las máquinas asignadas.');
        }
      }
    }