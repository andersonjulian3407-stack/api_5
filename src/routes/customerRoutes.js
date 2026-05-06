const { Router } = require('express');
const router = Router();
const c = require('../controllers/customerController');

router.get('/',                        c.getAll);
router.post('/',                       c.create);
router.get('/:customerId',             c.getById);
router.patch('/:customerId',           c.update);
router.get('/:customerId/orders',      c.getOrders);

module.exports = router;
