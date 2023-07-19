import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import request from "../services/ApiClient";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";

//Toast
import { ToastComponent } from "./Toast";
import { saltKey } from "../saltkey";
import { VscEye, VscEyeClosed } from "react-icons/vsc";

const Login = () => {
  var [username, setUsername] = useState("");
  var [password, setPassword] = useState("");
  var navigate = useNavigate();
  var [Loader, setLoader] = useState(false);
  const toast = useToast();
  // const user = decodeUser()
  const { isOpen, onOpen, onClose } = useDisclosure();

  const submitHandler = async (event, user) => {
    event.preventDefault();

    var login = { username, password };

    if ((username || password) === "") {
      return ToastComponent(
        "Login Error",
        "Username and Password is required!",
        "error",
        toast
      );
    } else if ((username && password) === "") {
      return ToastComponent(
        "Login Error",
        "Please fill up username or password!",
        "error",
        toast
      );
    } else {
      setLoader(true);
      var response = await request
        .post("Login/authenticate", login)
        .then((response) => {
          var ciphertext = CryptoJS.AES.encrypt(
            JSON.stringify(response?.data),
            saltKey
          ).toString();
          sessionStorage.setItem("userToken", ciphertext);
          setLoader(false);
          navigate("/");
          window.location.reload(false);
          ToastComponent(
            "Login Success",
            `Welcome to Elixir ETD! ${response?.data.fullName}`,
            "success",
            toast
          );
        })
        .catch((err) => {
          ToastComponent("Login", err.response.data.message, "error", toast);
          setLoader(false);
        });
      // if (login.username === login.password) {
      //   // console.log(login.username, "", login.password);
      //   onOpen();
      // } else {

      // }
    }
  };

  return (
    <Flex h="100vh" justifyContent="center" alignItems="center" bg="background">
      <Box
        w={["full", "sm"]}
        p={[8, 8]}
        mt={[20, "10vh"]}
        mx="auto"
        borderRadius={10}
        alignItems="center"
        justifyContent="center"
        className="form-color"
        boxShadow="lg"
      >
        <VStack spacing={8} align="flex-start" w="full">
          <VStack spacing={-1} align={["flex", "center"]} w="full">
            <Image
              boxSize="100px"
              objectFit="fill"
              src="/images/elixirlogos.png"
              alt="etheriumlogo"
            />
            <Heading fontSize="3xl" className="logo-text">
              Elixir ETD
            </Heading>
            {/* <Text fontSize="12px" color="#fff">
              Enter your username and password to login
            </Text> */}
          </VStack>

          <Flex flexDirection="column" w="full">
            <form onSubmit={submitHandler}>
              <Text color="#fff" fontSize="13px">
                Username
              </Text>
              <Input
                placeholder="Enter username"
                rounded="none"
                variant="outline"
                borderColor="whiteAlpha.300"
                fontSize="xs"
                color="#fff"
                // bg="#1A202C"
                _hover={{ bg: "#1A202C" }}
                onChange={(event) => {
                  setUsername(event.target.value);
                }}
              />
              <Text color="#fff" fontSize="13px">
                Password
              </Text>
              <Input
                placeholder="Enter password"
                rounded="none"
                variant="outline"
                type="password"
                color="#fff"
                borderColor="whiteAlpha.300"
                // bg="#1A202C"
                _hover={{ bg: "#1A202C" }}
                fontSize="xs"
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
              />
              <Button
                borderRadius="none"
                fontSize="13px"
                type="submit"
                colorScheme="blue"
                w="full"
                mt={5}
                isLoading={Loader}
                disabled={!username || !password}
              >
                Login
              </Button>

              {<ModalChangePassword isOpen={isOpen} onClose={onClose} />}
            </form>
          </Flex>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Login;

const ModalChangePassword = (props) => {
  const { isOpen, onClose } = props;

  return (
    <>
      {/* <Button onClick={onOpen}>Open Modal</Button> */}

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="xs"
            textAlign="center"
            bg="primary"
            // className="form-color"
            color="white"
          >
            Change Password
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody>
            <Box pl={2}>
              <Text fontSize="sm" fontWeight="semibold">
                Current Password:
              </Text>
              <Input fontSize="14px" />
            </Box>

            <Box pl={2}>
              <Text fontSize="sm" fontWeight="semibold">
                New Password:
              </Text>
              <InputGroup>
                <Input fontSize="14px" autoComplete="off" />
                <InputRightElement>
                  <Button bg="none" size="sm"></Button>
                </InputRightElement>
              </InputGroup>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose} size="sm">
              Submit
            </Button>
            <Button variant="ghost" size="sm">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
