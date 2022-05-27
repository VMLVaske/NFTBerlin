const express = require('express');
const router = express.Router();
router.get('https://livepeer.com/api/stream/979e07b7-9928-4e4f-abdf-f141b184c5b5', (req, res) => {
    console.log("Req: "); 
    console.log(req); 
    console.log("Res: "); 
    console.log(res); 
});
module.exports = router;