import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { formatTableValue } from "./formatTable";
import iconButton from "../../assets/icons/employee/icon-button.svg";
import ModalEmployee from "../../components/modal/modalEmployee";
import { AiOutlineMore } from "react-icons/ai";
import { axiosInstance } from "../../api/client.js";
import moment from "moment";

export default function Employee() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [totalEmployee, setTotalEmployee] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [user, setUser] = useState(undefined);
  const [reload, setReload] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState(""); // State lưu mật khẩu mới
  const toast = useToast();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State cho modal xóa
  const [userToDelete, setUserToDelete] = useState(null); // State lưu user cần xóa
  const cancelRef = React.useRef();

  const handleUpdatePassword = async () => {
    if (!user || !newPassword) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập đầy đủ thông tin.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("password", newPassword);

      await axiosInstance.put(
        `http://localhost:3001/employee/${user.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast({
        title: "Thành công",
        description: `Mật khẩu của nhân viên ${user.fullName} đã được cập nhật.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setIsPasswordModalOpen(false); // Đóng modal
      setReload(!reload); // Reload lại dữ liệu
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật mật khẩu. Vui lòng thử lại sau.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await axiosInstance.delete(
        `http://localhost:3001/employee/deleteUser/${userToDelete.id}`
      );
      setReload(!reload); // Reload dữ liệu
      setIsDeleteModalOpen(false); // Đóng modal
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("http://localhost:3001/employee/getAllUser");
        const data = response.data.data.filter(v => v.isAdmin !== true).map((employee, index) => ({
          num: index + 1,
          avatar: employee.image || "",
          code: employee.code || "N/A",
          fullName: employee.username,
          contact: `${employee.phone || "N/A"}, ${employee.email}`,
          currentAddress: employee.Address || "N/A",
          bankInfo: employee.bankCode || "N/A",
          startTime: moment(employee.startTime).format("DD/MM/YYYY"),
          endTime: employee.endTime ? moment(employee.endTime).format("DD/MM/YYYY") : '',
          status: employee.isActive,
          id: employee._id,

        }));
        keyword ? setEmployeeData(data.filter(v => v.fullName.toLowerCase().includes(keyword.toLowerCase()) || v.code.toLowerCase().includes(keyword.toLowerCase()))) : setEmployeeData(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchData();
  }, [keyword, reload]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Số mục hiển thị mỗi trang

  // Tính toán danh sách nhân viên cho trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedEmployees = employeeData.slice(indexOfFirstItem, indexOfLastItem);

  // Tính tổng số trang
  const totalPages = Math.ceil(employeeData.length / itemsPerPage);

  // Hàm chuyển trang
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const historyTableData = {
    headers: [
      {
        label: "",
        key: "",
      },
      {
        label: "STT",
        key: "num",
      },
      {
        label: "Ảnh ĐD",
        key: "avatar",
      },
      {
        label: "MSNV",
        key: "code",
      },
      {
        label: "Họ tên",
        key: "fullName",
      },
      {
        label: "SĐT&Email",
        key: "contact",
      },
      {
        label: "Chỗ ở hiện tại",
        key: "currentAddress",
      },
      {
        label: "STK&Ngân hàng",
        key: "bankInfo",
      },
      {
        label: "Ngày vào làm",
        key: "startTime",
      },
      {
        label: "Ngày nghỉ",
        key: "endTime",
      },
      {
        label: "TTHĐ",
        key: "status",
      },
    ],
    data: paginatedEmployees,
  };




  return (
    <>
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sửa mật khẩu</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="password">
              <FormLabel>Mật khẩu mới</FormLabel>
              <Input
                type="password"
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setIsPasswordModalOpen(false)}>Hủy</Button>
            <Button colorScheme="blue" ml={3} onClick={handleUpdatePassword}>
              Cập nhật
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <AlertDialog
        isOpen={isDeleteModalOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Xóa nhân viên
            </AlertDialogHeader>
            <AlertDialogBody>
              Bạn có chắc chắn muốn xóa nhân viên{" "}
              <strong>{userToDelete?.fullName}</strong> không? Hành động này
              không thể hoàn tác.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDeleteModalOpen(false)}>
                Hủy
              </Button>
              <Button colorScheme="red" onClick={handleDeleteUser} ml={3}>
                Xóa
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Box
        minH="calc(100vh - 80px)"
        w={{ base: "100%" }}
        backgroundColor="var(--color-backgroundmain)"
        p={{ base: "24px 16px 16px 15px" }}
      >
        <Flex alignItems={"center"} justifyContent={"space-between"}>
          <Flex alignItems={"center"} gap={{ base: "74px" }}>
            <Text fontSize={{ base: "20px" }} fontWeight={600}>
              Quản lý nhân viên
            </Text>
            <Flex
              justifyContent={{ base: "space-around", xl: "flex-start" }}
              gap={{ base: "24px" }}
            ></Flex>
          </Flex>
          <Menu>
            <MenuButton
              w={"180px"}
              h={"44px"}
              as={Button}
              backgroundImage="var(--color-button)"
              _hover={{
                backgroundImage: "var(--color-button)",
              }}
              _active={{
                backgroundImage: "var(--color-button)",
              }}
              onClick={() => {
                setUser(undefined);
                onOpen();
              }}
            >
              <Flex alignItems={"center"} p={"10px 0px 10px 0px"} gap={"8px"}>
                <Image src={iconButton} />
                <Text
                  fontSize={{ base: "15px" }}
                  fontWeight={600}
                  color="var(--color-main)"
                >
                  Thêm nhân viên
                </Text>
              </Flex>
            </MenuButton>
          </Menu>
        </Flex>
        <Box mt={{ base: "23px" }}>
          <Flex flexDirection={"column"} gap={{ base: "16px" }}>
            <Flex alignItems={"center"} gap={{ base: "16px" }}>
              {totalEmployee.map((item, index) => (
                <Flex
                  w={{ base: "192px" }}
                  key={index}
                  flexDirection={"column"}
                  backgroundColor={"#FFF"}
                  p={"16px 42px 16px 16px"}
                  borderRadius={{ base: "12px" }}
                  gap={{ base: "12px" }}
                >
                  <Text
                    fontSize={{ base: "15px" }}
                    fontWeight={400}
                    color="var(--text-color-Subtittle)"
                  >
                    {item.title}
                  </Text>
                  <Text
                    fontSize={{ base: "20px" }}
                    fontWeight={500}
                    color={"#000"}
                  >
                    {item.total}
                  </Text>
                </Flex>
              ))}
            </Flex>
            <Flex
              minHeight="calc(100vh - 297.5px)"
              backgroundColor="var(--color-main)"
              borderRadius={{ base: "12px" }}
              flexDirection={"column"}
            >
              <Flex
                alignItems={"center"}
                gap={{ base: "32px" }}
                p={"16px 0px 12px 16px"}
              >
                <InputGroup width="300px" borderRadius={{ base: "8px" }}>
                  <Input
                    placeholder="Nhập MVN, họ tên, sđt..."
                    type="text"
                    onChange={(e) => {
                      setTimeout(() => {
                        setKeyword(e.target.value)
                      }, 500)
                    }}
                    borderRadius={{ base: "8px" }}
                    border={{ base: "1px solid var(--color-secondary)" }}
                    backgroundColor={"var(--fill-avatar)"}
                  />
                  <InputRightElement
                    cursor={"pointer"}
                    borderTopRightRadius={"8px"}
                    borderBottomRightRadius={"8px"}
                    pointerEvents="auto"
                    backgroundImage="var(--color-button)"
                  >
                    {/* <SearchIcon color="var(--color-main)" /> */}
                  </InputRightElement>
                </InputGroup>
              </Flex>
              <Flex
                minHeight="calc(100vh - 365.5px)"
                flexDirection={"column"}
                justifyContent={"space-between"}
                width={"100%"}
              >
                <TableContainer width={"100%"} pb={"16px"}>
                  <Table w={"100%"} variant="unstyled">
                    <Thead
                      w={"100%"}
                      h={"41px"}
                      color="white"
                      fontWeight="400"
                      backgroundColor="var(--fill-avatar)"
                    >
                      <Tr h={{ base: "41px" }}>
                        {historyTableData.headers.map((e, index) => {
                          return (
                            <Td
                              p={"16px 16px 8px 16px"}
                              key={index}
                              border={"none"}
                              color={"#51607B"}
                              fontSize={{ base: "14px" }}
                              w={"20%"}
                            >
                              <Box textAlign={"center"}>{e.label}</Box>
                            </Td>
                          );
                        })}
                      </Tr>
                    </Thead>
                    <Tbody w={"100%"} h={"100%"}>
                      {historyTableData.data?.length > 0 ? (
                        historyTableData.data?.map((e, rowIndex) => {
                          const items = { ...e };
                          delete items.detail;
                          delete items.edit;
                          const keyValues = Object.keys(items);
                          return (
                            <Tr
                              w={"100%"}
                              key={rowIndex}
                              h={"72px"}
                              backgroundColor={
                                rowIndex % 2 === 0
                                  ? "#transparent"
                                  : "var(--fill-avatar)"
                              }
                            >
                              <Td p={"16px 16px 8px 16px"} w={"20%"}>
                                <Menu>
                                  <MenuButton
                                    _hover={{ backgroundColor: "none" }}
                                    _active={{ backgroundColor: "none" }}
                                    background="none"
                                    as={Button}
                                  >
                                    <AiOutlineMore fontSize={"20px"} />
                                  </MenuButton>
                                  <MenuList
                                    fontSize={{ base: "14px" }}
                                    fontWeight={500}
                                    lineHeight={"140%"}
                                    color={"var(--color-info-employee)"}
                                  >
                                    <MenuItem onClick={() => {
                                      setUser(items);
                                      onOpen()
                                    }} gap={"16px"}>Chỉnh sửa</MenuItem>
                                    <MenuItem onClick={() => {
                                      setUser(items); // Lưu thông tin user cần sửa mật khẩu
                                      setIsPasswordModalOpen(true); // Mở modal sửa mật khẩu
                                    }} gap={"16px"}>
                                      Đổi mật khẩu
                                    </MenuItem>
                                    <MenuItem onClick={async () => {
                                      try {
                                        const formDataPayload = new FormData();
                                        formDataPayload.append("endTime", items?.status ? new Date().toISOString() : '')
                                        formDataPayload.append("isActive", !items?.status)

                                        await axiosInstance.put(`http://localhost:3001/employee/${items.id}`, formDataPayload, {
                                          headers: {
                                            "Content-Type": "multipart/form-data",
                                          },
                                        });
                                        setReload(!reload)
                                      } catch (error) {
                                        console.log(error);
                                      }
                                    }} gap={"16px"}>
                                      <Text
                                        color={
                                          !items?.status &&
                                          "var(--text-red-employee)"
                                        }
                                      >
                                        {items?.status
                                          ? "Dừng hoạt động"
                                          : "Mở hoạt động"}
                                      </Text>
                                    </MenuItem>
                                    <MenuItem onClick={() => {
                                      setUserToDelete(items); // Lưu thông tin user cần xóa
                                      setIsDeleteModalOpen(true); // Mở modal xóa
                                    }} gap={"16px"}>
                                      Xóa nhân viên
                                    </MenuItem>
                                  </MenuList>
                                </Menu>
                              </Td>
                              {keyValues.map((keyvalue, index) => {
                                let width;
                                let whiteSpace;
                                if (keyvalue === "id") return;
                                if (keyvalue === "fullName") {
                                  width = "116px";
                                  whiteSpace = "normal";
                                } else if (keyvalue === "code") {
                                  width = "126px";
                                } else {
                                  width = "auto";
                                  whiteSpace = "inherit";
                                }
                                const isShow =
                                  keyvalue === "avatar" ||
                                  keyvalue === "code" ||
                                  keyvalue === "fullName";
                                return (
                                  <Td
                                    p={"16px 16px 8px 16px"}
                                    w={"20%"}
                                    key={index}
                                  >
                                    <Box
                                      textAlign={"center"}
                                      fontSize={{ base: "14px" }}
                                      lineHeight={"19.6px"}
                                      fontWeight={500}
                                      color={"#293755"}
                                      w={width}
                                      whiteSpace={whiteSpace}
                                      overflow="hidden"
                                      textOverflow="ellipsis"
                                      display="-webkit-box"
                                      sx={{
                                        WebkitLineClamp: "2",
                                        WebkitBoxOrient: "vertical",
                                      }}
                                    >
                                      {formatTableValue(
                                        items[keyvalue],
                                        keyvalue
                                      )}
                                    </Box>
                                  </Td>
                                );
                              })}
                            </Tr>
                          );
                        })
                      ) : (
                        <Tr>
                          <Td
                            colSpan={historyTableData.headers.length}
                            textAlign="center"
                            padding={"70px 0"}
                          >
                            Không có dữ liệu
                          </Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                </TableContainer>
                <Flex
                  m={"50px 16px 16px 16px"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <Text fontSize={"14px"} fontWeight={500}>
                    Hiển thị {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, employeeData.length)} trong {employeeData.length} nhân viên
                  </Text>
                  <HStack spacing={2} justify="flex-end">
                    <Button
                      onClick={() => handlePageChange(currentPage - 1)}
                      isDisabled={currentPage === 1}
                    >
                      Trước
                    </Button>
                    {Array.from({ length: totalPages }, (_, index) => (
                      <Button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        colorScheme={index + 1 === currentPage ? "blue" : "gray"}
                      >
                        {index + 1}
                      </Button>
                    ))}
                    <Button
                      onClick={() => handlePageChange(currentPage + 1)}
                      isDisabled={currentPage === totalPages}
                    >
                      Sau
                    </Button>
                  </HStack>
                </Flex>

                <Flex
                  m={"50px 16px 16px 16px"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <Text
                    fontSize={"14px"}
                    fontWeight={500}
                    lineHeight={"20px"}
                    color={"var(--text-color-Subtittle)"}
                  >
                  </Text>
                  <HStack spacing={2} justify="flex-end">
                  </HStack>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Box>
      </Box>
      <ModalEmployee userData={user} isOpen={isOpen} onClose={() => {
        setReload(!reload)
        onClose()
      }} />
    </>
  );
}
