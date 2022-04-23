//jshint esversion:8
import {
  Box,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  Button,
  useBreakpointValue,
} from "@chakra-ui/react";
import landingpage from "../assets/landingP.png";
import { useEffect, useRef, useState, useCallback } from "react";
import ArticleCard from "./ArticleCard";
import BookCard from "./BookCard";
import { useAuth } from "../context/AuthContext";
import ZuriTokenABI from ".././ABI/ZuriToken.json";
import BallotABI from ".././ABI/Voting.json";
import { ethers } from "ethers";

const images = [landingpage];
const texts = ["Secure", "Fast", "Easy Voting platform"];
const delay = 3000;

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const [newText, setnewText] = useState("");
  const timeoutRef = useRef(null);

  const [isLoading, setIsLoading] = useState();
  const [isAdmin, setIsAdmin] = useState();
  const [isChairMan, setIsChairMan] = useState();

  const [candidates, setCandidates] = useState([]);
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

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };
  const shuffle = useCallback(() => {
    const index = Math.floor(Math.random() * texts.length);
    setnewText(texts[index]);
  }, []);

  useEffect(() => {
    getElectionData();

    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        ),
      // setnewText((prevIndex) =>
      //   prevIndex === texts.length -1 ? 0 : prevIndex + 1
      // ),
      delay
    );
    const intervalID = setInterval(shuffle, 3000);

    return () => {
      resetTimeout();
      clearInterval(intervalID);
    };
  }, [index, shuffle]);

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
        (await TokenContract.balanceOf(account)).toString() /
        1000000000000000000;

      const isTeacher = await VotingContract.Admins(account, {
        gasLimit: 300000,
      });
      setIsAdmin(isTeacher);

      const chairperson = await VotingContract.chairperson({
        gasLimit: 300000,
      });

      setIsChairMan(chairperson);

      console.log(TokenBalance);

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

  return (
    <Box>
      <Stack
        minH={"100vh"}
        direction={{ base: "column", md: "row" }}
        width={"full"}
      >
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
                The New Normal Election
              </Heading>
              <br />{" "}
              <Heading color={"orange.400"} as={"span"}>
                ZuriBoard
              </Heading>{" "}
            </Heading>
            <Text fontSize={{ base: "md", lg: "lg" }} color={"gray.200"}>
              Vote for the best candidates to lead your Team
              <Text
                fontSize={"lg"}
                color={"orange.500"}
                fontWeight={700}
                letterSpacing={"2px"}
              >
                {newText}
              </Text>
            </Text>
            <Stack direction={{ base: "column", md: "row" }} spacing={4}>
              <Button
                bg="orange.700"
                color="white"
                size="md"
                _hover={{
                  bg: "orange.600",
                }}
              >
                <a href="/public">Get Started</a>
              </Button>
            </Stack>
          </Stack>
        </Flex>
        <Flex overflow="hidden" maxW={"xl"} my="0" mx="auto">
          <Flex
            flex={1}
            whiteSpace={"nowrap"}
            transition="ease 1000ms"
            style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
          >
            <Image
              display={"inline-block"}
              alt={"Login Image"}
              objectFit={"contain"}
              src={landingpage}
            />
          </Flex>
        </Flex>
      </Stack>
      {/* <Heading py={8} px={{ base: '12px', md: '18px', lg: '30px' }}>Public Library</Heading>
      <ArticleCard />
      <Heading py={8} px={{ base: '12px', md: '18px', lg: '30px' }}>Private Library</Heading>
      <BookCard /> */}
    </Box>
  );
}
