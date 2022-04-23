import {
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

  export default function Form() {

    useEffect(() => {
    }, []) ;

    const [cid, setCid] = useState("");
    const [ isLoading, setIsLoading ] = useState();
    const [ isSent, setIsSent ] = useState(false);
    const checkRef = useRef();
    const NamecRef = useRef();
    const descripRef = useRef();

    const toast = useToast();
    const toastID = 'toast';

    
    function randomId() {
    const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0];
    return uint32.toString(16);
    }

    
    const fileUpload = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        console.log(e.target.files);
        const file = e.target.files[0];
        const name = e.target.files[0].name;
        console.log("Filename ",name);

        const client = new Web3Storage({
        token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGQzMjJFMzhEODQ4QjJmMjk0NzhlNEYzMDkzZDA3MjdBNTgxOTgzOEIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NDk5ODE4OTM4MTksIm5hbWUiOiJETGlicmFyeSJ9.fhYbx7YC336HXY-DvRErXuxu5TMtoUAQmV-mtJyn01A",
        });

        const cid1 = await client.put(e.target.files, {
        name: name,
        maxRetries: 3,
        });

        let appendcid = cid1+"/"+name;
        console.log(appendcid);
        setIsLoading(false);
        setCid(appendcid);
    };

     //handle file upload button click
  const submitUpload = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      

      const visible = !checkRef.current.checked;

      const name = NamecRef.current.value;
      const description = descripRef.current.value;

      const category = "image";
      const sharedPeers = [];
      const createdAt = Date.now();
      const id = createdAt;
      console.log(description);
      console.log(name);
      console.log(cid);
      console.log(category);
      console.log(createdAt);
      console.log(!visible);
      console.log(sharedPeers);
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

        const UploadTxn = await dFtpContract.addFile(
            id,
            name,
            description,
            cid,
            category,
            visible,
            sharedPeers,
            createdAt,

          {
            gasLimit: 3000000,
          }
        );

        console.log("Mining...", UploadTxn.hash);
        setTimeout(() => {
              setIsSent(true)
          }, 1000);
          toast({
              toastID,
              title: 'Upload has been Submitted',
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
          description: "An Error Occurred.",
          status: 'error',
          duration: 3000,
          isClosable: true,
      })
      console.log(error);

    }
  };
  
    return (
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
                            <FormLabel>Title</FormLabel>

                            <InputGroup>
                                <Input type="text" name="name" placeholder="Your Title" ref={NamecRef} required />
                            </InputGroup>
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Description</FormLabel>

                            <Textarea
                                name="description"
                                placeholder="A Short Description"
                                rows={4}
                                resize="none"
                                required
                                ref={descripRef}
                            />
                        </FormControl>

                        <FormControl>
                            <label> Private: </label> <input type="checkbox" ref={checkRef} className="mt-4" />{" "}
                            
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Insert File</FormLabel>
                            <InputGroup>
                                <Input type="file" border={'none'} name="file"  onChange={fileUpload} />
                            </InputGroup>
                        </FormControl>

                        <Button
                        colorScheme="orange"
                        bg="orange.400"
                        color="white"
                        _hover={{
                            bg: 'orange.500',
                        }}
                        isFullWidth onClick={submitUpload}
                        isLoading={isLoading}
                        isDisabled={isSent}
                        >
                        Submit Upload
                        </Button>
                    </VStack>
                </Box>
            </Stack>
        </VStack>
    );


  }