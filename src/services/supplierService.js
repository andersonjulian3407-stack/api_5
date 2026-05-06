const supplierRepository = require('../repositories/supplierRepository');
const productRepository  = require('../repositories/productRepository');

const notFound = (msg) => { const e = new Error(msg); e.status = 404; throw e; };

const getAll = (query) => supplierRepository.findAll(query);

const getById = (id) => {
  const s = supplierRepository.findById(id);
  if (!s) notFound('Supplier not found');
  return s;
};

const getProducts = (supplierId) => {
  getById(supplierId);
  return productRepository.findAll({ page: 1, limit: 9999, supplierId });
};

const create = (body) => {
  const { companyName } = body;
  if (!companyName) {
    const e = new Error('companyName es requerido'); e.status = 400; throw e;
  }
  return supplierRepository.create(body);
};

const update = (id, body) => {
  getById(id);
  return supplierRepository.update(id, body);
};

module.exports = { getAll, getById, getProducts, create, update };
