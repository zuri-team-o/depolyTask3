import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  useColorModeValue,
  SimpleGrid,
  useToast, Stack, useDisclosure,
  Box,
  Button,
  Center,
  Heading,
  Text,
  HStack,
  Image,
  IconButton,
  Link,
  FormControl,
    FormLabel,
    VStack,
    Input,
    InputGroup,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { BiDownvote, BiShare, BiUpvote, BiBulb } from 'react-icons/bi';

import SharingForm from './containers/SharingForm';
// import Button from './button';
import Form from './containers/Form';
import { useAuth } from '../context/AuthContext';
import { ethers } from 'ethers';

import DftpABI from '../ABI/Dftp.json';

export default function MyFilesCard() {
  const { isOpen, onOpen, onClose, isOpen2, onOpen2, onClose2 } = useDisclosure();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const bg = useColorModeValue("#E5E5E5", "gray.800");
  const toast = useToast();
  const toastID = 'toast';

  const [isLoading, setIsLoading] = useState()
  const [isApproved, setIsApproved] = useState(false)
  const [pData, setPdata] = useState([]);
  const [isSent, setIsSent] = useState(false);
  const addressRef = useRef();
  const checkRef = useRef();

  useEffect(() => {
    getPublic();

  }, []);



  const getPublic = async () => {
    setIsLoading(true);
    try {
      const { ethereum } = window;
      const contractAddress = "0xb20fbd2A9e9db2ce827BB3d3e02CF627d6660CB9";
      const dftpABI = DftpABI.abi;
      setIsLoading(true);
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      console.log(contractAddress);
      console.log(dftpABI);
      const dFtpContract = new ethers.Contract(
        contractAddress,
        dftpABI,
        signer
      );
      console.log("yanick");
      const publicData = await dFtpContract.getAllMyUploadedFiles({
        gasLimit: 300000,
      });

      var data = [];
      console.log(publicData);
      for (let i = 0; i < publicData.length; i++) {
        if (publicData[i][0] != 0) {
          data.push(publicData[i]);
        }
      }
      setPdata(data);

      setIsLoading(false);
    } catch (error) {
      console.log("yanick");
      console.log(error);
      console.log(error.message);
    }
    setIsLoading(false);
  };

  function handleChange(event) {
    let name = event.target.name;
    let value = event.target.value; 
    addressRef.current.value = value;
    console.log(event.target.value);
  }

  const removeAddress = async (_id) => {

    setIsLoading(true);
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });


      const address = addressRef.current.value;// address to be removed

      if(!address) {
            toast({
                toastID,
                title: 'No Valid address',
                description: "Please input correct value for address",
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            return;
      }

      var myArray = [address];
      const id = _id;
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

        const removeAddressTxn = await dFtpContract.removeSharedPeers(
          id,
          myArray,

          {
            gasLimit: 3000000,
          }
        );

        console.log("Mining...", removeAddressTxn.hash);
        setTimeout(() => {
          setIsSent(true)
        }, 1000);
        toast({
          toastID,
          title: 'Addresses has been removed from Sharing',
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

  const addAddress = async (_id) => {

    const address = addressRef.current.value;

    setIsLoading(true);
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });


      // const address = addressRef.current.value;// address to be removed
      console.log(address);
      console.log(addressRef[_id]);

      if(!address) {
            toast({
                toastID,
                title: 'No Valid address',
                description: "Please input correct value for address",
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            return;
      }
      var myArray = [address];
      const id = _id;
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

  const changeVisibility = async (_id, visible) => {

    setIsLoading(true);
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });


      const id = _id;
      console.log(visible);
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

        const changeVisibilityTxn = await dFtpContract.changeVisibility(
          id,
          visible,

          {
            gasLimit: 3000000,
          }
        );

        console.log("Mining...", changeVisibilityTxn.hash);
        setTimeout(() => {
          setIsSent(true)
        }, 1000);
        toast({
          toastID,
          title: 'Visibility Status has been changed',
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
    <Stack px={4} w={'full'}>
      <Box px={{ base: '4px', md: '18px' }}>
        <br></br>
        <Button
          bg="orange.700" color="white"
          onClick={onOpen}
          size="md"
          _hover={{
            bg: "orange.600"
          }}
        >
          Add New Item
        </Button>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Info</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Form />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
          <br></br>
      <Box px={{ base: '4px', md: '18px' }} 
                maxW={'400px'}
                w={'100%'}>
        <VStack spacing={5}>
              <FormControl>
                  <FormLabel> Sharing Options. Enter Address</FormLabel>

                  <InputGroup>
                      <Input type="text" name="address" placeholder="Enter Your address" onChange={handleChange}  ref={addressRef}  />
                  </InputGroup>
              </FormControl>

          </VStack>
      </Box>

      
      <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} gap={4}>
        {pData.map((item, index) => {
          return (
            <Center py={6} direction={{ base: 'column', md: 'row' }} key={index}>
              <Box
                maxW={'400px'}
                w={'100%'}
                // bg={useColorModeValue('white', 'gray.900')}
                boxShadow={'2xl'}
                rounded={'md'}
                overflow={'hidden'}>
                <Image
                  src={`https://ipfs.io/ipfs/${item[3]}`}
                  layout={'cover'}
                />

                <Box px={6} py={4}>
                  <Stack>
                    <Link href={`https://ipfs.io/ipfs/${item[3]}`}>
                      <Heading
                        color={'orange.500'}
                        fontSize={'2xl'}
                        fontFamily={'body'}>
                        {item[1]}
                      </Heading>
                    </Link>
                    <Text color={'gray.500'}>
                      {item[2]}
                    </Text>
                    <Text color={'gray.500'}>
                      {'Created Date: '+new Date(+item[8]).toLocaleString()}
                    </Text>

                    <Text color={'gray.500'}>
                      {item[6] ?
                        "Status : Public"
                        :
                        " Status: Private"
                      }
                    </Text>
                    
                    <Text color={'gray.500'}>
                      Sharing to: 
                        {item[7].length>0 ?
                        '\n'+item[7].toString()
                        :
                        " Nobody"
                      }
                    </Text>
                  </Stack>
                  
                  <HStack
                    mt={{ lg: 10, md: 10 }}
                    spacing={5}
                    px={5}
                    alignItems="flex-start"
                    justifyContent={'space-between'}
                  >
                    <Flex alignItems={'center'} direction={'row'} justifyContent={'center'} fontWeight='700'>
                      <IconButton
                        onClick={() => { changeVisibility(item[0], !item[6]); }}
                        aria-label="share"
                        isRound={true}
                        _hover={{ bg: 'orange.700' }}
                        variant="ghost"
                        tooltip="Change Visibility Status"
                        size="lg"
                        icon={<BiBulb size="28px" />}
                      />
                    </Flex>
                    <Flex alignItems={'center'} direction={'row'} justifyContent={'center'} fontWeight='700'>

                      <IconButton
                        aria-label="download"
                        variant="ghost"
                        size="lg"
                        onClick={() => { removeAddress(item[0]); }}
                        isRound={true}
                        _hover={{ bg: 'orange.700' }}
                        icon={<BiDownvote size="28px" />}
                      />

                    </Flex>



                    <IconButton
                      aria-label="upload"
                      variant="ghost"
                      size="lg"
                      onClick={() => { addAddress(item[0], index); }}
                      tooltip="Add Peer from Sharing"
                      isRound={true}
                      _hover={{ bg: 'orange.700' }}
                      icon={<BiUpvote size="28px" />}
                    />

                  </HStack>
                    
                </Box>
                
              </Box>
            </Center>

          );
        })}
        {/* <Card /> */}
      </SimpleGrid>


    </Stack>
  );
}