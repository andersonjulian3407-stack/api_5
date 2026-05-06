const supplierService = require('../services/supplierService');

const getAll      = (req, res, next) => { try { res.json(supplierService.getAll(req.query)); } catch (e) { next(e); } };
const getById     = (req, res, next) => { try { res.json(supplierService.getById(req.params.supplierId)); } catch (e) { next(e); } };
const getProducts = (req, res, next) => { try { res.json(supplierService.getProducts(req.params.supplierId)); } catch (e) { next(e); } };
const create      = (req, res, next) => { try { res.status(201).json(supplierService.create(req.body)); } catch (e) { next(e); } };
const update      = (req, res, next) => { try { res.json(supplierService.update(req.params.supplierId, req.body)); } catch (e) { next(e); } };

module.exports = { getAll, getById, getProducts, create, update };
