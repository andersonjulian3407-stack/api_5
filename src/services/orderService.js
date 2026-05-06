const orderRepository   = require('../repositories/orderRepository');
const productRepository = require('../repositories/productRepository');
const customerRepository = require('../repositories/customerRepository');

const notFound = (msg) => { const e = new Error(msg); e.status = 404; throw e; };
const badReq   = (msg) => { const e = new Error(msg); e.status = 400; throw e; };

// ── Orders ───────────────────────────────────────────────────────────────────

const getAll = ({ page = 1, limit = 10, customerId, dateFrom, dateTo, sort }) =>
  orderRepository.findAll({ page, limit, customerId, dateFrom, dateTo, sort });

const getById = (orderId) => {
  const order = orderRepository.findById(orderId);
  if (!order) notFound('Order not found');
  return order;
};

const create = (body) => {
  const { customerId, items } = body;
  if (!customerId || !Array.isArray(items) || items.length === 0)
    badReq('customerId e items son requeridos');

  // Enriquecer items con datos del producto si solo viene productId + quantity
  const enrichedItems = items.map((item, idx) => {
    if (item.productId) {
      const product = productRepository.findById(item.productId);
      if (!product) badReq(`Producto con id ${item.productId} no encontrado`);
      return {
        id: idx + 1,
        product: { ...product },
        unitPrice: item.unitPrice || product.unitPrice,
        quantity: item.quantity,
      };
    }
    return { id: idx + 1, ...item };
  });

  // Enriquecer customer
  const customer = customerRepository.findById(customerId) || { id: customerId };

  const totalAmount = enrichedItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

  return orderRepository.create({
    orderNumber: `ORD-${Date.now()}`,
    orderDate:   new Date().toISOString(),
    totalAmount,
    customer,
    items: enrichedItems,
  });
};

const replace = (orderId, body) => {
  getById(orderId);
  const totalAmount = (body.items || []).reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  return orderRepository.replace(orderId, { ...body, totalAmount });
};

const update = (orderId, body) => {
  getById(orderId);
  // Si viene customerId, enriquecer
  if (body.customerId) {
    const customer = customerRepository.findById(body.customerId) || { id: body.customerId };
    body = { ...body, customer };
    delete body.customerId;
  }
  return orderRepository.update(orderId, body);
};

const remove = (orderId) => {
  getById(orderId);
  return orderRepository.remove(orderId);
};

// ── Items ────────────────────────────────────────────────────────────────────

const getItems = (orderId) => {
  const items = orderRepository.findItems(orderId);
  if (items === null) notFound('Order not found');
  return items;
};

const addItem = (orderId, body) => {
  getById(orderId);
  const { productId, quantity, unitPrice } = body;
  if (!productId || !quantity) badReq('productId y quantity son requeridos');

  const product = productRepository.findById(productId);
  if (!product) badReq(`Producto con id ${productId} no encontrado`);

  const itemData = {
    product: { ...product },
    unitPrice: unitPrice || product.unitPrice,
    quantity,
  };
  return orderRepository.addItem(orderId, itemData);
};

const updateItem = (orderId, itemId, body) => {
  getById(orderId);
  const result = orderRepository.updateItem(orderId, itemId, body);
  if (!result) notFound('Item not found');
  return result;
};

const removeItem = (orderId, itemId) => {
  getById(orderId);
  const result = orderRepository.removeItem(orderId, itemId);
  if (result === null || result === false) notFound('Item not found');
  return result;
};

module.exports = { getAll, getById, create, replace, update, remove, getItems, addItem, updateItem, removeItem };
