const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../data/orders.json');

// Lee el archivo JSON
const readData = () => {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
};

// Escribe el archivo JSON
const writeData = (data) => {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
};

// Retorna todas las órdenes con filtros y paginación opcionales
const findAll = ({ page = 1, limit = 10, customerId, dateFrom, dateTo }) => {
  let orders = readData();

  if (customerId) {
    orders = orders.filter(o => String(o.customer.id) === String(customerId));
  }
  if (dateFrom) {
    orders = orders.filter(o => new Date(o.orderDate) >= new Date(dateFrom));
  }
  if (dateTo) {
    orders = orders.filter(o => new Date(o.orderDate) <= new Date(dateTo));
  }

  const total = orders.length;
  const offset = (Number(page) - 1) * Number(limit);
  const rows = orders.slice(offset, offset + Number(limit));

  return { count: total, rows };
};

// Busca una orden por ID
const findById = (id) => {
  const orders = readData();
  return orders.find(o => String(o.id) === String(id)) || null;
};

// Crea una nueva orden
const create = (data) => {
  const orders = readData();
  const newId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;
  const newOrder = { id: newId, ...data };
  orders.push(newOrder);
  writeData(orders);
  return newOrder;
};

// Reemplaza una orden completa
const replace = (id, data) => {
  const orders = readData();
  const index = orders.findIndex(o => String(o.id) === String(id));
  if (index === -1) return null;
  orders[index] = { id: Number(id), ...data };
  writeData(orders);
  return orders[index];
};

// Actualiza solo los campos enviados
const update = (id, data) => {
  const orders = readData();
  const index = orders.findIndex(o => String(o.id) === String(id));
  if (index === -1) return null;
  orders[index] = { ...orders[index], ...data };
  writeData(orders);
  return orders[index];
};

// Elimina una orden
const remove = (id) => {
  const orders = readData();
  const index = orders.findIndex(o => String(o.id) === String(id));
  if (index === -1) return false;
  orders.splice(index, 1);
  writeData(orders);
  return true;
};

module.exports = { findAll, findById, create, replace, update, remove };
