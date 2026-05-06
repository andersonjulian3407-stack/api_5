const productRepository  = require('../repositories/productRepository');
const supplierRepository = require('../repositories/supplierRepository');
const orderRepository    = require('../repositories/orderRepository');

const notFound = (msg) => { const e = new Error(msg); e.status = 404; throw e; };
const conflict = (msg) => { const e = new Error(msg); e.status = 409; throw e; };

const enrich = (product) => {
  if (!product) return null;
  const supplier = supplierRepository.findById(product.supplierId);
  return { ...product, supplier: supplier || null };
};

const getAll = (query) => {
  const result = productRepository.findAll(query);
  return { count: result.count, rows: result.rows.map(enrich) };
};

const getById = (id) => {
  const p = productRepository.findById(id);
  if (!p) notFound('Product not found');
  return enrich(p);
};

const create = (body) => {
  const { productName, supplierId, unitPrice, package: pkg, isDiscontinued } = body;
  if (!productName || !unitPrice) {
    const e = new Error('productName y unitPrice son requeridos'); e.status = 400; throw e;
  }
  return enrich(productRepository.create({ productName, supplierId, unitPrice, package: pkg || '', isDiscontinued: isDiscontinued || false }));
};

const replace = (id, body) => {
  getById(id);
  return enrich(productRepository.replace(id, body));
};

const update = (id, body) => {
  getById(id);
  return enrich(productRepository.update(id, body));
};

const remove = (id) => {
  const product = getById(id);
  // Verificar si el producto está en algún pedido activo
  const allOrders = orderRepository.findAll({ page: 1, limit: 9999 });
  const inUse = allOrders.rows.some(o =>
    (o.items || []).some(i => String(i.product?.id) === String(id))
  );
  if (inUse) {
    // Marcar como discontinuado en lugar de eliminar
    return enrich(productRepository.update(id, { isDiscontinued: true }));
  }
  productRepository.remove(id);
  return null;
};

module.exports = { getAll, getById, create, replace, update, remove };
