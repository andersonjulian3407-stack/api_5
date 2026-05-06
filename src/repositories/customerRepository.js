const fs   = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../data/customers.json');

const readData  = () => JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
const writeData = (d) => fs.writeFileSync(DATA_PATH, JSON.stringify(d, null, 2), 'utf-8');

const findAll = ({ page = 1, limit = 10, country, city, search }) => {
  let list = readData();

  if (country) list = list.filter(c => c.country.toLowerCase() === country.toLowerCase());
  if (city)    list = list.filter(c => c.city.toLowerCase() === city.toLowerCase());
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(c =>
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q)  ||
      c.city.toLowerCase().includes(q)
    );
  }

  const total  = list.length;
  const offset = (Number(page) - 1) * Number(limit);
  return { count: total, rows: list.slice(offset, offset + Number(limit)) };
};

const findById = (id) => readData().find(c => String(c.id) === String(id)) || null;

const create = (data) => {
  const list  = readData();
  const newId = list.length > 0 ? Math.max(...list.map(c => c.id)) + 1 : 1;
  const item  = { id: newId, ...data };
  list.push(item);
  writeData(list);
  return item;
};

const update = (id, data) => {
  const list  = readData();
  const index = list.findIndex(c => String(c.id) === String(id));
  if (index === -1) return null;
  list[index] = { ...list[index], ...data };
  writeData(list);
  return list[index];
};

module.exports = { findAll, findById, create, update };
