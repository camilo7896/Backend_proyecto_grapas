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
              ap.horas_asignadas,
              id_standar
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

    createRegisters: async (req, res) => {
        const registros = req.body;

        // Verificar si `registros` es un array
        if (!Array.isArray(registros)) {
            return res.status(400).send('Se esperaba un array de registros');
        }

        // Verificar que cada registro tenga los campos necesarios
        for (const registro of registros) {
            if (!registro.id_asignacion || registro.horometro_inicial === undefined || registro.horometro_final === undefined || !registro.registro_maquina || !registro.id_usuarioRegistrador || !registro.registro_referencia || !registro.hora_asignadaRegistrador || !registro.observaciones || !registro.registro_standard ) {
                return res.status(400).send('Faltan datos requeridos en uno o más registros');
            }
        }

        try {
            const queries = registros.map(registro =>
                pool.query('INSERT INTO registro_horometros (id_asignacion, horometro_inicial, horometro_final, registro_maquina, id_usuarioRegistrador, registro_referencia, hora_asignadaRegistrador,observaciones,registro_standard) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
                    registro.id_asignacion,
                    registro.horometro_inicial || 0,
                    registro.horometro_final || 0,
                    registro.registro_maquina,
                    registro.id_usuarioRegistrador,
                    registro.registro_referencia,
                    registro.hora_asignadaRegistrador,
                    registro.observaciones || '',
                    registro.registro_standard || '',
                ])
            );

            await Promise.all(queries);

            res.status(201).send('Registros creados exitosamente');
        } catch (error) {
            console.error('Error creando registros de horómetros:', error);
            res.status(500).send(`Error creando registros de horómetros: ${error.message}`);
        }
    },

    // Nueva función para obtener registros de horómetros
  getHorometroRecords: async (req, res) => {
    try {
      const query = `
          SELECT 
              id_asignacion,
              horometro_inicial,
              horometro_final,
              observaciones,
              registro_maquina,
              id_usuarioRegistrador,
              registro_referencia,
              hora_asignadaRegistrador,
              registro_standard
          FROM registro_horometros;
      `;
      const [rows] = await pool.query(query);
      res.send(rows);
    } catch (error) {
      console.error('Error fetching horometro records:', error);
      res.status(500).send('Error fetching horometro records');
    }
  },

  //obtener los ultomos 50 registros--(se crea la peticion pero no esta en uso)
  getLastHorometroRecords: async (req, res) => {
    try {
      const query = `
          SELECT 
              id_asignacion,
              horometro_inicial,
              horometro_final,
              observaciones,
              registro_maquina,
              id_usuarioRegistrador,
              registro_referencia,
              hora_asignadaRegistrador,
              registro_standard
          FROM registro_horometros
          ORDER BY id_asignacion DESC
          LIMIT 50;
      `;
      const [rows] = await pool.query(query);
      res.send(rows);
    } catch (error) {
      console.error('Error fetching latest records:', error);
      res.status(500).send('Error fetching latest records');
    }
  },
  

}

