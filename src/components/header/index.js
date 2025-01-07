import {
  Avatar,
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../redux/slices/apiRequestsSlice";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login?.currentUser);
  const handleLogout = () => {
    logOut(dispatch, navigate);
    console.log("hahaha");
  };
  return (
    <Flex
      width={"100%"}
      h={{ base: "80px" }}
      justifyContent={"flex-end"}
      borderBottom={"0.5px solid var(--color-boder)"}
    >
      <Box p={"15px 32px"}>
        <Flex
          alignItems={"center"}
          justifyContent={"flex-end"}
          gap={{ base: "32px" }}
        >
          <Flex alignItems={"center"} gap={{ base: "16px" }}>
            <Avatar
              w={{ base: "50px" }}
              h={{ base: "50px" }}
              borderRadius={{ base: "50%" }}
            />
            <Flex gap={{ base: "6px" }} flexDirection={{ base: "column" }}>
              <Menu>
                <MenuButton>
                  <Text fontSize={{ base: "16px" }} fontWeight={600}>
                    {user?.username}
                  </Text>
                  <Text fontSize={{ base: "14px" }} fontWeight={500}>
                    {user?.isAdmin === true ? "Quản lý" : "Nhân viên"}
                  </Text>
                </MenuButton>
                <MenuList
                  fontSize={{ base: "14px" }}
                  fontWeight={500}
                  lineHeight={"140%"}
                  color={"var(--color-info-employee)"}
                >
                  <MenuItem gap={"16px"} onClick={handleLogout}>
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
}
