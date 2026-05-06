const orderRepository = require('../repositories/orderRepository');

const getAll = ({ page = 1, limit = 10, customerId, dateFrom, dateTo }) => {
  return orderRepository.findAll({ page, limit, customerId, dateFrom, dateTo });
};

const getById = (orderId) => {
  const order = orderRepository.findById(orderId);
  if (!order) {
    const err = new Error('Order not found');
    err.status = 404;
    throw err;
  }
  return order;
};

const create = (body) => {
  const { customerId, items } = body;

  if (!customerId || !Array.isArray(items) || items.length === 0) {
    const err = new Error('customerId e items son requeridos');
    err.status = 400;
    throw err;
  }

  const totalAmount = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const orderNumber = `ORD-${Date.now()}`;

  return orderRepository.create({
    orderNumber,
    orderDate: new Date().toISOString(),
    totalAmount,
    customer: { id: customerId },
    items,
  });
};

const replace = (orderId, body) => {
  getById(orderId); // lanza 404 si no existe
  const totalAmount = (body.items || []).reduce(
    (sum, i) => sum + i.unitPrice * i.quantity, 0
  );
  return orderRepository.replace(orderId, { ...body, totalAmount });
};

const update = (orderId, body) => {
  getById(orderId);
  return orderRepository.update(orderId, body);
};

const remove = (orderId) => {
  getById(orderId);
  return orderRepository.remove(orderId);
};

module.exports = { getAll, getById, create, replace, update, remove };
