import React from "react";
import Header from "../components/header";
import { Box, Flex } from "@chakra-ui/react";
import Sider from "../components/sider";

const AppLayout = ({ children }) => {
  return (
    <>
      <>{children}</>
    </>
  );
};

const DefaultLayout = ({ children }) => {
  return (
    <>
      <Flex h={"100%"} alignItems="stretch">
        <Box w={"250px"} backgroundColor="var(--color-sidermain)">
          <Sider />
        </Box>
        <Box w="calc(100% - 250px)" h="100%">
          <Header />
          <AppLayout>{children}</AppLayout>
        </Box>
      </Flex>
    </>
  );
};

export default DefaultLayout;
