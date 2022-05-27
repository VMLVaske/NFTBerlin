import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Stack} from 'react-bootstrap';

import { useState } from 'react'
import Arweave from 'arweave'

/* connect to an Arweave node or specify a gateway  */
const arweave = Arweave.init({
  host: 'arweave.net',
})

function App() {
  const [state, setState] = useState('')
  const [transactionId, setTransactionId] = useState('')

  async function createTransaction() {
    if (!state) return
    try {
      const formData = state
      setState('')
      /* creates and sends transaction to Arweave */
      let transaction = await arweave.createTransaction({ data: formData })
      await arweave.transactions.sign(transaction)
      let uploader = await arweave.transactions.getUploader(transaction)

      /* upload indicator */
      while (!uploader.isComplete) {
        await uploader.uploadChunk()
        console.log(
          `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`
        )
      }
      setTransactionId(transaction.id)
    } catch (err) {
      console.log('error: ', err)
    }
  }

  async function readFromArweave() {
    /* read Arweave data using any trsnsaction ID */
    arweave.transactions
      .getData(transactionId, {
        decode: true,
        string: true,
      })
      .then((data) => {
        console.log('data: ', data)
      })
  }

  return (
    <div>
      <h1> Dinge. </h1>
      <Stack gap={4} className="col-md-5 mx-auto">
        <Button>
          Connect to Wallet
        </Button>
        <Button onClick={createTransaction}>
          Create Transaction
        </Button>
        <Button onClick={readFromArweave}>
          Read Transaction
        </Button>
        <input
          onChange={(e) => setState(e.target.value)}
          placeholder="text"
          value={state}
        />
      </Stack>
    </div>
  );
}

const input = {
  backgroundColor: '#ddd',
  outline: 'none',
  border: 'none',
  width: '200px',
  fontSize: '16px',
  padding: '10px',
}

export default App;
