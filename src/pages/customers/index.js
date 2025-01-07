import React, { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Spinner,
  Box,
  Text,
  Alert,
  AlertIcon,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import { axiosInstance } from "../../api/client.js";
import toast from "react-hot-toast";

export default function Customer() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Thêm state để lưu trữ từ khóa tìm kiếm
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axiosInstance.get(
          "http://localhost:3001/customer"
        );
        if (response.data.status === "OK") {
          setCustomers(response.data.data);
        } else {
          setError("Không thể tải danh sách khách hàng.");
        }
      } catch (err) {
        setError("Có lỗi xảy ra khi kết nối tới máy chủ.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleCreateCustomer = async () => {
    // Validate các trường nhập liệu và show toast cho từng trường hợp
    if (!newCustomer.name) {
      toast.error("Tên khách hàng không được để trống!");
      return; // Dừng hàm nếu trường 'name' trống
    }
    if (!newCustomer.email) {
      toast.error("Email không được để trống!");
      return; // Dừng hàm nếu trường 'email' trống
    }
    if (!newCustomer.phone) {
      toast.error("Số điện thoại không được để trống!");
      return; // Dừng hàm nếu trường 'phone' trống
    }
    if (!newCustomer.address) {
      toast.error("Địa chỉ không được để trống!");
      return; // Dừng hàm nếu trường 'address' trống
    }

    try {
      const response = await axiosInstance.post(
        "http://localhost:3001/customer/addCustomer",
        newCustomer
      );
      if (response.data.status === "OK") {
        toast.success("Tạo khách hàng thành công!");
        setCustomers((prev) => [...prev, response.data.data]);
        onClose();
        setNewCustomer({ name: "", email: "", phone: "", address: "" });
      } else {
        toast.error("Không thể tạo khách hàng.");
      }
    } catch (err) {
      toast.error("Có lỗi xảy ra khi tạo khách hàng.");
    }
  };

  // Hàm chỉnh sửa khách hàng
  const handleEditCustomer = async () => {
    // Validate các trường nhập liệu và show toast cho từng trường hợp
    if (!selectedCustomer.name) {
      toast.error("Tên khách hàng không được để trống!");
      return; // Dừng hàm nếu trường 'name' trống
    }
    if (!selectedCustomer.email) {
      toast.error("Email không được để trống!");
      return; // Dừng hàm nếu trường 'email' trống
    }
    if (!selectedCustomer.phone) {
      toast.error("Số điện thoại không được để trống!");
      return; // Dừng hàm nếu trường 'phone' trống
    }
    if (!selectedCustomer.address) {
      toast.error("Địa chỉ không được để trống!");
      return; // Dừng hàm nếu trường 'address' trống
    }

    try {
      const response = await axiosInstance.put(
        `http://localhost:3001/customer/${selectedCustomer._id}`,
        {
          name: selectedCustomer.name,
          email: selectedCustomer.email,
          phone: selectedCustomer.phone,
          address: selectedCustomer.address,
        }
      );
      if (response.data.status === "OK") {
        toast.success("Sửa khách hàng thành công!");
        setCustomers((prev) =>
          prev.map((customer) =>
            customer._id === selectedCustomer._id
              ? { ...response.data.data }
              : customer
          )
        );
        onEditClose();
      } else {
        toast.error("Không thể sửa khách hàng.");
      }
    } catch (err) {
      toast.error("Có lỗi xảy ra khi sửa khách hàng.");
    }
  };

  const handleDeleteCustomer = async (id) => {
    try {
      const response = await axiosInstance.delete(
        `http://localhost:3001/customer/${id}`
      );
      if (response.data.status === "OK") {
        alert("Xoá khách hàng thành công!");
        setCustomers((prev) => prev.filter((customer) => customer._id !== id));
      } else {
        alert("Không thể xoá khách hàng.");
      }
    } catch (err) {
      alert("Có lỗi xảy ra khi xoá khách hàng.");
    }
  };

  // Lọc khách hàng theo tên
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Tính toán danh sách khách hàng cho trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Tính tổng số trang
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  // Hàm chuyển trang
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="xl" />
        <Text mt={4}>Đang tải dữ liệu...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error" mt={10}>
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Box p={5}>
      <Text fontSize="2xl" mb={5} fontWeight="bold">
        Danh sách khách hàng
      </Text>

      {/* Phần tìm kiếm khách hàng */}
      <Flex alignItems={"center"} w={"100%"} justifyContent={"space-between"}>
        <Input
          w={"30%"}
          placeholder="Tìm kiếm theo tên khách hàng"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          mb={5}
          size="md"
        />

        <Button colorScheme="teal" mb={5} onClick={onOpen}>
          Tạo khách hàng
        </Button>
      </Flex>

      <TableContainer>
        <Table variant="striped" colorScheme="teal">
          <Thead>
            <Tr>
              <Th>STT</Th>
              <Th>Tên khách hàng</Th>
              <Th>Email</Th>
              <Th>Số điện thoại</Th>
              <Th>Địa chỉ</Th>
              <Th>Hành động</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedCustomers.map((customer, index) => (
              <Tr key={customer._id}>
                <Td>{indexOfFirstItem + index + 1}</Td>
                <Td>{customer.name}</Td>
                <Td>{customer.email}</Td>
                <Td>{customer.phone}</Td>
                <Td>{customer.address}</Td>
                <Td>
                  <Button
                    colorScheme="blue"
                    size="sm"
                    mr={2}
                    onClick={() => {
                      setSelectedCustomer(customer);
                      onEditOpen();
                    }}
                  >
                    Sửa
                  </Button>
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleDeleteCustomer(customer._id)}
                  >
                    Xoá
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Flex mt={4} textAlign="center" justifyContent={"flex-end"}>
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          isDisabled={currentPage === 1}
          mr={2}
        >
          Trước
        </Button>
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            colorScheme={index + 1 === currentPage ? "blue" : "gray"}
            mx={1}
          >
            {index + 1}
          </Button>
        ))}
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          isDisabled={currentPage === totalPages}
          ml={2}
        >
          Sau
        </Button>
      </Flex>

      {/* Modal Tạo Khách Hàng */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tạo khách hàng</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Tên khách hàng"
              mb={3}
              value={newCustomer.name}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, name: e.target.value })
              }
            />
            <Input
              placeholder="Email"
              mb={3}
              type="email"
              value={newCustomer.email}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, email: e.target.value })
              }
            />
            <Input
              placeholder="Số điện thoại"
              mb={3}
              type="tel"
              value={newCustomer.phone}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, phone: e.target.value })
              }
            />
            <Input
              placeholder="Địa chỉ"
              mb={3}
              value={newCustomer.address}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, address: e.target.value })
              }
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleCreateCustomer}>
              Tạo
            </Button>
            <Button onClick={onClose} ml={3}>
              Hủy
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal Sửa Khách Hàng */}
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sửa khách hàng</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Tên khách hàng"
              mb={3}
              value={selectedCustomer?.name || ""}
              onChange={(e) =>
                setSelectedCustomer((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
            <Input
              placeholder="Email"
              mb={3}
              type="email"
              value={selectedCustomer?.email || ""}
              onChange={(e) =>
                setSelectedCustomer((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
            />
            <Input
              placeholder="Số điện thoại"
              mb={3}
              type="tel"
              value={selectedCustomer?.phone || ""}
              onChange={(e) =>
                setSelectedCustomer((prev) => ({
                  ...prev,
                  phone: e.target.value,
                }))
              }
            />
            <Input
              placeholder="Địa chỉ"
              mb={3}
              value={selectedCustomer?.address || ""}
              onChange={(e) =>
                setSelectedCustomer((prev) => ({
                  ...prev,
                  address: e.target.value,
                }))
              }
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleEditCustomer}>
              Lưu
            </Button>
            <Button onClick={onEditClose} ml={3}>
              Hủy
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
