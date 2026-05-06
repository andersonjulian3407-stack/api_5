const { Router } = require('express');
const router = Router();
const c = require('../controllers/productController');

router.get('/',                c.getAll);
router.post('/',               c.create);
router.get('/:productId',      c.getById);
router.put('/:productId',      c.replace);
router.patch('/:productId',    c.update);
router.delete('/:productId',   c.remove);

module.exports = router;
