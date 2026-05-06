const fs   = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../data/products.json');

const readData  = () => JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
const writeData = (d) => fs.writeFileSync(DATA_PATH, JSON.stringify(d, null, 2), 'utf-8');

const findAll = ({ page = 1, limit = 10, supplierId, search, discontinued }) => {
  let list = readData();

  if (supplierId)    list = list.filter(p => String(p.supplierId) === String(supplierId));
  if (search)        list = list.filter(p => p.productName.toLowerCase().includes(search.toLowerCase()));
  if (discontinued !== undefined && discontinued !== '') {
    const disc = discontinued === 'true' || discontinued === true;
    list = list.filter(p => p.isDiscontinued === disc);
  }

  const total  = list.length;
  const offset = (Number(page) - 1) * Number(limit);
  return { count: total, rows: list.slice(offset, offset + Number(limit)) };
};

const findById = (id) => readData().find(p => String(p.id) === String(id)) || null;

const create = (data) => {
  const list  = readData();
  const newId = list.length > 0 ? Math.max(...list.map(p => p.id)) + 1 : 1;
  const item  = { id: newId, ...data };
  list.push(item);
  writeData(list);
  return item;
};

const replace = (id, data) => {
  const list  = readData();
  const index = list.findIndex(p => String(p.id) === String(id));
  if (index === -1) return null;
  list[index] = { id: Number(id), ...data };
  writeData(list);
  return list[index];
};

const update = (id, data) => {
  const list  = readData();
  const index = list.findIndex(p => String(p.id) === String(id));
  if (index === -1) return null;
  list[index] = { ...list[index], ...data };
  writeData(list);
  return list[index];
};

const remove = (id) => {
  const list  = readData();
  const index = list.findIndex(p => String(p.id) === String(id));
  if (index === -1) return false;
  list.splice(index, 1);
  writeData(list);
  return true;
};

module.exports = { findAll, findById, create, replace, update, remove };
