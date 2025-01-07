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
  Select,
  Input,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import { axiosInstance } from "../../api/client.js";
import toast from "react-hot-toast";
import * as moment from "moment";
export default function Order() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [newOrderTotal, setNewOrderTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();
  const [searchQuery, setSearchQuery] = useState(""); // Trường tìm kiếm
  const [quantity, setQuantity] = useState(1); // Số lượng sản phẩm đã chọn
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [users, setUsers] = useState([]);
  const [curentQuantity, setCurentQuantity] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const [ordersResponse, productsResponse, usersResponse] =
          await Promise.all([
            axiosInstance.get("http://localhost:3001/order"),
            axiosInstance.get("http://localhost:3001/product/getAllProduct"),
            axiosInstance.get("http://localhost:3001/customer"),
          ]);
        if (
          ordersResponse.data.status === "OK" &&
          productsResponse.data.status === "OK"
        ) {
          setOrders(ordersResponse.data.data);
          setProducts(productsResponse.data.data);
          setUsers(usersResponse.data.data);
        } else {
          setError("Không thể tải dữ liệu.");
        }
      } catch (err) {
        setError("Có lỗi xảy ra khi kết nối tới máy chủ.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [reload]);

  const addProductToOrder = (productId, quantity) => {
    const product = products.find((p) => p._id === productId);
    if (product?.quantity < quantity) {
      toast.error("Số lượng bạn chọn vượt quá số lượng trong kho");
      return;
    }
    if (product) {
      const existingProduct = selectedProducts.find(
        (p) => p.productId === productId
      );
      if (existingProduct) {
        setSelectedProducts((prev) =>
          prev.map((p) =>
            p.productId === productId
              ? { ...p, quantity: p.quantity + quantity }
              : p
          )
        );
      } else {
        setSelectedProducts((prev) => [
          ...prev,
          { productId, quantity, name: product.name, price: product.price },
        ]);
      }
      calculateTotalPrice([
        ...selectedProducts,
        { productId, quantity, price: product.price },
      ]);
    }
  };

  const calculateTotalPrice = (productsList) => {
    const totalPrice = productsList.reduce(
      (sum, p) => sum + p.quantity * p.price,
      0
    );
    setNewOrderTotal(totalPrice);
  };

  const handleCreateOrder = async () => {
    try {
      const payload = {
        products: selectedProducts.map((p) => ({
          productId: p.productId,
          quantity: p.quantity,
        })),
        totalPrice: newOrderTotal,
        status: true,
        userId: selectedUserId,
      };

      await axiosInstance.post("http://localhost:3001/order/addOrder", payload);
      alert("Thêm đơn hàng thành công!");
      onAddClose();
      setSelectedProducts([]);
      setNewOrderTotal(0);
      setQuantity(0);
      setReload(!reload);
    } catch (err) {
      alert("Có lỗi xảy ra khi thêm đơn hàng.");
    }
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    onOpen();
  };

  // Lọc đơn hàng theo mã
  const filteredOrders = orders.filter((order) =>
    order._id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Tính toán danh sách đơn hàng cho trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedOrders = filteredOrders.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Tính tổng số trang
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

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
        Danh sách đơn hàng
      </Text>

      {/* Phần tìm kiếm */}
      <Flex alignItems={"center"} w={"100%"} justifyContent={"space-between"}>
        <Input
          w={"30%"}
          placeholder="Tìm kiếm theo mã đơn hàng"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          mb={5}
          size="md"
        />

        <Button colorScheme="teal" onClick={onAddOpen} mb={5}>
          Thêm đơn hàng
        </Button>
      </Flex>

      <TableContainer>
        <Table variant="striped" colorScheme="teal">
          <Thead>
            <Tr>
              <Th>STT</Th>
              <Th>Mã đơn hàng</Th>
              <Th>Tổng sản phẩm</Th>
              <Th>Tổng giá</Th>
              <Th>Ngày tạo</Th>
              <Th>Khách hàng</Th>
              <Th>Trạng thái</Th>
              <Th>Hành động</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedOrders.map((order, index) => (
              <Tr key={order._id}>
                <Td>{indexOfFirstItem + index + 1}</Td>
                <Td>{order._id}</Td>
                <Td>
                  {order.products.reduce((sum, p) => sum + p.quantity, 0)}
                </Td>
                <Td>{order.totalPrice.toLocaleString()} VND</Td>
                <Td>{moment(order.createdAt).format("DD/MM/YYYY HH:mm")}</Td>
                <Td>{order.userId?.name}</Td>
                <Td>{order.status ? "Hoàn thành" : "Chưa hoàn thành"}</Td>
                <Td>
                  <Button
                    colorScheme="blue"
                    size="sm"
                    onClick={() => openOrderDetails(order)}
                  >
                    Xem chi tiết
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

      {/* Modal Chi Tiết Đơn Hàng */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Chi tiết đơn hàng</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedOrder && (
              <>
                <Text fontSize="lg" fontWeight="bold">
                  Mã đơn hàng: {selectedOrder._id}
                </Text>
                <Text fontSize="lg">
                  Khách hàng: {selectedOrder.userId?.name}
                </Text>
                <Text mt={2}>
                  Trạng thái:{" "}
                  <strong>
                    {selectedOrder.status ? "Hoàn thành" : "Chưa hoàn thành"}
                  </strong>
                </Text>
                <Text mt={2}>
                  Tổng giá: {selectedOrder.totalPrice.toLocaleString()} VND
                </Text>
                <Text mt={4} fontSize="lg" fontWeight="bold">
                  Sản phẩm:
                </Text>
                <TableContainer mt={4}>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Tên sản phẩm</Th>
                        <Th>Số lượng</Th>
                        <Th>Giá</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {selectedOrder.products.map(
                        (product) =>
                          product.productId && (
                            <Tr key={product.productId?._id}>
                              <Td>{product.productId?.name}</Td>
                              <Td>{product?.quantity}</Td>
                              <Td>
                                {product?.productId?.price?.toLocaleString()}{" "}
                                VND
                              </Td>
                            </Tr>
                          )
                      )}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Đóng</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal Thêm Đơn Hàng */}
      <Modal isOpen={isAddOpen} onClose={onAddClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Thêm đơn hàng</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Chọn sản phẩm */}
            <Select
              placeholder="Chọn sản phẩm"
              onChange={(e) => setSelectedProductId(e.target.value)} // Cập nhật ID sản phẩm khi chọn
            >
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name} - Giá: {product.price.toLocaleString()} - SL:{" "}
                  {product.quantity}
                </option>
              ))}
            </Select>
            <Select
              mt={4}
              placeholder="Chọn người dùng"
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </Select>
            {/* Nhập số lượng */}
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min={1}
              mt={2}
              placeholder="Nhập số lượng"
            />
            <Button
              colorScheme="teal"
              mt={3}
              onClick={() => addProductToOrder(selectedProductId, quantity)} // Thêm sản phẩm với số lượng
            >
              Thêm vào đơn hàng
            </Button>
            {/* Danh sách sản phẩm đã chọn */}
            <TableContainer mt={5}>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Tên sản phẩm</Th>
                    <Th>Số lượng</Th>
                    <Th>Giá</Th>
                    <Th>Tổng</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {selectedProducts.map((p) => (
                    <Tr key={p.productId}>
                      <Td>{p.name}</Td>
                      <Td>{p.quantity}</Td>
                      <Td>{p.price.toLocaleString()} VND</Td>
                      <Td>{(p.quantity * p.price).toLocaleString()} VND</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>

            {/* Tổng giá */}
            <Text mt={5} fontWeight="bold">
              Tổng giá: {newOrderTotal.toLocaleString()} VND
            </Text>
          </ModalBody>

          <ModalFooter>
            {/* Tạo đơn hàng */}
            <Button colorScheme="blue" onClick={handleCreateOrder} ml={3}>
              Tạo đơn hàng
            </Button>

            <Button onClick={onAddClose} ml={3}>
              Hủy
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
