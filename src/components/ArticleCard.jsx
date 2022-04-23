import React, { useState, useEffect, useCallback } from "react";
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
} from "@chakra-ui/react";
import { BiCloudDownload, BiShare, BiUpvote, BiBulb } from "react-icons/bi";
import Card from "./ACard";
// import Button from './button';
import Form from "./containers/Form";
import { ethers } from "ethers";

import { useAuth } from "../context/AuthContext";
import ZuriTokenABI from ".././ABI/ZuriToken.json";
import BallotABI from ".././ABI/Voting.json";

export default function ArticleCard() {
  const { onOpen } = useDisclosure();
  const [isOpen, setIsOpen] = React.useState();
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const bg = useColorModeValue("#E5E5E5", "gray.800");
  const toast = useToast();
  const toastID = "toast";

  const [isLoading, setIsLoading] = useState();
  const [isAdmin, setIsAdmin] = useState();
  const [isChairMan, setIsChairMan] = useState();
  const [isSent, setIsSent] = useState(false);
  const [hasVoted, setVoted] = useState();
  const [resultOut, setResultOut] = useState(false);

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
      }

      console.log(account);
      const TokenBalance =
        (await TokenContract.balanceOf(account)) / 1000000000000000000;

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

      const resultOut1 = await VotingContract.resultOut({
        gasLimit: 300000,
      });

      setResultOut(resultOut1);

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
      console.log(error.message);
    }
    setIsLoading(false);
  };

  const vote = async (_id) => {
    setIsLoading(true);
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (status !== "Voting" || hasVoted) {
        toast({
          toastID,
          title: "Voting not yet active or you have voted already",
          description: "Voting has not started",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const id = _id;
      console.log(id);

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

        const votingtxn = await VotingContract.vote(id, {
          gasLimit: 3000000,
        });

        console.log("Mining...", votingtxn.hash);
        setTimeout(() => {
          setIsSent(true);
        }, 1000);
        toast({
          toastID,
          title: "Thanks for Voting",
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
    }
  };

  return (
    <Stack px={4} w={"full"}>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Winner(s)
            </AlertDialogHeader>

            <AlertDialogBody>
              <SimpleGrid columns={{ sm: 1, md: 1, lg: 1 }} gap={1}>
                {wcandidates.map((item, index) => {
                  return (
                    <Center
                      py={1}
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
                        <Box px={6} py={4}>
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

                              <Text color={"gray.500"}>
                                {"Vote Counts: " + item[2].toString()}
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
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

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
        <Text>Voting Status:</Text>
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
          {hasVoted ? "You have Voted" : "Not yet Voted"}
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
      </Stack>

      <Flex py={8} px={8} flex={1} align={"center"} justify={"center"}>
        <Stack spacing={6} w={"full"} maxW={"lg"}>
          <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}>
            <Heading
              as={"span"}
              position={"relative"}
              _after={{
                content: "''",
                width: "full",
                height: useBreakpointValue({ base: "20%", md: "30%" }),
                position: "absolute",
                bottom: 1,
                left: 0,
                zIndex: -1,
              }}
            >
              ZuriBoard
            </Heading>
            <br />{" "}
            <Heading color={"orange.400"} as={"span"}>
              {name}
            </Heading>{" "}
          </Heading>
          <Text fontSize={{ base: "md", lg: "lg" }} color={"gray.200"}>
            {description}
          </Text>
          <Stack direction={{ base: "column", md: "row" }} spacing={4}>
            <Button
              bg="orange.700"
              color="white"
              size="md"
              isDisabled={hasVoted}
              onClick={onOpen}
              _hover={{
                bg: "orange.600",
              }}
            >
              {hasVoted
                ? "You have already voted"
                : "Cast your Vote now our favorite Candidate"}
            </Button>
          </Stack>
        </Stack>
      </Flex>

      <SimpleGrid columns={{ sm: 1, md: 1, lg: 1 }} gap={2}>
        {pcandidates.map((item, index) => {
          return (
            <Center
              py={6}
              direction={{ base: "column", md: "row" }}
              key={index}
            >
              <Box
                maxW={"400px"}
                w={"100%"}
                bg={("white", "white")}
                boxShadow={"2xl"}
                rounded={"md"}
                overflow={"hidden"}
              >
                <Box px={6} py={4}>
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
                      {resultOut ? (
                        <Text color={"gray.500"}>
                          {"Vote Counts: " + item[2].toString()}
                        </Text>
                      ) : (
                        <></>
                      )}
                    </Stack>
                    <Button
                      bg="red.700"
                      color="white"
                      //onClick={onOpen}
                      onClick={() => {
                        vote(item[0]);
                      }}
                      isDisabled={hasVoted || status != "Voting"}
                      size="md"
                      _hover={{
                        bg: "orange.600",
                      }}
                    >
                      Vote
                    </Button>
                  </Stack>
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
