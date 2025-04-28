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
            if (rows.length > 0) {
                res.send(rows[0]);
            } else {
                res.status(404).send('Asignacion no encontrada');
            }
        } catch (error) {
            console.error(error);
        }
    },

    // Crear una nueva asignación
    createAsignacion: async (req, res) => {
        const { id_usuarioAsignado, id_maquinaAsignada, id_referenciaAsignada, horas_asignadas } = req.body;
        try {
            const [result] = await pool.query('INSERT INTO asignaciones_picado (id_usuarioAsignado, id_maquinaAsignada, id_referenciaAsignada,horas_asignadas) VALUES (?, ?, ?,?)', [id_usuarioAsignado, id_maquinaAsignada, id_referenciaAsignada, horas_asignadas]);
            res.send({
                id: result.insertId,
                id_usuarioAsignado,
                id_maquinaAsignada,
                id_referenciaAsignada,
                horas_asignadas,
                id_standar
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
                [id_usuarioAsignado, id_maquinaAsignada, id_referenciaAsignada, id]
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

    // Crear múltiples asignaciones
    createMultipleAsignaciones: async (req, res) => {
        const asignaciones = req.body;
        try {
            const promises = asignaciones.map(asignacion => {
                const { id_usuarioAsignado, id_maquinaAsignada, id_referenciaAsignada, id_standar, horas_asignadas } = asignacion;
                return pool.query(
                    'INSERT INTO asignaciones_picado (id_usuarioAsignado, id_maquinaAsignada, id_referenciaAsignada,id_standar,horas_asignadas) VALUES (?, ?, ?,?,?)',
                    [id_usuarioAsignado, id_maquinaAsignada, id_referenciaAsignada, id_standar, horas_asignadas]
                );
            });
            await Promise.all(promises);
            res.send({ message: 'Asignaciones creadas correctamente' });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al crear las asignaciones');
        }
    },
    /****************************************************************************************************************************************************** */

    // Obtener todas las asignaciones con nombres de usuario, máquinas y referencias
    getAllAsignaciones: async (req, res) => {
        try {
            const query = `
                SELECT 
                    ap.id,
                    u.id_usuarios,
                    u.nombres AS nombre_usuario,
                    m.maquina,
                    r.nombre_referencia,
                    ap.horas_asignadas,
                    ap.id_standar
                FROM asignaciones_picado ap
                JOIN listado_usuarios u ON ap.id_usuarioAsignado = u.id_usuarios
                JOIN listado_maquinas m ON ap.id_maquinaAsignada = m.id_maquinas
                LEFT JOIN listado_referencias r ON ap.id_referenciaAsignada = r.id_referencia;
            `;
            const [rows] = await pool.query(query);
            res.send(rows);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al obtener las asignaciones');
        }
    },
    getAsignacionById: async (req, res) => {
        const { id } = req.params; // ID de la asignación a buscar

        try {
            // Query para obtener la asignación por ID
            const query = `
                SELECT 
                    ap.id,
                    u.nombres AS nombre_usuario,
                    m.maquina,
                    r.nombre_referencia,
                    ap.horas_asignadas
                FROM asignaciones_picado ap
                JOIN listado_usuarios u ON ap.id_usuarioAsignado = u.id_usuarios
                JOIN listado_maquinas m ON ap.id_maquinaAsignada = m.id_maquinas
                LEFT JOIN listado_referencias r ON ap.id_referenciaAsignada = r.id_referencia
                WHERE ap.id = ?;
            `;

            const [rows] = await pool.query(query, [id]);

            // Verificar si se encontró la asignación
            if (rows.length === 0) {
                return res.status(404).json({ message: 'Asignación no encontrada' });
            }

            // Devolver la asignación encontrada
            res.json(rows[0]);

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener la asignación' });
        }
    },
    // Actualizar una asignación
    // Ejemplo básico de validación en updateAsignacion
    // Controlador para actualizar una asignación por su ID
    updateAsignacionById: async (req, res) => {
        const { id } = req.params; // ID de la asignación a actualizar
        const { id_usuarioAsignado, id_maquinaAsignada, id_referenciaAsignada, horas_asignadas } = req.body;

        try {
            // Verificar si se proporcionan datos para actualizar
            if (!id_usuarioAsignado && !id_maquinaAsignada && !id_referenciaAsignada && !horas_asignadas) {
                return res.status(400).json({ error: 'Se requiere al menos un campo para actualizar' });
            }

            // Construir la consulta dinámica para actualizar solo los campos proporcionados
            let query = 'UPDATE asignaciones_picado SET ';
            const values = [];

            // Construir la consulta y los valores a actualizar
            if (id_usuarioAsignado) {
                query += 'id_usuarioAsignado = ?, ';
                values.push(id_usuarioAsignado);
            }
            if (id_maquinaAsignada) {
                query += 'id_maquinaAsignada = ?, ';
                values.push(id_maquinaAsignada);
            }
            if (id_referenciaAsignada) {
                query += 'id_referenciaAsignada = ?, ';
                values.push(id_referenciaAsignada);
            }
            if (horas_asignadas) {
                query += 'horas_asignadas = ?, ';
                values.push(horas_asignadas);
            }

            // Eliminar la coma adicional al final de la consulta
            query = query.slice(0, -2);

            // Agregar el WHERE clause para actualizar solo la asignación específica por su ID
            query += ' WHERE id = ?';
            values.push(id);

            // Ejecutar la consulta para actualizar la asignación
            const [result] = await pool.query(query, values);

            // Verificar si se actualizó alguna fila
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Asignación no encontrada o no se realizó ninguna actualización' });
            }

            // Consultar y devolver la asignación actualizada
            const [updatedAssignation] = await pool.query('SELECT * FROM asignaciones_picado WHERE id = ?', [id]);
            res.json(updatedAssignation[0]);

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al actualizar la asignación' });
        }
    },
    // Controlador para eliminar una asignación por su ID
    deleteAsignacionById: async (req, res) => {
        const { id } = req.params; // ID de la asignación a eliminar

        try {
            // Ejecutar la consulta DELETE para eliminar la asignación por su ID
            const [result] = await pool.query('DELETE FROM asignaciones_picado WHERE id = ?', [id]);

            // Verificar si se eliminó alguna fila
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Asignación no encontrada o no se eliminó ninguna asignación' });
            }

            // Devolver mensaje de éxito
            res.json({ message: 'Asignación eliminada correctamente' });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al eliminar la asignación' });
        }
    },


};
