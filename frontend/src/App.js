import 'bootstrap/dist/css/bootstrap.min.css'
import { Button, Stack } from 'react-bootstrap'
import axios from 'axios'

import { useState } from 'react'
import Arweave from 'arweave'

/* connect to an Arweave node or specify a gateway  */
const arweave = Arweave.init({
  host: 'arweave.net'
})

function App () {
  const [state, setState] = useState('')
  const [transactionId, setTransactionId] = useState('')

  async function streamData () {
    axios
      .get(
        `https://livepeer.com/api/stream/979e07b7-9928-4e4f-abdf-f141b184c5b5`,
        {
          headers: {
            authorization: 'Bearer a0e86a1b-b8f2-4134-bbd4-67cb0155159d'
          }
        }
      )
      .then(response => {
        // If request is good...
        console.log(response.data)
      })
      .catch(error => {
        console.log('error ' + error)
      })
  }

  return (
    <div>
      <h1> Dinge. </h1>
      <Stack gap={4} className='col-md-5 mx-auto'>
        <Button>Connect to Wallet</Button>˚
        <Button onClick={streamData}>Get Livestream</Button>
      </Stack>
    </div>
  )
}

export default App
