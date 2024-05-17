const express = require('express')
const router = express.Router() 

const {getAllbooks,createbook,getbook,updatebook,deletebook}=require('../controllers/cru')

router.route('/').post(createbook).get(getAllbooks)
router.route('/:id').get(getbook).patch(updatebook).delete(deletebook)

module.exports = router 
