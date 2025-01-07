import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Button,
  Spinner,
  Flex,
  Text,
} from "@chakra-ui/react";

import { CiSearch } from "react-icons/ci";
import { IoCheckmarkOutline } from "react-icons/io5";
import useDebounce from "../../hooks/useDebounce";

const SearchableSelect = ({
  options,
  initialSelectedOption,
  isShowSearch,
  setValue,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(initialSelectedOption);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, [debouncedSearchTerm]);

  //   const filteredOptions = useMemo(() => {
  //     return options.filter((option) => {
  //       const op = normalize(option?.value);
  //       const searchTerms = normalize(debouncedSearchTerm);
  //       return op.includes(searchTerms);
  //     });
  //   }, [debouncedSearchTerm, options]);
  return (
    <Box maxW={"184px"} borderRadius={"12px"} height={"44px"}>
      <Menu matchWidth>
        <MenuButton
          _active={{
            border: "1px solid var(--color-option-employee-hover)",
          }}
          _hover={{
            boxShadow: "none",
          }}
          h={"44px"}
          as={Button}
          //   rightIcon={<ChevronDownIcon color={"#000"} />}
          w="100%"
          backgroundColor="#FFF"
          border={"1px solid var(--Line)"}
        >
          <Text
            textAlign={"start"}
            color={
              selectedOption?.value === initialSelectedOption?.value
                ? "var(--Text-color-Disable)"
                : "#000"
            }
            fontSize={"14px"}
            fontWeight={500}
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {selectedOption?.value}
          </Text>
        </MenuButton>
        <MenuList borderRadius={{ base: "12px" }} minW={"275px"}>
          {isShowSearch && (
            <Flex
              alignItems={"center"}
              gap={{ base: "12px" }}
              pl={"16px"}
              pr={"16px"}
              borderBottom={"0.5px solid var(--bg-line-employee)"}
            >
              <CiSearch color="var(--Text-color-Disable)" fontSize={"20px"} />
              <Input
                p={"0px"}
                fontSize={{ base: "14px" }}
                fontWeight={500}
                _placeholder={{ color: "var(--Text-color-Disable)" }}
                border={"none"}
                _focus={{ boxShadow: "none" }}
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {loading && (
                <Flex justify="center" mt={2}>
                  <Spinner size="sm" />
                </Flex>
              )}
            </Flex>
          )}
          {/* {!loading &&
            filteredOptions.map((option, index) => (
              <Flex key={index}>
                <MenuItem
                  pl={"16px"}
                  onClick={() => {
                    if (selectedOption?.value === option?.value) {
                      setSelectedOption(initialSelectedOption);
                      setValue && setValue(initialSelectedOption?.key);
                    } else {
                      setSelectedOption(option);
                      setValue && setValue(option?.key);
                    }
                    setSearchTerm("");
                  }}
                  backgroundColor={
                    selectedOption?.value === option?.value ? "#F9FAFD" : "#FFF"
                  }
                  color={
                    selectedOption?.value === option?.value ? "#1A9ED0" : "#000"
                  }
                >
                  {option?.value}
                  <IoCheckmarkOutline
                    style={{
                      marginLeft: "auto",
                      visibility:
                        selectedOption?.value === option?.value
                          ? "visible"
                          : "hidden",
                    }}
                  />
                </MenuItem>
              </Flex>
            ))} */}
        </MenuList>
      </Menu>
    </Box>
  );
};

export default SearchableSelect;
