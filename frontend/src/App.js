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
  const [streamID, setStreamID] = useState('')
  const [streamArrayLength, setStreamArrayLength] = useState('')
  const [sessionID, setSessionID] = useState('')
  const [downloadLink, setDownloadLink] = useState('')

  async function getStream () {
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
        setStreamID(response.data.id)
      })
      .catch(error => {
        console.log('error ' + error)
      })
  }

  async function getSessionID () {
    axios
      .get(
        `https://livepeer.com/api/stream/979e07b7-9928-4e4f-abdf-f141b184c5b5/sessions`,
        {
          headers: {
            authorization: 'Bearer a0e86a1b-b8f2-4134-bbd4-67cb0155159d'
          }
        }
      )
      .then(response => {
        // If request is good...
        console.log(response.data)
        setStreamArrayLength(response.data.length)
        setSessionID(response.data[0].id)
      })
      .catch(error => {
        console.log('error ' + error)
      })
  }

  async function getDownloadLink () {
    axios
      .get(
        `https://livepeer.com/api/stream/979e07b7-9928-4e4f-abdf-f141b184c5b5/sessions?record=1`,
        {
          headers: {
            authorization: 'Bearer a0e86a1b-b8f2-4134-bbd4-67cb0155159d'
          }
        }
      )
      .then(response => {
        // If request is good...
        console.log(response.data[0])
        setDownloadLink(response.data[0].mp4Url)
      })
      .catch(error => {
        console.log('error ' + error)
      })
  }

  return (
    <div>
      <h1> Ticket To Web3 Onboarding Portal </h1>
      <Stack gap={4} className='col-md-5 mx-auto'>
        <Button>Connect to Wallet</Button>
        <Button onClick={getStream}>Get Stream</Button>
        <p>Stream ID: {streamID}</p>
        <Button onClick={getSessionID}>Get SessionID</Button>
        <p>Array Length: {streamArrayLength}</p>
        <p>Get Session ID: {sessionID}</p>
        <Button onClick={getDownloadLink}>Get Download Link</Button>
        <p>
          Session ID Data: <a href={downloadLink}>{downloadLink}</a>
        </p>
      </Stack>
    </div>
  )
}

export default App
