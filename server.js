require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const clienteRoutes = require('./routes/clientesRoutes');
const articulosRoutes = require('./routes/articulosRoutes');
const proveedorRoutes = require('./routes/proveedorRoutes');
const facturaRoutes = require('./routes/facturaRoutes');
const empleadosRoutes = require('./routes/empleadosRoutes');
const methodOverride = require('method-override');


app.use(methodOverride('_method'));


// Middleware para parsear JSON
app.use(express.json());


app.use(cors({
  origin: "http://localhost:5173", // Debes usar el frontend correcto
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));


// Middleware para aceptar multipart/form-data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API conectada correctamente');
});

// Middleware para servir imágenes estáticas desde /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//Rutas
app.use('/api', clienteRoutes);
app.use('/api', articulosRoutes);
app.use('/api', proveedorRoutes);
app.use('/api', facturaRoutes);
app.use('/api', empleadosRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
