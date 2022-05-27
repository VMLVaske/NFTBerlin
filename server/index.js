const express = require("express")
const app = express()
const axios = require('axios');
var cors = require('cors')

require('dotenv').config()

app.use(cors())

const port = process.env.PORT || 4999;

// --------- run npm install first :) ---------

// --------- internal functions ---------

const queryLivepeer = async () => {
  let result;
  await axios.get(`https://livepeer.com/api/stream/979e07b7-9928-4e4f-abdf-f141b184c5b5`,
  { headers: { authorization: 'Bearer a0e86a1b-b8f2-4134-bbd4-67cb0155159d' } }).then(response => {
    // If request is good...
    result = response.data;
  })
  .catch((error) => {
    result = 'error ' + error;
  });

  return result;
}

// --------- API functions ---------

// https://localhost:4999/get/livepeerData
app.get("/get/livepeerData", (req, res) => {
 queryLivepeer().then(
   result => {
     res.send(result)
   }
 ).catch( 
   err => { 
     res.send(err)
    }
  )
})


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});