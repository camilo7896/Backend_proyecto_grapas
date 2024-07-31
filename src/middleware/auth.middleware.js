import jwt from 'jsonwebtoken';

export const authorizeRole = (roles) => {
    return (req, res, next) => {
        // Obtener el token del encabezado de autorización
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }
        
        // Extraer el token
        const token = authHeader.split(' ')[1];
        
        // Verificar el token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid token' });
            }
            
            // Verificar el rol del usuario
            if (!roles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            
            // Agregar la información del usuario al objeto de solicitud
            req.user = decoded;
            next();
        });
    };
};
