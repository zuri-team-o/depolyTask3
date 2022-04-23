import React, { useState, useEffect, useCallback } from "react";
import "@fontsource/raleway/700.css";
import "@fontsource/open-sans/700.css";
import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  useDisclosure,
  useColorModeValue,
  Stack,
  Text,
  Heading,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import Button from "./LoginButton";

import BallotABI from ".././ABI/Voting.json";

import { ethers } from "ethers";

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isAdmin, setIsAdmin] = useState();
  const [isChairMan, setIsChairMan] = useState();
  const [account, setAccount] = useState();

  useEffect(() => {
    accessControl();
  }, []);

  const accessControl = async () => {
    try {
      const { ethereum } = window;
      const contractAddress = "0x93C33eD4Fb48C2f1693B6652d863609f137c410c";

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

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
      setAccount(account);
      const isTeacher = await VotingContract.Admins(account, {
        gasLimit: 300000,
      });
      setIsAdmin(isTeacher);

      const chairperson = await VotingContract.chairperson({
        gasLimit: 300000,
      });

      if (chairperson.toLowerCase() === account.toLowerCase()) {
        setIsChairMan(true);
      } else {
        setIsChairMan(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          {/* <HStack spacing={8} alignItems={'center'}>
            
          </HStack> */}
          <Link
            href="/"
            fontSize={"3xl"}
            _hover={{
              textDecoration: "none",
              color: "gray.500",
            }}
          >
            <Heading>ZuriBoard</Heading>
          </Link>
          <HStack
            fontSize={"xl"}
            as={"nav"}
            spacing={4}
            display={{ base: "none", md: "flex" }}
          >
            <Link
              px={2}
              py={1}
              rounded={"md"}
              _hover={{
                textDecoration: "none",
                bg: "gray.700",
              }}
              key="Voting Portal"
              href="/public"
            >
              <Text>Voting Portal</Text>
            </Link>

            {isAdmin || isChairMan ? (
              <Link
                px={2}
                py={1}
                rounded={"md"}
                _hover={{
                  textDecoration: "none",
                  bg: "gray.700",
                }}
                key="Admin"
                href="/private"
              >
                <Text>Admin</Text>
              </Link>
            ) : (
              <></>
            )}
          </HStack>
          <Flex alignItems={"center"}>
            <Button name="Connect wallet" />
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default Navbar;
