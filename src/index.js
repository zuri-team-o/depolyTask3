
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { AuthProvider } from './context/AuthContext';


const theme = extendTheme({
  colors: {
    brand: {
      900: '#1a365d',
      800: '#153e75',
      700: '#2a69ac',
    },
    fonts: {
      heading: 'Open Sans, sans-serif',
      body: 'Raleway, sans-serif',
    },
  },
  config: {
    initialColorMode: 'dark',
  }
})

ReactDOM.render(
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ChakraProvider>,
  document.getElementById('root')
);