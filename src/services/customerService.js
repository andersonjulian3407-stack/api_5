const customerRepository = require('../repositories/customerRepository');
const orderRepository    = require('../repositories/orderRepository');

const notFound = (msg) => { const e = new Error(msg); e.status = 404; throw e; };

const getAll = (query) => customerRepository.findAll(query);

const getById = (id) => {
  const c = customerRepository.findById(id);
  if (!c) notFound('Customer not found');
  return c;
};

const getOrders = (customerId) => {
  getById(customerId);
  return orderRepository.findAll({ page: 1, limit: 9999, customerId });
};

const create = (body) => {
  const { firstName, lastName, city, country, phone } = body;
  if (!firstName || !lastName) {
    const e = new Error('firstName y lastName son requeridos'); e.status = 400; throw e;
  }
  return customerRepository.create({ firstName, lastName, city, country, phone });
};

const update = (id, body) => {
  getById(id);
  return customerRepository.update(id, body);
};

module.exports = { getAll, getById, getOrders, create, update };
