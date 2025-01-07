import { Avatar, Flex, Text } from "@chakra-ui/react";
// import { formatDate, formatDateForInput } from "../../../utils/utils";

export const formatTableValue = (value, key) => {
  switch (key) {
    case "contact":
      return (
        <Flex direction={"column"} justifyContent={"left"}>
          {value &&

            <Text key={value}>
              {typeof value === "undefined" ? "-" : value}
            </Text>
          }
        </Flex>
      );
    case "bankInfo":
      return (
        <Flex direction={"column"} justifyContent={"left"}>
          {value &&
            <Text key={value}>
              {typeof value === "undefined" ? "-" : value}
            </Text>}
        </Flex>
      );
    case "avatar":
      return (
        <Avatar
          src={`${process.env.REACT_APP_BACKEND_API}${value}`}
          cursor={"pointer"}
        />
      );
    case "status":
      const status = value ? "Đang làm việc" : "Dừng làm việc";
      return (
        <Text
          color={
            !value ? "var(--text-red-employee)" : "var(--color-status-employ)"
          }
        >
          {status}
        </Text>
      );
    default:
      return <Text cursor={"pointer"}>{value}</Text>;
  }
};
