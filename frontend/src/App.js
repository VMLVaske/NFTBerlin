import 'bootstrap/dist/css/bootstrap.min.css'
import { Button, Stack } from 'react-bootstrap'
import axios from 'axios'
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef
} from 'react'
import { connect, keyStores, WalletConnection } from 'near-api-js'
import logo from './logo.png'
import nearLogo from './near.png'
import Arweave from 'arweave'
import { getConfig } from './config'

export const WalletContext = createContext('development')
/* connect to an Arweave node or specify a gateway  */

const arweave = Arweave.init({
  // host: 'arweave.net'
  host: '127.0.0.1',
  port: 1984,
  protocol: 'http'
})

function App () {
  const [bufferVal, changeBuffer] = useState([])
  const [arweaveKey, changeArweaveKey] = useState('')
  const [transacitonID, changeTransactionID] = useState('')
  const [streamID, setStreamID] = useState('')
  const [streamArrayLength, setStreamArrayLength] = useState('')
  const [sessionID, setSessionID] = useState('')
  const [downloadLink, setDownloadLink] = useState('')
  const [response, setResponse] = useState()
  const [wallet, setWallet] = useState()
  const [connectWallet, setConnectWallet] = useState(false)
  const context = useContext(WalletContext)
  //references
  const idRef = useRef()

  // arweave
  useEffect(() => {
    arweave.wallets.generate().then(key => {
      console.log(key)
      changeArweaveKey(key)
      // {
      //     "kty": "RSA",
      //     "n": "3WquzP5IVTIsv3XYJjfw5L-t4X34WoWHwOuxb9V8w...",
      //     "e": ...
    })
  }, [])

  // near
  console.log(context)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps

  //near
  useEffect(() => {
    const fetchData = async () => {
      const response = await connect({
        ...getConfig,
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        headers: {}
      })
      setResponse(response)
    }
    fetchData().catch(e => console.log(e))
  }, [connectWallet])

  const myFunction = async () => {
    console.log()
    if (wallet && !wallet?.isSignedIn()) {
      return wallet?.requestSignIn()
    }
  }

  useEffect(() => {
    if (!response) return
    const walletConn = new WalletConnection(response, 'my-app')
    setWallet(walletConn)

    myFunction()
  }, [response, connectWallet])

  const accountId = wallet?.getAccountId()

  if (!wallet) return <p>loading</p>

  const value = { wallet, setConnectWallet }

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
        changeBuffer(response.data[0].mp4Url)
      })
      .catch(error => {
        console.log('error ' + error)
      })
  }

  // arweave
  const saveToArweave = async () => {
    let data = bufferVal
    let transaction = await arweave.createTransaction(
      { data: data },
      arweaveKey
    )
    transaction.addTag('Content-Type', 'image/png')

    await arweave.transactions.sign(transaction, arweaveKey)

    changeTransactionID(transaction.id)

    console.log('transaction details')

    console.log('I am logging the transaction id', transaction.id)

    let uploader = await arweave.transactions.getUploader(transaction)

    while (!uploader.isComplete) {
      await uploader.uploadChunk()
      console.log(
        `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`
      )
    }
  }

  // arweave
  const getData = async () => {
    arweave.transactions.getStatus(idRef.current.value).then(res => {
      console.log(res)
      // {
      //  status: 200,
      //  confirmed: {
      //    block_height: 140151,
      //    block_indep_hash: 'OR1wue3oBSg3XWvH0GBlauAtAjBICVs2F_8YLYQ3aoAR7q6_3fFeuBOw7d-JTEdR',
      //    number_of_confirmations: 20
      //  }
      //}
    })

    const result = await arweave.transactions.get(idRef.current.value)
    console.log(result.data)

    const base64String = btoa(
      String.fromCharCode(...new Uint8Array(result.data))
    )

    // changeGetImage(`data:image/png;base64,${base64String}`)
  }

  return (
    <WalletContext.Provider value={value}>
      <div className=''>
        <div className='nav justify-content-around align-items-center py-2 bg-info  '>
          <img height='70px' width='70px' src={logo} alt='logo' />
          <h1 className='font-monospace'> Ticket To Web3 </h1>

          {accountId && (
            <button
              className='h-1 bg-light rounded-3 h-75 p-1 d-flex align-items-center'
              onClick={() => {
                wallet?.signOut()
                setConnectWallet(false)
              }}
            >
              <img
                className='m-1'
                height='20px'
                width='20px'
                src={nearLogo}
                alt='near-logo'
              />
              <p className='my-auto'>Sign out</p>
            </button>
          )}
          {!accountId && (
            <button
              className='h-1 bg-light rounded-3 h-75 p-1 d-flex align-items-center'
              onClick={() => {
                setConnectWallet(true)
              }}
            >
              <img
                className='m-1'
                height='20px'
                width='20px'
                src={nearLogo}
                alt='near-logo'
              />
              <p className='my-auto'>Connect Wallet</p>
            </button>
          )}
        </div>
        <Stack
          gap={4}
          className='col-md-5 mx-auto my-5 h-100 bg-light p-5 rounded4'
        >
          <h2 className='text-center'>Week 1</h2>
          <p className='text-start'>
            Please record your reflection of week one and submit the video.
          </p>
          <Button onClick={getStream}>Get Stream</Button>
          <p>Stream ID: {streamID}</p>
          <Button onClick={getSessionID}>Get SessionID</Button>
          <p>Array Length: {streamArrayLength}</p>
          <p>Get Session ID: {sessionID}</p>
          <Button onClick={getDownloadLink}>Get Download Link</Button>
          <p>
            Session ID Data: <a href={downloadLink}>{downloadLink}</a>
          </p>
          <Button onClick={saveToArweave}>Submit</Button>
        </Stack>
      </div>
    </WalletContext.Provider>
  )
}

export default App
