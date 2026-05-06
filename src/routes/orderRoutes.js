const { Router } = require('express');
const router = Router();
const c = require('../controllers/orderController');

// Orders
router.get('/',    c.getAll);
router.post('/',   c.create);
router.get('/:orderId',    c.getById);
router.put('/:orderId',    c.replace);
router.patch('/:orderId',  c.update);
router.delete('/:orderId', c.remove);

// Items
router.get('/:orderId/items',              c.getItems);
router.post('/:orderId/items',             c.addItem);
router.patch('/:orderId/items/:itemId',    c.updateItem);
router.delete('/:orderId/items/:itemId',   c.removeItem);

module.exports = router;
