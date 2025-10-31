const ClienteModel = require('../models/clientesModel');

const clienteController = {
  getAll: async (req, res) => {
    try {
      const clientes = await ClienteModel.getAll();
      res.json(clientes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const cliente = await ClienteModel.getById(id);
      if (!cliente) return res.status(404).json({ message: "Cliente no encontrado" });
      res.json(cliente);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  insert: async (req, res) => {
    try {
      const data = req.body;
      const nuevoCliente = await ClienteModel.insert(data);
      res.status(201).json({
        message: "Cliente registrado exitosamente",
        cliente: nuevoCliente,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const result = await ClienteModel.update(id, data);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await ClienteModel.delete(id);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  buscar: async (req, res) => {
    try {
      const { q } = req.query;
      const clientes = await ClienteModel.buscar(q);
      res.json(clientes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getByCedula: async (req, res) => {
    try {
      const { cedula } = req.params;
      const cliente = await ClienteModel.getByCedula(cedula);
      res.json(cliente);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = clienteController;
