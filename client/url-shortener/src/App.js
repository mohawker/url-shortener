import './App.css';
import { useState, Fragment, useEffect } from 'react';

// MUI Components
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import SnackBar from '@mui/material/SnackBar';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';

// MUI Icons
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';

// Animation Libraries
import AOS from 'aos';
import 'aos/dist/aos.css';
import { TypeAnimation } from 'react-type-animation';

const axios = require('axios');
const PROD_BASE_URL =
  'https://shorten-this-url-please.herokuapp.com/api/create-short-url';
const DEV_BASE_URL = 'http://localhost:4000/';

function App() {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  // Set States
  // URL to be encoded
  const [longURL, setLongURL] = useState('');
  // Shortened URL - After encoding
  const [shortURL, setShortURL] = useState('');
  // Error message to be displayed on UI if API returns failure
  const [errorMessage, setErrorMessage] = useState('');
  // Color Status of Text Field (Default, Success, Failure)
  const [textFieldColor, setTextFieldColor] = useState('');
  const [isError, setError] = useState(false);
  // To open snackbar on screen
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 750,
    });
  }, []);

  // Helper Functions
  const handleSnackbarClick = () => {
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const generateShortURL = (e) => {
    const shortenURL = DEV_BASE_URL + 'api/create-short-url';
    setIsLoading(true);
    axios
      .post(shortenURL, { url: longURL })
      .then(function (res) {
        const res_type = res.data.type;
        const res_code = res.data.code;
        if (res_type === 'failure' || res_code === undefined) {
          const res_message = res.data.message;
          setShortURL('');
          setErrorMessage(res_message);
          setTextFieldColor('error');
          setError(true);
        } else {
          const short_url = DEV_BASE_URL + res_code;
          setShortURL(short_url);
          setErrorMessage('');
          setTextFieldColor('success');
        }
      })
      .catch(function (err) {
        console.log(err);
      });
    setIsLoading(false);
  };

  // Custom Components
  const CopyButton = () => (
    <IconButton
      onClick={() => {
        navigator.clipboard.writeText(shortURL);
        handleSnackbarClick();
      }}
      size='small'
    >
      <ContentCopyIcon />
    </IconButton>
  );

  const SendButton = () => (
    <LoadingButton
      onClick={() => generateShortURL()}
      loading={isLoading}
      size='small'
      color={textFieldColor ? textFieldColor : 'inherit'}
    >
      <SendIcon />
    </LoadingButton>
  );

  const CloseSnackbarButton = (
    <Fragment>
      <IconButton
        size='small'
        aria-label='close'
        color='inherit'
        onClick={handleSnackbarClose}
      >
        <CloseIcon fontSize='small' />
      </IconButton>
    </Fragment>
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container className='homepage'>
        <Stack className='homepage-stack' spacing={3}>
          <Typography variant='h3' fontWeight='bold'>
            URL Shortener
          </Typography>
          <TypeAnimation
            sequence={[
              'Shorten any valid URL: https://www.google.com',
              2000,
              'Shorten any valid URL: https://www.tech.gov.sg/',
              2000,
              'Shorten any valid URL: https://github.com/mohawker',
              2000,
            ]}
            wrapper='div'
            cursor={true}
            repeat={Infinity}
            style={{ fontSize: '0.75em', fontWeight: '750' }}
          />
          <TextField
            error={isError}
            id='url-input'
            label='Input full URL here:'
            variant='outlined'
            className='url-input-field'
            color={textFieldColor}
            defaultValue={longURL}
            value={longURL}
            helperText={errorMessage}
            onChange={(input) => {
              setLongURL(input.target.value);
              setErrorMessage('');
              setTextFieldColor('');
              setError(false);
            }}
            InputProps={{ endAdornment: <SendButton /> }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                generateShortURL();
              }
            }}
          />
          {shortURL ? (
            <div data-aos='fade-up' className='short-url-paper'>
              <Paper elevation='2' sx={{ width: '100%', padding: 5 }}>
                <Stack spacing={1}>
                  <Typography variant='h6'>
                    Your URL was shortened successfully!
                  </Typography>
                  <Divider />
                  <Stack
                    direction='row'
                    alignItems='center'
                    spacing={0.5}
                    justifyContent='center'
                  >
                    <Typography>{shortURL}</Typography>
                    <CopyButton />
                  </Stack>
                </Stack>
              </Paper>
            </div>
          ) : (
            <></>
          )}
        </Stack>
      </Container>
      <SnackBar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message='URL copied to clipboard!'
        action={CloseSnackbarButton}
      />
    </ThemeProvider>
  );
}

export default App;
