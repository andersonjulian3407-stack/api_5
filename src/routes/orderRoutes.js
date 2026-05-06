const { Router } = require('express');
const router = Router();
const orderController = require('../controllers/orderController');

router.get('/',            orderController.getAll);
router.get('/:orderId',    orderController.getById);
router.post('/',           orderController.create);
router.put('/:orderId',    orderController.replace);
router.patch('/:orderId',  orderController.update);
router.delete('/:orderId', orderController.remove);

module.exports = router;
