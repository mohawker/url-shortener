import './App.css';
import { useState } from 'react';

// MUI Components
import { alpha, styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const axios = require('axios');

function App() {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const [longURL, setLongURL] = useState('');
  const generateShortURL = (e) => {
    console.log(`Shortening ${longURL}`);
    const payload = JSON.stringify({ url: `${longURL}` });
    console.log(payload);
    const prodURL =
      'https://shorten-this-url-please.herokuapp.com/api/create-short-url';
    const devURL = 'http://localhost:4000/api/create-short-url';

    axios
      .post(devURL, { payload })
      .then(function (res) {
        console.log(res.data.message);
        console.log(res.data.type);
      })
      .catch(function (err) {
        console.log(err);
      });
    // fetch(devURL, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(url),
    // })
    //   .then((res) => res.json())
    //   .then((data) => {
    //     console.log(data);
    //   })
    //   .catch((err) => {
    //     console.log(err.message);
    //   });
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container className='homepage'>
        <Stack className='homepage-stack' spacing={2}>
          <Typography variant='h4'>Shorten this URL</Typography>
          <TextField
            id='url-input'
            label='Input full URL here:'
            variant='outlined'
            className='url-input-field'
            onChange={(input) => setLongURL(input.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                generateShortURL();
              }
            }}
          />
        </Stack>
      </Container>
    </ThemeProvider>
  );
}

export default App;
