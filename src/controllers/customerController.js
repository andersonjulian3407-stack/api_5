const customerService = require('../services/customerService');

const getAll      = (req, res, next) => { try { res.json(customerService.getAll(req.query)); } catch (e) { next(e); } };
const getById     = (req, res, next) => { try { res.json(customerService.getById(req.params.customerId)); } catch (e) { next(e); } };
const getOrders   = (req, res, next) => { try { res.json(customerService.getOrders(req.params.customerId)); } catch (e) { next(e); } };
const create      = (req, res, next) => { try { res.status(201).json(customerService.create(req.body)); } catch (e) { next(e); } };
const update      = (req, res, next) => { try { res.json(customerService.update(req.params.customerId, req.body)); } catch (e) { next(e); } };

module.exports = { getAll, getById, getOrders, create, update };
