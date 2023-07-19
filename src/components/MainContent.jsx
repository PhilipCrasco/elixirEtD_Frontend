import { Flex, Table, Text, Th, Thead } from "@chakra-ui/react";
import React from "react";
import { Outlet } from "react-router-dom";

const MainContent = () => {
  return (
    <Flex w="full" h="100vh" bg="form">
      <Outlet />
    </Flex>

    // <div>MainContent</div>
  );
};

export default MainContent;
