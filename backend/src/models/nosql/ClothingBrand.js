const mongoose = require('mongoose');

const clothingBrandSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    marca: { type: String, required: true, trim: true },
    tipo: { type: String, required: true, trim: true },
    tamanho: { type: String, trim: true },
    cor: { type: String, trim: true },
    quantidade: { type: Number, default: 1, min: 1 },
    valorEstimado: { type: Number, default: 0, min: 0 },
    observacoes: { type: String, trim: true },
    usuarioId: { type: Number, required: true, index: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('ClothingBrand', clothingBrandSchema);
