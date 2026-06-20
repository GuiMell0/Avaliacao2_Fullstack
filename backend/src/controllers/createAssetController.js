const mongoose = require('mongoose');
const { asyncHandler } = require('../utils/asyncHandler');
const { httpError } = require('../utils/httpError');

function canAccess(user, asset) {
  return user.role === 'admin' || asset.usuarioId === user.id;
}

function createAssetController(Model, resourceName) {
  const list = asyncHandler(async (req, res) => {
    const filter = req.user.role === 'admin' ? {} : { usuarioId: req.user.id };
    const items = await Model.find(filter).sort({ createdAt: -1 });
    return res.json(items);
  });

  const getById = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw httpError(400, 'ID inválido.');
    }

    const item = await Model.findById(req.params.id);
    if (!item) throw httpError(404, `${resourceName} não encontrado.`);
    if (!canAccess(req.user, item)) throw httpError(403, 'Você não tem acesso a este bem.');

    return res.json(item);
  });

  const create = asyncHandler(async (req, res) => {
    const item = await Model.create({ ...req.body, usuarioId: req.user.id });
    return res.status(201).json(item);
  });

  const update = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw httpError(400, 'ID inválido.');
    }

    const item = await Model.findById(req.params.id);
    if (!item) throw httpError(404, `${resourceName} não encontrado.`);
    if (!canAccess(req.user, item)) throw httpError(403, 'Você não tem acesso a este bem.');

    Object.assign(item, req.body);
    await item.save();
    return res.json(item);
  });

  const remove = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw httpError(400, 'ID inválido.');
    }

    const item = await Model.findById(req.params.id);
    if (!item) throw httpError(404, `${resourceName} não encontrado.`);
    if (!canAccess(req.user, item)) throw httpError(403, 'Você não tem acesso a este bem.');

    await item.deleteOne();
    return res.status(204).send();
  });

  return { list, getById, create, update, remove };
}

module.exports = { createAssetController };
