const { Router } = require('express');
const router = Router();
const c = require('../controllers/supplierController');

router.get('/',                          c.getAll);
router.post('/',                         c.create);
router.get('/:supplierId',               c.getById);
router.patch('/:supplierId',             c.update);
router.get('/:supplierId/products',      c.getProducts);

module.exports = router;
