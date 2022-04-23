import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ArticleCard, BookCard, Footer, HeroSection, Navbar } from './components';
import { useAuth } from './context/AuthContext';


const App = () => {

  const { setCurrentAccount, setCurrentNetwork, 
    currentNetwork, setContractAddr
  } = useAuth()

  useEffect(() => {

    const initialCheck = async() => {
      try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        setCurrentNetwork(parseInt(chainId, 16))
        
        window.ethereum.on('accountsChanged', function (accounts) {
          // Time to reload your interface with accounts[0]!
          console.log(accounts[0])
          setCurrentAccount(accounts[0]);
          window.location.reload()
        })
        
        window.ethereum.on('chainChanged', function (chainId) {
          // Time to reload your interface with the new chainId
          setCurrentNetwork(parseInt(chainId, 16))
         
          window.location.reload()
        })
      } catch(err) {
        console.log(err)
      }
    }
    initialCheck();

  }, [setCurrentAccount, setCurrentNetwork, setContractAddr, currentNetwork]);

  return (
    <>
      <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/public" element={<ArticleCard />} />
          <Route path="/private" element={<BookCard />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App

