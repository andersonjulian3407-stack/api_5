const orderService = require('../services/orderService');

// ── Orders ───────────────────────────────────────────────────────────────────

const getAll = (req, res, next) => {
  try {
    const { page, limit, customerId, dateFrom, dateTo, sort } = req.query;
    res.json(orderService.getAll({ page, limit, customerId, dateFrom, dateTo, sort }));
  } catch (err) { next(err); }
};

const getById = (req, res, next) => {
  try { res.json(orderService.getById(req.params.orderId)); }
  catch (err) { next(err); }
};

const create = (req, res, next) => {
  try { res.status(201).json(orderService.create(req.body)); }
  catch (err) { next(err); }
};

const replace = (req, res, next) => {
  try { res.json(orderService.replace(req.params.orderId, req.body)); }
  catch (err) { next(err); }
};

const update = (req, res, next) => {
  try { res.json(orderService.update(req.params.orderId, req.body)); }
  catch (err) { next(err); }
};

const remove = (req, res, next) => {
  try { orderService.remove(req.params.orderId); res.status(204).send(); }
  catch (err) { next(err); }
};

// ── Items ────────────────────────────────────────────────────────────────────

const getItems = (req, res, next) => {
  try { res.json(orderService.getItems(req.params.orderId)); }
  catch (err) { next(err); }
};

const addItem = (req, res, next) => {
  try { res.status(201).json(orderService.addItem(req.params.orderId, req.body)); }
  catch (err) { next(err); }
};

const updateItem = (req, res, next) => {
  try { res.json(orderService.updateItem(req.params.orderId, req.params.itemId, req.body)); }
  catch (err) { next(err); }
};

const removeItem = (req, res, next) => {
  try { orderService.removeItem(req.params.orderId, req.params.itemId); res.status(204).send(); }
  catch (err) { next(err); }
};

module.exports = { getAll, getById, create, replace, update, remove, getItems, addItem, updateItem, removeItem };
