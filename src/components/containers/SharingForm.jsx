import {
  Modal,
    Box,
    Button,
    FormControl,
    FormLabel,
    useToast,
    Input,
    InputGroup,
    Stack,
    Textarea,
    useColorModeValue,
    VStack,
  } from '@chakra-ui/react';
  import React, { useEffect, useState, useRef } from "react";
//   import { useAuth } from '../../context/AuthContext';
import { ethers } from 'ethers';


import DftpABI from '../../ABI/Dftp.json';

import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js";

  export default function SharingForm(props) {
  const { id, addresses, type, open, setOpen } = props;

    useEffect(() => {
    }, []) ;

    const [ isLoading, setIsLoading ] = useState();
    const [ isSent, setIsSent ] = useState(false);
    const addressRef = useRef();

    const toast = useToast();
    const toastID = 'toast';

    
    const addAddress = async () => {
    
    setIsLoading(true);
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      
      
      const address = addressRef.current.value;// address to be removed
      var myArray = [address];
      console.log(myArray);
      console.log(id);

      if (ethereum) {

        const contractAddress = "0xb20fbd2A9e9db2ce827BB3d3e02CF627d6660CB9";
        const dftpABI = DftpABI.abi;
        //setLoading(true);
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        console.log(contractAddress);
        console.log(dftpABI);
        const dFtpContract = new ethers.Contract(
          contractAddress,
          dftpABI,
          signer
        );

        const addAddressTxn = await dFtpContract.addSharedPeers(
            id,
            myArray,

          {
            gasLimit: 3000000,
          }
        );

        console.log("Mining...", addAddressTxn.hash);
        setTimeout(() => {
              setIsSent(true)
          }, 1000);
          toast({
              toastID,
              title: 'Addresses has been added to Sharing',
              description: "Please check explorer.",
              status: 'success',
              duration: 3000,
              isClosable: true,
          })
      }
      setIsLoading(false);
      //handle smartcontract here
    } catch (error) {
      setIsLoading(false);
      toast({
          toastID,
          title: 'An Error Occurred',
          description: error,
          status: 'error',
          duration: 3000,
          isClosable: true,
      })
      console.log(error);

    }
  };

    
  
    return (
        <Modal open={open}
      onClose={() => setOpen(false)}>
          <VStack spacing={{ base: 4, md: 8, lg: 20 }}>
              <Stack
                  spacing={{ base: 4, md: 8, lg: 20 }}
                  direction={{ base: 'column', md: 'row' }}>
                  <Box
                      bg={useColorModeValue('white', 'gray.700')}
                      borderRadius="lg"
                      p={8}
                      color={useColorModeValue('gray.700', 'whiteAlpha.900')}
                      shadow="base">
                      <VStack spacing={5}>
                          <FormControl isRequired>
                              <FormLabel>Enter Address</FormLabel>

                              <InputGroup>
                                  <Input type="text" name="address" placeholder="Your Title" ref={addressRef} required />
                              </InputGroup>
                          </FormControl>

                          <FormControl isRequired>
                              <FormLabel>Share Peers</FormLabel>

                              <Textarea
                                  name="SharedPeers"
                                  placeholder={addresses}
                                  rows={4}
                                  resize="none"
                                  readOnly
                              />
                          </FormControl>

                          
                          <Button
                          colorScheme="orange"
                          bg="orange.400"
                          color="white"
                          _hover={{
                              bg: 'orange.500',
                          }}
                          isFullWidth onClick={addAddress}
                          isLoading={isLoading}
                          isDisabled={isSent}
                          >
                          Submit
                          </Button>
                      </VStack>
                  </Box>
              </Stack>
          </VStack>
        </Modal>  
    );


  }