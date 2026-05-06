const productService = require('../services/productService');

const getAll   = (req, res, next) => { try { res.json(productService.getAll(req.query)); } catch (e) { next(e); } };
const getById  = (req, res, next) => { try { res.json(productService.getById(req.params.productId)); } catch (e) { next(e); } };
const create   = (req, res, next) => { try { res.status(201).json(productService.create(req.body)); } catch (e) { next(e); } };
const replace  = (req, res, next) => { try { res.json(productService.replace(req.params.productId, req.body)); } catch (e) { next(e); } };
const update   = (req, res, next) => { try { res.json(productService.update(req.params.productId, req.body)); } catch (e) { next(e); } };
const remove   = (req, res, next) => {
  try {
    const result = productService.remove(req.params.productId);
    // Si retorna el producto actualizado (discontinuado), 200; si eliminó, 204
    result ? res.json(result) : res.status(204).send();
  } catch (e) { next(e); }
};

module.exports = { getAll, getById, create, replace, update, remove };
