import { pool } from '../db.js  ';
export const registerController = {
  getRegisters: async (req, res) => {
    try {
      const query = `
          SELECT 
              ap.id,
              u.id_usuarios,
              u.nombres AS nombre_usuario,
              m.maquina,
              r.nombre_referencia,
              ap.horas_asignadas
          FROM asignaciones_picado ap
          JOIN listado_usuarios u ON ap.id_usuarioAsignado = u.id_usuarios
          JOIN listado_maquinas m ON ap.id_maquinaAsignada = m.id_maquinas
          LEFT JOIN listado_referencias r ON ap.id_referenciaAsignada = r.id_referencia;
      `;
      const [rows] = await pool.query(query);
      res.send(rows);
  } catch (error) {
      console.error(error);
  }
  },
 
  getUserMachines: async (req, res) => {
    const { id_usuarioAsignado } = req.params;
    try {
      const [rows] = await pool.query('SELECT * FROM asignaciones_picado WHERE id_usuarioAsignado = ?', [id_usuarioAsignado]);
      res.json(rows);
    } catch (error) {
      console.error('Error fetching user machines:', error);
      res.status(500).send('Error fetching user machines');
    }
  },

      createRegisters:async(req, res)=>{  
        const { id_asignacion, horometro_inicial, horometro_final, observaciones,registro_maquina,id_usuarioRegistrador,registro_referencia,hora_asignadaRegistrador } = req.body;
        try {
          const [result] = await pool.query('INSERT INTO registro_horometros (id_asignacion, horometro_inicial, horometro_final, observaciones,registro_maquina,id_usuarioRegistrador,registro_referencia,hora_asignadaRegistrador) VALUES (?, ?, ?, ?,?,?,?,?)', [id_asignacion, horometro_inicial, horometro_final, observaciones, registro_maquina,id_usuarioRegistrador,registro_referencia,hora_asignadaRegistrador]);
          res.status(201).json({ id: result.insertId });
        } catch (error) {
          console.error('Error creating registro horometros:', error);
          res.status(500).send('Error creating registro horometros');
        }
      }
    }

    