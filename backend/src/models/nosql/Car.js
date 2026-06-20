const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    marca: { type: String, required: true, trim: true },
    modelo: { type: String, required: true, trim: true },
    ano: { type: Number, required: true, min: 1886 },
    placa: { type: String, trim: true, uppercase: true },
    cor: { type: String, trim: true },
    valorEstimado: { type: Number, default: 0, min: 0 },
    observacoes: { type: String, trim: true },
    usuarioId: { type: Number, required: true, index: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Car', carSchema);
