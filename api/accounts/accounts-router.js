const router = require('express').Router()
const md = require('./accounts-middleware')
const Account = require('./accounts-model')

// [GET] /api/accounts                                                             
// √ [1] can get the correct number of accounts (83 ms)                          
// √ [2] gets the empty array if there are no accounts (73 ms)
router.get('/', async (req, res, next) => {
  try {
    const accounts = await Account.getAll()
      res.json(accounts)
  } catch (err) {
    next(err)
  }
})
// √ [3] can get the correct account (29 ms)                                                                                                                                  
// √ [4] responds with a 404 if the id does not exist (31 ms)                                                                                                                 
// √ [5] responds with "account not found" if the id does not exist (32 ms)
router.get('/:id', md.checkAccountId, async (req, res, next) => {
  res.json(req.account)
})

// [POST] /api/accounts                                                                                                                                                         
// √ [6] creates a new account in the database (54 ms)                                                                                                                        
// √ [7] responds with a 201 and the newly created account (34 ms)                                                                                                            
// √ [8] trims the leading and trailing whitespace in the name of the new account (32 ms)                                                                                     
// √ [9] responds with a 400 and proper error if name or budget are undefined (37 ms)                                                                                         
// √ [10] responds with a 400 and proper error if name is too short or too long after trimming it (35 ms)                                                                     
// √ [11] responds with a 400 and proper error if budget cannot be coerced into a number (36 ms)                                                                              
// √ [12] responds with a 400 and proper error if budget is negative or too big (36 ms)                                                                                       
// √ [13] responds with a 400 and proper error if name already exists in the db (38 ms)
router.post('/', 
md.checkAccountPayload, 
md.checkAccountNameUnique,  
async (req, res, next) => {
  try {
    const newAccount = await Account.create({
      name: req.body.name.trim(),
      budget: req.body.budget,
    })
    res.status(201).json(newAccount)
  } catch (err) {
    next(err)
  }
})

// [PUT] /api/accounts/:id                                                                                                                                                      
// √ [14] updates the account in the database (42 ms)                                                                                                                         
// √ [15] responds with a 200 and the newly updated account (37 ms)                                                                                                           
// √ [16] responds with a 404 if the id does not exist (32 ms)                                                                                                                
// √ [17] responds with a 400 and proper error if name or budget are undefined (39 ms)                                                                                        
// √ [18] responds with a 400 and proper error if name is too short or too long after trimming (40 ms)                                                                        
// √ [19] responds with a 400 and proper error if budget cannot be coerced into a number (34 ms)                                                                              
// √ [20] responds with a 400 and proper error if budget is negative or too big (39 ms)
router.put('/:id', 
md.checkAccountId, 
md.checkAccountPayload, 
async (req, res, next) => {
  try {
    const updated = await Account.updateById(req.params.id, req.body)
    res.json(updated)
  } catch (err) {
    next(err)
  }
});

router.delete('/:id', md.checkAccountId, async(req, res, next) => {
  try {
    await Account.deleteById(req.params.id)
    res.json(req.account)
  } catch (err) {
    next(err)
  }
})

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  })
})

module.exports = router;
