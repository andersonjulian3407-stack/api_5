const orderService = require('../services/orderService');

const getAll = (req, res, next) => {
  try {
    const { page, limit, customerId, dateFrom, dateTo } = req.query;
    const data = orderService.getAll({ page, limit, customerId, dateFrom, dateTo });
    res.json(data);
  } catch (err) { next(err); }
};

const getById = (req, res, next) => {
  try {
    const data = orderService.getById(req.params.orderId);
    res.json(data);
  } catch (err) { next(err); }
};

const create = (req, res, next) => {
  try {
    const data = orderService.create(req.body);
    res.status(201).json(data);
  } catch (err) { next(err); }
};

const replace = (req, res, next) => {
  try {
    const data = orderService.replace(req.params.orderId, req.body);
    res.json(data);
  } catch (err) { next(err); }
};

const update = (req, res, next) => {
  try {
    const data = orderService.update(req.params.orderId, req.body);
    res.json(data);
  } catch (err) { next(err); }
};

const remove = (req, res, next) => {
  try {
    orderService.remove(req.params.orderId);
    res.status(204).send();
  } catch (err) { next(err); }
};

module.exports = { getAll, getById, create, replace, update, remove };
