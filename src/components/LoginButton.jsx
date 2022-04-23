import React, { useEffect } from "react";
import { Button, useColorModeValue, useToast } from "@chakra-ui/react";
import {
  checkIfWalletIsConnected,
  connectWallet,
} from "../Services/walletConnections";
import { useAuth } from "../context/AuthContext";

const LoginButton = ({ name }) => {
  const bg = useColorModeValue("#E5E5E5", "orange.800");
  const toast = useToast();
  const id = "toast";

  const {
    currentAccount,
    setCurrentAccount,
    setCurrentNetwork,
    currentNetwork,
    setContractAddr,
  } = useAuth();
  const handleLogin = async () => {
    if (!window.ethereum) {
      if (!toast.isActive(id)) {
        toast({
          id,
          title: "No wallet found",
          description: "Please install Metamask",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
      return;
    }
    const _address = await connectWallet();
    setCurrentAccount(_address);
  };

  const handleOut = async () => {
    const initialCheck = async () => {
      try {
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        setCurrentNetwork(parseInt(chainId, 41));

        window.ethereum.on("chainChanged", function (chainId) {
          // Time to reload your interface with the new chainId
          setCurrentNetwork(parseInt(chainId, 41));

          window.location.reload();
        });
      } catch (err) {
        console.log(err);
      }
    };
    initialCheck();
    if (window.ethereum) {
      if (!toast.isActive(id)) {
        toast({
          id,
          title: "Try again Later",
          description: "We can not disconnect your wallet now",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
      return;
    }
  };

  useEffect(() => {
    const getAccount = async () => {
      if (!window.ethereum) {
        if (!toast.isActive(id)) {
          toast({
            id,
            title: "No wallet found",
            description: "Please install Metamask",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
        }
      } else {
        setCurrentAccount(await checkIfWalletIsConnected());
      }
    };
    getAccount();
  }, [setCurrentAccount, toast]);

  return (
    <>
      {currentAccount ? (
        <div>
          <Button bg={bg} size="lg">
            {currentAccount.substring(0, 5) +
              "...." +
              currentAccount.substring(currentAccount.length - 6)}
          </Button>
          <Button bg="white.700" color="white" onClick={handleOut}>
            LogOut
          </Button>
        </div>
      ) : (
        <Button
          bg="orange.700"
          color="white"
          size="md"
          onClick={handleLogin}
          _hover={{
            bg: "orange.600",
          }}
        >
          {name}
        </Button>
      )}
    </>
  );
};

export default LoginButton;
