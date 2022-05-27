import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Stack } from 'react-bootstrap';
import axios from 'axios';

import { useState } from 'react'

function App() {
  const [state, setState] = useState('')
  const [transactionId, setTransactionId] = useState('')

  async function getStream() {

    axios.get(`https://livepeer.com/api/stream/979e07b7-9928-4e4f-abdf-f141b184c5b5`,
      { headers: { authorization: 'Bearer a0e86a1b-b8f2-4134-bbd4-67cb0155159d' } }).then(response => {
        // If request is good...
        console.log(response.data);
      })
      .catch((error) => {
        console.log('error ' + error);
      });
  }

  async function getSessionID() {

    axios.get(`https://livepeer.com/api/stream/979e07b7-9928-4e4f-abdf-f141b184c5b5/sessions`,
      { headers: { authorization: 'Bearer a0e86a1b-b8f2-4134-bbd4-67cb0155159d' } }).then(response => {
        // If request is good...
        console.log(response.data);
      })
      .catch((error) => {
        console.log('error ' + error);
      });
  }

  async function getSession() {

    axios.get(`https://livepeer.com/api/stream/979e07b7-9928-4e4f-abdf-f141b184c5b5/sessions`,
      { headers: { authorization: 'Bearer a0e86a1b-b8f2-4134-bbd4-67cb0155159d' } }).then(response => {
        // If request is good...
        console.log(response.data[0]);
      })
      .catch((error) => {
        console.log('error ' + error);
      });
  }

  return (
    <div>
      <h1> Dinge. </h1>
      <Stack gap={4} className="col-md-5 mx-auto">
        <Button>
          Connect to Wallet
        </Button>
        <Button onClick={getStream}>
          Get Stream
        </Button>
        <Button onClick={getSessionID}>
          Get SessionID
        </Button>

        <Button onClick={getSession}>
          Get Stream
        </Button>
      </Stack>
    </div>
  );
}

export default App;
