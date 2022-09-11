import './App.css';
import { useState } from 'react';

// MUI Components
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// MUI Icons
import ClearIcon from '@mui/icons-material/Clear';
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
  const [longURL, setLongURL] = useState('');
  const [shortURL, setShortURL] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Helper Functions
  const handleClearLongURL = () => {
    setLongURL('');
  };

  const generateShortURL = (e) => {
    const shortenURL = DEV_BASE_URL + 'api/create-short-url';
    axios
      .post(shortenURL, { url: longURL })
      .then(function (res) {
        const res_type = res.data.type;
        const res_code = res.data.code;
        if (res_type === 'failure' || res_code === undefined) {
          const res_message = res.data.message;
          setShortURL('');
          setErrorMessage(res_message);
          console.log(res_message);
        } else {
          const short_url = DEV_BASE_URL + res_code;
          setShortURL(short_url);
          setErrorMessage('');
          console.log(short_url);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  // Custom Components
  const EnterButton = () => (
    <IconButton
      sx={{ visibility: longURL ? 'visible' : 'hidden' }}
      onClick={handleClearLongURL}
    >
      <ClearIcon />
    </IconButton>
  );

  const LongURLTextField = () => {
    errorMessage === '' ? (
      <TextField
        id='url-input'
        label='Input full URL here:'
        variant='outlined'
        className='url-input-field'
        defaultValue={longURL}
        value={longURL}
        onChange={(input) => setLongURL(input.target.value)}
        InputProps={{ endAdornment: <EnterButton /> }}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            generateShortURL();
          }
        }}
      />
    ) : (
      <TextField
        error
        id='url-input'
        label='Input full URL here:'
        variant='outlined'
        className='url-input-field'
        helperText={errorMessage}
        defaultValue={longURL}
        value={longURL}
        onChange={(input) => setLongURL(input.target.value)}
        InputProps={{ endAdornment: <EnterButton /> }}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            generateShortURL();
          }
        }}
      />
    );
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container className='homepage'>
        <Stack className='homepage-stack' spacing={2}>
          <Typography variant='h3'>URL Shortener</Typography>
          {errorMessage === '' ? (
            <TextField
              id='url-input'
              label='Input full URL here:'
              variant='outlined'
              className='url-input-field'
              defaultValue={longURL}
              value={longURL}
              onChange={(input) => setLongURL(input.target.value)}
              InputProps={{ endAdornment: <EnterButton /> }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  generateShortURL();
                }
              }}
            />
          ) : (
            <TextField
              error
              id='url-input'
              label='Input full URL here:'
              variant='outlined'
              className='url-input-field'
              helperText={errorMessage}
              defaultValue={longURL}
              value={longURL}
              onChange={(input) => setLongURL(input.target.value)}
              InputProps={{ endAdornment: <EnterButton /> }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  generateShortURL();
                }
              }}
            />
          )}
          {shortURL ? (
            <>
              <Paper elevation='2' sx={{ width: '100%', padding: 5 }}>
                <Typography variant='h6'>Shortened URL</Typography>
                <Typography>{shortURL}</Typography>{' '}
              </Paper>
            </>
          ) : (
            <></>
          )}
        </Stack>
      </Container>
    </ThemeProvider>
  );
}

export default App;
