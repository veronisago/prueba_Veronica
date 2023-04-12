const { Router } = require('express');
const { getCities } = require('../controllers/cityController.js');
const { getState } = require('../controllers/stateController.js');
const { getCountry } = require('../controllers/countryController.js');


const router = Router();

router.get('/country/:country', getCountry)

router.get('/state/:state', getState )

router.get('/city/:city', getCities)




module.exports = router;