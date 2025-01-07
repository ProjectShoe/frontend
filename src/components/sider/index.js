import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Image,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
// import logoMain from "../../assets/images/sider/logo-main.png";
import { enumMenu } from "../../utils/contants";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sider() {
  const [activeItems, setActiveItems] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const handleToggle = (item) => {
    setActiveItems((prev) => (prev === item.name ? null : item.name));
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <Flex flexDirection={"column"} w={{ base: "250px" }} h={"100vh"}>
      {/* Logo */}
      <Box h={{ base: "80px" }} p={"10px 78px"}>
        {/* <Image src={logoMain} /> */}
      </Box>

      {/* Menu Accordion */}
      <Accordion
        allowToggle
        w={"250px"}
        backgroundColor="var(--color-sidermain)"
      >
        {enumMenu.map((item, index) => (
          <AccordionItem
            border={"none"}
            key={index}
            backgroundColor={
              activeItems === item.name
                ? "var(--color-sidersecondary)"
                : "var(--color-sidermain)"
            }
          >
            <h2>
              <AccordionButton
                display={{ base: "flex" }}
                alignItems={"center"}
                gap={{ base: "15px" }}
                p={"12px 12px 12px 20px "}
                onClick={() => handleToggle(item)}
              >
                <Flex
                  as="span"
                  flex="1"
                  textAlign="left"
                  alignItems={"center"}
                  gap={{ base: "12px" }}
                >
                  <Image src={item.icon} />
                  <Text
                    fontSize={{ base: "15px" }}
                    fontWeight={600}
                    color="var(--color-main)"
                  >
                    {item.name}
                  </Text>
                </Flex>
                <AccordionIcon
                  color="var(--color-main)"
                  transform={
                    activeItems === item.name
                      ? "rotate(0deg)"
                      : "rotate(-90deg)"
                  }
                  transition="transform 0.2s ease-in-out"
                />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              {item.children && (
                <Box>
                  {item?.children.map((subItem, index) => (
                    <Box
                      key={index}
                      p={"12px 0px 12px 44px"}
                      cursor="pointer"
                      onClick={() => handleNavigate(subItem.path)}
                    >
                      <Text
                        fontSize={{ base: "14px" }}
                        fontWeight={500}
                        className={
                          location.pathname === subItem.path
                            ? "text-liner"
                            : "text-unclick"
                        }
                      >
                        {subItem.name}
                      </Text>
                    </Box>
                  ))}
                </Box>
              )}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Flex>
  );
}
