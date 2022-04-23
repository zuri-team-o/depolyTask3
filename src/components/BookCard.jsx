import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  useColorModeValue,
  SimpleGrid,
  useToast,
  Stack,
  useDisclosure,
  FormControl,
  FormLabel,
  VStack,
  Input,
  InputGroup,
  Box,
  Button,
  Center,
  Heading,
  Text,
  HStack,
  Image,
  IconButton,
  Link,
  Flex,
  useBreakpointValue,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
} from "@chakra-ui/react";
import { BiCloudDownload, BiShare, BiUpvote, BiBulb } from "react-icons/bi";
import Card from "./ACard";
// import Button from './button';
import Form from "./containers/Form";
import { ethers } from "ethers";

import { useAuth } from "../context/AuthContext";
import ZuriTokenABI from ".././ABI/ZuriToken.json";
import BallotABI from ".././ABI/Voting.json";

export default function BookCard() {
  const { onOpen } = useDisclosure();
  const [isOpen, setIsOpen] = React.useState();
  const [isOpen1, setIsOpen1] = React.useState();
  const onClose = () => setIsOpen(false);
  const onClose1 = () => setIsOpen1(false);
  const cancelRef1 = React.useRef();
  const cancelRef = React.useRef();

  const [isOpen2, setIsOpen2] = React.useState();
  const onClose2 = () => setIsOpen2(false);
  const cancelRef2 = React.useRef();

  const [isOpen3, setIsOpen3] = React.useState();
  const onClose3 = () => setIsOpen3(false);
  const cancelRef3 = React.useRef();

  const [isOpen4, setIsOpen4] = React.useState();
  const onClose4 = () => setIsOpen4(false);
  const cancelRef4 = React.useRef();

  const [isOpen5, setIsOpen5] = React.useState();
  const onClose5 = () => setIsOpen5(false);
  const cancelRef5 = React.useRef();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const bg = useColorModeValue("#E5E5E5", "gray.800");
  const toast = useToast();
  const toastID = "toast";

  const NamecRef = useRef();

  const electionNameRef = useRef();
  const electionDescRef = useRef();
  const addr1Ref = useRef();
  const addr2Ref = useRef();
  const addr3Ref = useRef();

  const [isLoading, setIsLoading] = useState();
  const [isAdmin, setIsAdmin] = useState();
  const [isChairMan, setIsChairMan] = useState();
  const [isSent, setIsSent] = useState(false);
  const [hasVoted, setVoted] = useState();
  const [resultOut, setResultOut] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);

  const [pcandidates, setCandidates] = useState([]);

  const [wcandidates, setWcandidates] = useState([]);

  const {
    currentAccount,
    setCurrentAccount,
    balance,
    setBalance,
    name,
    setName,
    description,
    setDescription,
    status,
    setStatus,
  } = useAuth();

  useEffect(() => {
    getElectionData();
  }, []);

  const getElectionData = async () => {
    setIsLoading(true);
    try {
      const { ethereum } = window;
      const contractAddressToken = "0x1179Ce463D8cBc197FeD634566c99F32F9d19E9b";
      const contractAddress = "0x93C33eD4Fb48C2f1693B6652d863609f137c410c";

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      const zuriTokenABI = ZuriTokenABI.abi;
      //setLoading(true);
      console.log(zuriTokenABI);
      const TokenContract = new ethers.Contract(
        contractAddressToken,
        zuriTokenABI,
        signer
      );

      const ballotABI = BallotABI.abi;
      //setLoading(true);
      console.log(ballotABI);
      const VotingContract = new ethers.Contract(
        contractAddress,
        ballotABI,
        signer
      );

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length !== 0) {
        var account = accounts[0];
        setCurrentAccount(account);
      }

      console.log(account);
      const TokenBalance =
        (await TokenContract.balanceOf(account)).toString() /
        1000000000000000000;

      const isTeacher = await VotingContract.Admins(account, {
        gasLimit: 300000,
      });
      setIsAdmin(isTeacher);

      const hasvoted = await VotingContract.voters(account, {
        gasLimit: 300000,
      });

      console.log(hasvoted[1]);
      setVoted(hasvoted[1]);

      const chairperson = await VotingContract.chairperson({
        gasLimit: 300000,
      });

      if (chairperson.toLowerCase() === account.toLowerCase()) {
        setIsChairMan(true);
      } else {
        setIsChairMan(false);
      }

      console.log(chairperson.toLowerCase());
      console.log(account.toLowerCase());
      console.log(isAdmin);

      const resultOut1 = await VotingContract.resultOut({
        gasLimit: 300000,
      });

      setResultOut(resultOut1);

      const hasCalculated = await VotingContract.calculatedResult({
        gasLimit: 300000,
      });

      setHasCalculated(hasCalculated);

      if (resultOut1) {
        /*
        I would get the result and store it
        */
        const wcandidates = await VotingContract.winningCandidate({
          gasLimit: 300000,
        });

        console.log(wcandidates);
        setWcandidates(wcandidates);
      }

      console.log(resultOut1);

      setBalance(TokenBalance);

      const candidates = await VotingContract.getCandidates({
        gasLimit: 300000,
      });

      console.log(candidates);

      const status = await VotingContract.state({
        gasLimit: 300000,
      });
      console.log(status);

      const electionName = await VotingContract.nameOfElection({
        gasLimit: 300000,
      });
      console.log(electionName);

      const electionDescription = await VotingContract.descriptionOfElection({
        gasLimit: 300000,
      });
      console.log(electionDescription);

      setCandidates(candidates);

      if (status === 0) {
        setStatus("Created");
      } else if (status === 1) {
        setStatus("Voting");
      } else if (status === 2) {
        setStatus("Voting Ended");
      }

      setName(electionName);

      setDescription(electionDescription);

      setIsLoading(false);
    } catch (error) {
      console.log("hellloooooooooooo yanick");
      console.log(error.message);
    }
    //setIsLoading(false);
  };

  const addCandidate = async () => {
    setIsLoading(true);
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const address = NamecRef.current.value;

      var name = [];

      if (!address) {
        toast({
          toastID,
          title: "Please Enter Name of Candidate",
          description: "Input Required",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      name.push(address);

      if (ethereum) {
        const contractAddress = "0x93C33eD4Fb48C2f1693B6652d863609f137c410c";
        const ballotABI = BallotABI.abi;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        //setLoading(true);
        console.log(ballotABI);
        const VotingContract = new ethers.Contract(
          contractAddress,
          ballotABI,
          signer
        );

        const addCandidatetxn = await VotingContract.addCandidates(name, {
          gasLimit: 3000000,
        });

        console.log("Mining...", addCandidatetxn.hash);
        setTimeout(() => {
          setIsSent(true);
        }, 1000);
        toast({
          toastID,
          title: "Candidate Added Successfully",
          description: "Please check explorer.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      setIsLoading(false);
      //handle smartcontract here
    } catch (error) {
      setIsLoading(false);
      toast({
        toastID,
        title: "An Error Occurred",
        description: error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.log(error);
      setIsLoading(false);
    }
  };

  const giveVotingRight = async () => {
    setIsLoading(true);
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const address = addr3Ref.current.value;

      if (!address) {
        toast({
          toastID,
          title: "Please the Address",
          description: "Input Required",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      if (ethereum) {
        const contractAddress = "0x93C33eD4Fb48C2f1693B6652d863609f137c410c";
        const ballotABI = BallotABI.abi;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        //setLoading(true);
        console.log(ballotABI);
        const VotingContract = new ethers.Contract(
          contractAddress,
          ballotABI,
          signer
        );

        const giveVotingRighttxn = await VotingContract.giveRightToVote(
          address,
          {
            gasLimit: 3000000,
          }
        );

        console.log("Mining...", giveVotingRighttxn.hash);
        setTimeout(() => {
          setIsSent(true);
        }, 1000);
        toast({
          toastID,
          title: "Voter Added Successfully",
          description: "Please check explorer.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      setIsLoading(false);
      //handle smartcontract here
    } catch (error) {
      setIsLoading(false);
      toast({
        toastID,
        title: "An Error Occurred",
        description: error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.log(error);
      setIsLoading(false);
    }
  };

  const addAdmin = async () => {
    setIsLoading(true);
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const address = addr2Ref.current.value;

      if (!address) {
        toast({
          toastID,
          title: "Please the Address",
          description: "Input Required",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      if (ethereum) {
        const contractAddress = "0x93C33eD4Fb48C2f1693B6652d863609f137c410c";
        const ballotABI = BallotABI.abi;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        //setLoading(true);
        console.log(ballotABI);
        const VotingContract = new ethers.Contract(
          contractAddress,
          ballotABI,
          signer
        );

        const addAdmintxn = await VotingContract.addAuthorized(address, {
          gasLimit: 3000000,
        });

        console.log("Mining...", addAdmintxn.hash);
        setTimeout(() => {
          setIsSent(true);
        }, 1000);
        toast({
          toastID,
          title: "Admin Added Successfully",
          description: "Please check explorer.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      setIsLoading(false);
      //handle smartcontract here
    } catch (error) {
      setIsLoading(false);
      toast({
        toastID,
        title: "An Error Occurred",
        description: error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.log(error);
      setIsLoading(false);
    }
  };

  const removeAdmin = async () => {
    setIsLoading(true);
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const address = addr2Ref.current.value;

      if (!address) {
        toast({
          toastID,
          title: "Please the Address",
          description: "Input Required",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      if (ethereum) {
        const contractAddress = "0x93C33eD4Fb48C2f1693B6652d863609f137c410c";
        const ballotABI = BallotABI.abi;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        //setLoading(true);
        console.log(ballotABI);
        const VotingContract = new ethers.Contract(
          contractAddress,
          ballotABI,
          signer
        );

        const removeAdmintxn = await VotingContract.removeAuthorized(address, {
          gasLimit: 3000000,
        });

        console.log("Mining...", removeAdmintxn.hash);
        setTimeout(() => {
          setIsSent(true);
        }, 1000);
        toast({
          toastID,
          title: "Admin removed Successfully",
          description: "Please check explorer.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      setIsLoading(false);
      //handle smartcontract here
    } catch (error) {
      setIsLoading(false);
      toast({
        toastID,
        title: "An Error Occurred",
        description: error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.log(error);
      setIsLoading(false);
    }
  };

  const calculateResult = async () => {
    setIsLoading(true);
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (ethereum) {
        const contractAddress = "0x93C33eD4Fb48C2f1693B6652d863609f137c410c";
        const ballotABI = BallotABI.abi;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        //setLoading(true);
        console.log(ballotABI);
        const VotingContract = new ethers.Contract(
          contractAddress,
          ballotABI,
          signer
        );

        const calculatetxn = await VotingContract.CalculateWinners({
          gasLimit: 3000000,
        });

        console.log("Mining...", calculatetxn.hash);
        setTimeout(() => {
          setIsSent(true);
        }, 1000);
        toast({
          toastID,
          title: "Successfully Calculate",
          description: "Please check explorer.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      setIsLoading(false);
      //handle smartcontract here
    } catch (error) {
      setIsLoading(false);
      toast({
        toastID,
        title: "An Error Occurred",
        description: error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.log(error);
      setIsLoading(false);
    }
  };

  const startVote = async () => {
    setIsLoading(true);
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (ethereum) {
        const contractAddress = "0x93C33eD4Fb48C2f1693B6652d863609f137c410c";
        const ballotABI = BallotABI.abi;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        //setLoading(true);
        console.log(ballotABI);
        const VotingContract = new ethers.Contract(
          contractAddress,
          ballotABI,
          signer
        );

        const startVotetxn = await VotingContract.startVote({
          gasLimit: 3000000,
        });

        console.log("Mining...", startVotetxn.hash);
        setTimeout(() => {
          setIsSent(true);
        }, 1000);
        toast({
          toastID,
          title: "Voting Started Successfully",
          description: "Please check explorer.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      setIsLoading(false);
      //handle smartcontract here
    } catch (error) {
      setIsLoading(false);
      toast({
        toastID,
        title: "An Error Occurred",
        description: error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.log(error);
      setIsLoading(false);
    }
  };

  const endVote = async () => {
    setIsLoading(true);
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (ethereum) {
        const contractAddress = "0x93C33eD4Fb48C2f1693B6652d863609f137c410c";
        const ballotABI = BallotABI.abi;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        //setLoading(true);
        console.log(ballotABI);
        const VotingContract = new ethers.Contract(
          contractAddress,
          ballotABI,
          signer
        );

        const endVotetxn = await VotingContract.endVote({
          gasLimit: 3000000,
        });

        console.log("Mining...", endVotetxn.hash);
        setTimeout(() => {
          setIsSent(true);
        }, 1000);
        toast({
          toastID,
          title: "Vote Successfully Ended",
          description: "Please check explorer.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      setIsLoading(false);
      //handle smartcontract here
    } catch (error) {
      setIsLoading(false);
      toast({
        toastID,
        title: "An Error Occurred",
        description: error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.log(error);
      setIsLoading(false);
    }
  };

  const RealeaseResults = async () => {
    setIsLoading(true);
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (ethereum) {
        const contractAddress = "0x93C33eD4Fb48C2f1693B6652d863609f137c410c";
        const ballotABI = BallotABI.abi;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        //setLoading(true);
        console.log(ballotABI);
        const VotingContract = new ethers.Contract(
          contractAddress,
          ballotABI,
          signer
        );

        const RealeaseResultstxn = await VotingContract.RealeaseResults({
          gasLimit: 3000000,
        });

        console.log("Mining...", RealeaseResultstxn.hash);
        setTimeout(() => {
          setIsSent(true);
        }, 1000);
        toast({
          toastID,
          title: "Result Successfully Published",
          description: "Please check explorer.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      setIsLoading(false);
      //handle smartcontract here
    } catch (error) {
      setIsLoading(false);
      toast({
        toastID,
        title: "An Error Occurred",
        description: error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.log(error);
      setIsLoading(false);
    }
  };

  const setUpElection = async () => {
    setIsLoading(true);
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const electionName = electionNameRef.current.value;
      const electionDesc = electionDescRef.current.value;

      var name = [];

      if (!electionName || !electionDesc) {
        toast({
          toastID,
          title: "Input Value is required",
          description: "Input Required",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      name.push(electionName);
      name.push(electionDesc);

      if (ethereum) {
        const contractAddress = "0x93C33eD4Fb48C2f1693B6652d863609f137c410c";
        const ballotABI = BallotABI.abi;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        //setLoading(true);
        console.log(ballotABI);
        const VotingContract = new ethers.Contract(
          contractAddress,
          ballotABI,
          signer
        );

        const setUpElectionstxn = await VotingContract.setUpElections(
          name,
          [],
          {
            gasLimit: 3000000,
          }
        );

        console.log("Mining...", setUpElectionstxn.hash);
        setTimeout(() => {
          setIsSent(true);
        }, 1000);
        toast({
          toastID,
          title: "Election has been SetUp Successfully",
          description: "Please check explorer.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      setIsLoading(false);
      //handle smartcontract here
    } catch (error) {
      setIsLoading(false);
      toast({
        toastID,
        title: "An Error Occurred",
        description: error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <AlertDialog
        isOpen={isOpen2}
        leastDestructiveRef={cancelRef2}
        onClose={onClose2}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Setup Elections
            </AlertDialogHeader>

            <AlertDialogBody>
              <SimpleGrid columns={{ sm: 1, md: 1, lg: 1 }} gap={1}>
                <Box
                  bg={useColorModeValue("white", "gray.700")}
                  borderRadius="lg"
                  p={8}
                  color={useColorModeValue("gray.700", "whiteAlpha.900")}
                  shadow="base"
                >
                  <VStack spacing={5}>
                    <FormControl isRequired>
                      <FormLabel>Election Name</FormLabel>

                      <InputGroup>
                        <Input
                          type="text"
                          name="name"
                          placeholder="Election Name"
                          ref={electionNameRef}
                          required
                        />
                      </InputGroup>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Election Description</FormLabel>

                      <InputGroup>
                        <Input
                          type="text"
                          name="name"
                          placeholder="Description"
                          ref={electionDescRef}
                          required
                        />
                      </InputGroup>
                    </FormControl>

                    <Button
                      colorScheme="orange"
                      bg="orange.400"
                      color="white"
                      _hover={{
                        bg: "orange.500",
                      }}
                      isFullWidth
                      onClick={setUpElection}
                      isLoading={isLoading}
                      isDisabled={isSent}
                    >
                      SetUp Election
                    </Button>
                  </VStack>
                </Box>
              </SimpleGrid>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef2} onClick={onClose2}>
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog
        isOpen={isOpen1}
        leastDestructiveRef={cancelRef1}
        onClose={onClose1}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Add Candidate
            </AlertDialogHeader>

            <AlertDialogBody>
              <SimpleGrid columns={{ sm: 1, md: 1, lg: 1 }} gap={1}>
                <Box
                  bg={useColorModeValue("white", "gray.700")}
                  borderRadius="lg"
                  p={8}
                  color={useColorModeValue("gray.700", "whiteAlpha.900")}
                  shadow="base"
                >
                  <VStack spacing={5}>
                    <FormControl isRequired>
                      <FormLabel>Candidate Name</FormLabel>

                      <InputGroup>
                        <Input
                          type="text"
                          name="name"
                          placeholder="Name of Candidate"
                          ref={NamecRef}
                          required
                        />
                      </InputGroup>
                    </FormControl>

                    <Button
                      colorScheme="orange"
                      bg="orange.400"
                      color="white"
                      _hover={{
                        bg: "orange.500",
                      }}
                      isFullWidth
                      onClick={addCandidate}
                      isLoading={isLoading}
                      isDisabled={isSent}
                    >
                      Add Candidate
                    </Button>
                  </VStack>
                </Box>
              </SimpleGrid>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef1} onClick={onClose1}>
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog
        isOpen={isOpen3}
        leastDestructiveRef={cancelRef3}
        onClose={onClose3}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Remove Address
            </AlertDialogHeader>

            <AlertDialogBody>
              <SimpleGrid columns={{ sm: 1, md: 1, lg: 1 }} gap={1}>
                <Box
                  bg={useColorModeValue("white", "gray.700")}
                  borderRadius="lg"
                  p={8}
                  color={useColorModeValue("gray.700", "whiteAlpha.900")}
                  shadow="base"
                >
                  <VStack spacing={5}>
                    <FormControl isRequired>
                      <FormLabel>Enter Address</FormLabel>

                      <InputGroup>
                        <Input
                          type="text"
                          name="name"
                          placeholder="Address of Admin"
                          ref={addr1Ref}
                          required
                        />
                      </InputGroup>
                    </FormControl>

                    <Button
                      colorScheme="orange"
                      bg="orange.400"
                      color="white"
                      _hover={{
                        bg: "orange.500",
                      }}
                      isFullWidth
                      onClick={removeAdmin}
                      isLoading={isLoading}
                      isDisabled={isSent}
                    >
                      Remove Admin
                    </Button>
                  </VStack>
                </Box>
              </SimpleGrid>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef3} onClick={onClose3}>
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog
        isOpen={isOpen4}
        leastDestructiveRef={cancelRef4}
        onClose={onClose4}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Add Admin
            </AlertDialogHeader>

            <AlertDialogBody>
              <SimpleGrid columns={{ sm: 1, md: 1, lg: 1 }} gap={1}>
                <Box
                  bg={useColorModeValue("white", "gray.700")}
                  borderRadius="lg"
                  p={8}
                  color={useColorModeValue("gray.700", "whiteAlpha.900")}
                  shadow="base"
                >
                  <VStack spacing={5}>
                    <FormControl isRequired>
                      <FormLabel>Address</FormLabel>

                      <InputGroup>
                        <Input
                          type="text"
                          name="name"
                          placeholder="Address of Admin"
                          ref={addr2Ref}
                          required
                        />
                      </InputGroup>
                    </FormControl>

                    <Button
                      colorScheme="orange"
                      bg="orange.400"
                      color="white"
                      _hover={{
                        bg: "orange.500",
                      }}
                      isFullWidth
                      onClick={addAdmin}
                      isLoading={isLoading}
                      isDisabled={isSent}
                    >
                      Add Admin
                    </Button>
                  </VStack>
                </Box>
              </SimpleGrid>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef4} onClick={onClose4}>
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog
        isOpen={isOpen5}
        leastDestructiveRef={cancelRef5}
        onClose={onClose5}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Add Voter
            </AlertDialogHeader>

            <AlertDialogBody>
              <SimpleGrid columns={{ sm: 1, md: 1, lg: 1 }} gap={1}>
                <Box
                  bg={useColorModeValue("white", "gray.700")}
                  borderRadius="lg"
                  p={8}
                  color={useColorModeValue("gray.700", "whiteAlpha.900")}
                  shadow="base"
                >
                  <VStack spacing={5}>
                    <FormControl isRequired>
                      <FormLabel>Address</FormLabel>

                      <InputGroup>
                        <Input
                          type="text"
                          name="name"
                          placeholder="Address of Voter"
                          ref={addr3Ref}
                          required
                        />
                      </InputGroup>
                    </FormControl>

                    <Button
                      colorScheme="orange"
                      bg="orange.400"
                      color="white"
                      _hover={{
                        bg: "orange.500",
                      }}
                      isFullWidth
                      onClick={giveVotingRight}
                      isLoading={isLoading}
                      isDisabled={isSent}
                    >
                      Add Voter
                    </Button>
                  </VStack>
                </Box>
              </SimpleGrid>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef5} onClick={onClose5}>
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {isAdmin || isChairMan ? (
        <Stack px={8} w={"full"}>
          <Stack direction="row" py={1} spacing={2}>
            <Text>Election Status:</Text>
            <Button
              bg="green.700"
              color="white"
              isActive={false}
              isDisabled={true}
              //onClick={onOpen}
              size="sm"
              colorScheme="teal"
              variant="outline"
            >
              {status}
            </Button>
          </Stack>

          <Stack direction="row" py={1} spacing={4}>
            <Text>Token Balance:</Text>
            <Button
              bg="green.700"
              color="white"
              isActive={false}
              isDisabled={true}
              //onClick={onOpen}
              size="sm"
              colorScheme="teal"
              variant="outline"
            >
              {balance} ZuriToken
            </Button>
          </Stack>

          <Stack direction="row" py={1} spacing={4}>
            <Text>Result:</Text>
            <Button
              bg="green.700"
              color="white"
              size="sm"
              colorScheme="teal"
              variant="outline"
              isActive={resultOut}
              isDisabled={!resultOut}
              onClick={() => setIsOpen(true)}
            >
              {resultOut ? "Show Results" : "Results not available"}
            </Button>
            <Button
              bg="green.700"
              color="white"
              colorScheme="teal"
              variant="outline"
              isDisabled={status != "Voting Ended" || hasCalculated}
              isActive={!hasCalculated}
              onClick={() => {
                calculateResult();
              }}
              size="sm"
            >
              Calculate Result
            </Button>
          </Stack>

          <Flex py={2} px={8} flex={1} align={"center"} justify={"center"}>
            <Stack spacing={6} w={"full"} maxW={"lg"}>
              <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}>
                <Heading color={"orange.400"} as={"span"}>
                  Name: {name}
                </Heading>{" "}
              </Heading>
              <Text fontSize={{ base: "md", lg: "lg" }} color={"gray.200"}>
                Description: {description}
              </Text>
              <Stack direction={{ base: "column", md: "row" }} spacing={4}>
                <Button
                  bg="orange.700"
                  color="white"
                  size="md"
                  isDisabled={status != "Created" && status != "Voting Ended"}
                  onClick={() => setIsOpen1(true)}
                  _hover={{
                    bg: "orange.600",
                  }}
                >
                  {status === "Created" ? "Add Candidate" : status}
                </Button>

                <Button
                  bg="orange.700"
                  color="white"
                  size="md"
                  isDisabled={
                    !(status === "Created" || status === "Voting Ended")
                  }
                  onClick={() => setIsOpen2(true)}
                  _hover={{
                    bg: "orange.600",
                  }}
                >
                  SetUp Elections
                </Button>
              </Stack>
            </Stack>

            {isChairMan ? (
              <List>
                <ListItem py={2} px={4} flex={1}>
                  ChairMan Controls
                </ListItem>
                <ListItem py={1}>
                  <Button
                    bg="orange.700"
                    color="white"
                    size="md"
                    isDisabled={
                      status === "Voting" || status === "Voting Ended"
                    }
                    onClick={() => {
                      startVote();
                    }}
                    _hover={{
                      bg: "orange.600",
                    }}
                  >
                    Start Voting
                  </Button>
                </ListItem>
                <ListItem py={1}>
                  <Button
                    bg="orange.700"
                    color="white"
                    size="md"
                    isDisabled={
                      status === "Created" || status === "Voting Ended"
                    }
                    onClick={() => {
                      endVote();
                    }}
                    _hover={{
                      bg: "orange.600",
                    }}
                  >
                    End Voting
                  </Button>
                </ListItem>
                <ListItem py={1}>
                  <Button
                    bg="orange.700"
                    color="white"
                    size="md"
                    isDisabled={
                      status === "Created" || status === "Voting" || resultOut
                    }
                    onClick={RealeaseResults}
                    _hover={{
                      bg: "orange.600",
                    }}
                  >
                    Release Result
                  </Button>
                </ListItem>
                <ListItem py={1}>
                  <Button
                    bg="orange.700"
                    color="white"
                    size="md"
                    onClick={() => setIsOpen5(true)}
                    _hover={{
                      bg: "orange.600",
                    }}
                  >
                    Add Voter
                  </Button>
                </ListItem>
                <ListItem py={1}>
                  <Button
                    bg="orange.700"
                    color="white"
                    size="md"
                    onClick={() => setIsOpen4(true)}
                    _hover={{
                      bg: "orange.600",
                    }}
                  >
                    Add Admins
                  </Button>
                </ListItem>
                <ListItem py={1}>
                  <Button
                    bg="orange.700"
                    color="white"
                    size="md"
                    onClick={() => setIsOpen3(true)}
                    _hover={{
                      bg: "orange.600",
                    }}
                  >
                    Remove Admins
                  </Button>
                </ListItem>
              </List>
            ) : (
              <></>
            )}
          </Flex>

          <SimpleGrid columns={{ sm: 1, md: 1, lg: 1 }} gap={2}>
            {pcandidates.map((item, index) => {
              return (
                <Center
                  py={1}
                  px={0}
                  direction={{ base: "column", md: "row" }}
                  key={index}
                >
                  <Box
                    maxW={"400px"}
                    w={"100%"}
                    bg={("white", "white")}
                    boxShadow={"2x2"}
                    rounded={"md"}
                    overflow={"hidden"}
                  >
                    <Box px={1} py={2}>
                      <Stack
                        flex
                        justifyContent="space-between"
                        flexDirection="row"
                        alignItems="center"
                      >
                        <Stack>
                          <Heading
                            color={"orange.500"}
                            fontSize={"2xl"}
                            fontFamily={"body"}
                          >
                            Name: {item[1].toString()}
                          </Heading>

                          <Text color={"gray.500"}>
                            {"Candidate ID: " + item[0].toString()}
                          </Text>
                        </Stack>
                      </Stack>
                    </Box>
                  </Box>
                </Center>
              );
            })}
            {/* <Card /> */}
          </SimpleGrid>
        </Stack>
      ) : (
        <> </>
      )}
    </>
  );
}
