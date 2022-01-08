import './App.css';

import {
  useEffect,
  useState,
} from 'react';

import * as nanocurrency from 'nanocurrency';
import QRCode from 'qrcode.react';

import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Grid,
  Link,
  Snackbar,
  Typography,
} from '@mui/material';

import BalanceMonitor from './BalanceMonitor';

function App() {
  const [secretKey, setSecretKey] = useState(null);
  const [address, setAddress] = useState(null);
  const [copySuccessSnackbarOpen, setCopySuccessSnackbarOpen] = useState(false);
  const [copyErrorSnackbarOpen, setCopyErrorSnackbarOpen] = useState(false);

  const withSeed = seed => {
    const secretKey = nanocurrency.deriveSecretKey(seed, 0);
    const publicKey = nanocurrency.derivePublicKey(secretKey);
    const address = nanocurrency.deriveAddress(publicKey, {useNanoPrefix: true});
    setSecretKey(secretKey);
    setAddress(address);
    localStorage.setItem('seed', seed);
  };

  useEffect(() => {
    const localSeed = localStorage.getItem('seed');
    if (localSeed) {
      withSeed(localSeed);
    } else {
      nanocurrency.generateSeed().then(withSeed);
    }
  }, []);

  const copySecret = () => {
    try {
      navigator.clipboard.writeText(secretKey);
      setCopySuccessSnackbarOpen(true);
    } catch {
      setCopyErrorSnackbarOpen(true);
    }
  };

  if (!address) {
    return (
      <Container sx={{mt: theme => theme.spacing(10), textAlign: "center"}}>
        <Typography variant="h6">
          Generating your nano address...
        </Typography>
        <CircularProgress />
      </Container>
    )
  }

  return (
    <Container sx={{mt: theme => theme.spacing(10)}}>
      <Snackbar 
        open={copySuccessSnackbarOpen}
        autoHideDuration={2000}
      >
        <Alert severity='success'>
          Copied to clipboard!
        </Alert>
      </Snackbar>
      <Snackbar
        open={copyErrorSnackbarOpen}
        autoHideDuration={2000}
      >
        <Alert severity='error'>
          Could not copy to clipboard!
        </Alert>
      </Snackbar>
      <Typography variant="h2" sx={{textAlign: "center", mb: theme => theme.spacing(5)}}>Get ready to recieve some nano!</Typography>
      <Grid container direction={{xs: "column", md: "row"}} justifyContent="center" spacing={4} sx={{mb: theme => theme.spacing(10)}}>
        <Grid item xs={4} sx={{textAlign: "center"}}>
          <QRCode size={256} value={address} />
        </Grid>
        <Grid item xs={4}>
          <Typography>
            Your new nano address is:<br />
            <Typography sx={{background: "#fee", p: 1, fontFamily: "monospace", wordWrap: "anywhere"}}>{address}</Typography>
            <br />
            You can use this address or the QR code as a tip jar!
          </Typography>
          <Typography sx={{mb: theme => theme.spacing(1)}}>
            You can redeem this nano with a wallet like <Link href="https://nault.cc/">Nault</Link>.<br />
            Import your secret key when importing a wallet.
          </Typography>
          <Typography>
            <Button variant="outlined" color="error" onClick={copySecret}>
              Copy secret key to clipboard
            </Button>
          </Typography>
          <Typography variant="subtitle2">
            Warning: do not share your secret key with anyone!
          </Typography>
        </Grid>
      </Grid>
      <BalanceMonitor address={address} />
    </Container>
  );
}

export default App;
