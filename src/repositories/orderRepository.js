const fs   = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../data/orders.json');

const readData  = () => JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
const writeData = (d) => fs.writeFileSync(DATA_PATH, JSON.stringify(d, null, 2), 'utf-8');

// ── Orders ───────────────────────────────────────────────────────────────────

const findAll = ({ page = 1, limit = 10, customerId, dateFrom, dateTo, sort }) => {
  let orders = readData();

  if (customerId) orders = orders.filter(o => String(o.customer.id) === String(customerId));
  if (dateFrom)   orders = orders.filter(o => new Date(o.orderDate) >= new Date(dateFrom));
  if (dateTo)     orders = orders.filter(o => new Date(o.orderDate) <= new Date(dateTo));

  // Ordenamiento: sort=totalAmount_asc | totalAmount_desc | orderDate_asc | orderDate_desc
  if (sort) {
    const [field, dir] = sort.split('_');
    orders.sort((a, b) => {
      const va = a[field], vb = b[field];
      if (va < vb) return dir === 'desc' ? 1 : -1;
      if (va > vb) return dir === 'desc' ? -1 : 1;
      return 0;
    });
  }

  const total  = orders.length;
  const offset = (Number(page) - 1) * Number(limit);
  return { count: total, rows: orders.slice(offset, offset + Number(limit)) };
};

const findById = (id) => readData().find(o => String(o.id) === String(id)) || null;

const create = (data) => {
  const orders = readData();
  const newId  = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;
  const order  = { id: newId, ...data };
  orders.push(order);
  writeData(orders);
  return order;
};

const replace = (id, data) => {
  const orders = readData();
  const index  = orders.findIndex(o => String(o.id) === String(id));
  if (index === -1) return null;
  orders[index] = { id: Number(id), ...data };
  writeData(orders);
  return orders[index];
};

const update = (id, data) => {
  const orders = readData();
  const index  = orders.findIndex(o => String(o.id) === String(id));
  if (index === -1) return null;
  orders[index] = { ...orders[index], ...data };
  writeData(orders);
  return orders[index];
};

const remove = (id) => {
  const orders = readData();
  const index  = orders.findIndex(o => String(o.id) === String(id));
  if (index === -1) return false;
  orders.splice(index, 1);
  writeData(orders);
  return true;
};

// ── Items ────────────────────────────────────────────────────────────────────

const recalcTotal = (order) => {
  order.totalAmount = (order.items || []).reduce(
    (sum, i) => sum + i.unitPrice * i.quantity, 0
  );
  return order;
};

const findItems = (orderId) => {
  const order = findById(orderId);
  return order ? order.items || [] : null;
};

const addItem = (orderId, itemData) => {
  const orders = readData();
  const index  = orders.findIndex(o => String(o.id) === String(orderId));
  if (index === -1) return null;

  const items  = orders[index].items || [];
  const newId  = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
  const newItem = { id: newId, ...itemData };
  items.push(newItem);
  orders[index].items = items;
  recalcTotal(orders[index]);
  writeData(orders);
  return { order: orders[index], item: newItem };
};

const updateItem = (orderId, itemId, data) => {
  const orders = readData();
  const oIdx   = orders.findIndex(o => String(o.id) === String(orderId));
  if (oIdx === -1) return null;

  const iIdx = orders[oIdx].items.findIndex(i => String(i.id) === String(itemId));
  if (iIdx === -1) return null;

  orders[oIdx].items[iIdx] = { ...orders[oIdx].items[iIdx], ...data };
  recalcTotal(orders[oIdx]);
  writeData(orders);
  return { order: orders[oIdx], item: orders[oIdx].items[iIdx] };
};

const removeItem = (orderId, itemId) => {
  const orders = readData();
  const oIdx   = orders.findIndex(o => String(o.id) === String(orderId));
  if (oIdx === -1) return null;

  const iIdx = orders[oIdx].items.findIndex(i => String(i.id) === String(itemId));
  if (iIdx === -1) return false;

  orders[oIdx].items.splice(iIdx, 1);
  recalcTotal(orders[oIdx]);
  writeData(orders);
  return true;
};

module.exports = { findAll, findById, create, replace, update, remove, findItems, addItem, updateItem, removeItem };
