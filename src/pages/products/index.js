import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  InputGroup,
  Input,
  InputRightElement,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { axiosInstance } from "../../api/client.js";

export default function ProductTable() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [searchKeyword, setSearchKeyword] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const toast = useToast();
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    price: "",
    description: "",
    quantity: "",
    type: "",
    image: null,
  });

  const [selectedType, setSelectedType] = useState("");

  // Hàm xử lý thay đổi loại sản phẩm
  const handleTypeChange = (e) => {
    const type = e.target.value;
    setSelectedType(type);

    // Lọc sản phẩm theo loại đã chọn
    if (type) {
      const filtered = products.filter((product) => product.type === type);
      setFilteredProducts(filtered);
    } else {
      // Nếu không chọn loại nào, hiển thị tất cả sản phẩm
      setFilteredProducts(products);
    }
  };

  const validateForm = () => {
    if (!formData.code.trim()) {
      toast({
        title: "Lỗi",
        description: "Mã sản phẩm không được để trống.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (!formData.name.trim()) {
      toast({
        title: "Lỗi",
        description: "Tên sản phẩm không được để trống.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (!formData.price || formData.price <= 0) {
      toast({
        title: "Lỗi",
        description: "Giá sản phẩm phải lớn hơn 0.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (!formData.description.trim()) {
      toast({
        title: "Lỗi",
        description: "Mô tả sản phẩm không được để trống.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (!formData.quantity || formData.quantity <= 0) {
      toast({
        title: "Lỗi",
        description: "Số lượng sản phẩm phải lớn hơn 0.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (!formData.type.trim()) {
      toast({
        title: "Lỗi",
        description: "Loại sản phẩm không được để trống.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (!formData.image && !selectedProduct) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn hình ảnh sản phẩm.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    return true;
  };

  // Gọi API để lấy danh sách sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get(
          "http://localhost:3001/product/getAllProduct"
        );
        const productData = response.data?.data || [];
        setProducts(productData);
        setFilteredProducts(productData); // Hiển thị tất cả sản phẩm ban đầu
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Xử lý tìm kiếm sản phẩm
  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchKeyword(keyword);
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(keyword) ||
        product.code.toLowerCase().includes(keyword)
    );
    setFilteredProducts(filtered);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Số sản phẩm hiển thị mỗi trang

  // Tính toán danh sách sản phẩm cho trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Tổng số trang
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Hàm chuyển trang
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Hàm thêm sản phẩm
  const handleAddProduct = async () => {
    if (!validateForm()) return;
    const payload = new FormData();
    payload.append("code", formData.code);
    payload.append("name", formData.name);
    payload.append("price", formData.price);
    payload.append("description", formData.description);
    payload.append("quantity", formData.quantity);
    payload.append("type", formData.type);
    payload.append("image", formData.image);

    try {
      await axiosInstance.post(
        "http://localhost:3001/product/addProduct",
        payload,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast({
        title: "Thành công",
        description: "Sản phẩm mới đã được thêm.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setFormData({
        code: "",
        name: "",
        price: "",
        description: "",
        quantity: "",
        type: "",
        image: null,
      });
      onClose();
      // Reload danh sách sản phẩm
      const response = await axiosInstance.get(
        "http://localhost:3001/product/getAllProduct"
      );
      setProducts(response.data?.data || []);
      setFilteredProducts(response.data?.data || []);
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm sản phẩm. Vui lòng thử lại.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const openEditProduct = (product) => {
    setSelectedProduct(product);
    setFormData({
      code: product.code,
      name: product.name,
      price: product.price,
      description: product.description,
      quantity: product.quantity,
      type: product.type,
      image: null,
    });
    onEditOpen();
  };

  // Hàm sửa sản phẩm
  const handleEditProduct = async () => {
    if (!validateForm()) return;
    const payload = new FormData();
    payload.append("code", formData.code);
    payload.append("name", formData.name);
    payload.append("price", formData.price);
    payload.append("description", formData.description);
    payload.append("quantity", formData.quantity);
    payload.append("type", formData.type);
    if (formData.image) payload.append("image", formData.image);

    try {
      await axiosInstance.put(
        `http://localhost:3001/product/${selectedProduct._id}`,
        payload,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast({
        title: "Thành công",
        description: "Sản phẩm đã được cập nhật.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onEditClose();
      const response = await axiosInstance.get(
        "http://localhost:3001/product/getAllProduct"
      );
      setProducts(response.data?.data || []);
      setFilteredProducts(response.data?.data || []);
      setFormData({
        code: "",
        name: "",
        price: "",
        description: "",
        quantity: "",
        type: "",
        image: null,
      });
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Lỗi",
        description: "Không thể sửa sản phẩm. Vui lòng thử lại.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Hàm mở modal xóa sản phẩm
  const openDeleteProduct = (product) => {
    setSelectedProduct(product);
    onDeleteOpen();
  };

  // Hàm xóa sản phẩm
  const handleDeleteProduct = async () => {
    try {
      await axiosInstance.delete(
        `http://localhost:3001/product/deleteProduct/${selectedProduct._id}`
      );
      toast({
        title: "Thành công",
        description: "Sản phẩm đã được xóa.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onDeleteClose();
      const response = await axiosInstance.get(
        "http://localhost:3001/product/getAllProduct"
      );
      setProducts(response.data?.data || []);
      setFilteredProducts(response.data?.data || []);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa sản phẩm. Vui lòng thử lại.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Hàm xử lý thay đổi form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Hàm xử lý chọn file
  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  return (
    <Box p={5} minH="100vh" bg="gray.50">
      {/* Thanh tìm kiếm và nút thêm sản phẩm */}
      <Flex mb={5} justify="space-between" align="center">
        <InputGroup maxW="500px" size="md">
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={searchKeyword}
            onChange={handleSearch}
            borderColor="gray.300"
          />
          <InputRightElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputRightElement>
        </InputGroup>
        <Select
          placeholder="Chọn loại sản phẩm"
          value={selectedType}
          onChange={handleTypeChange}
          maxW="200px"
        >
          <option value="Giày thể thao">Giày thể thao</option>
          <option value="Giày Sneaker">Giày Sneaker</option>
          <option value="Giày tây">Giày tây</option>
          <option value="Giày boots">Giày boots</option>
          <option value="">Tất cả loại</option>
        </Select>
        <Button
          colorScheme="teal"
          onClick={() => {
            onOpen();
            setFormData({
              code: "",
              name: "",
              price: "",
              description: "",
              quantity: "",
              type: "",
              image: null,
            });
          }}
        >
          Thêm sản phẩm
        </Button>
      </Flex>

      {/* Bảng danh sách sản phẩm */}
      <TableContainer>
        <Table variant="striped" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>Số thứ tự</Th>
              <Th>Mã sản phẩm</Th>
              <Th>Hình ảnh</Th>
              <Th>Tên sản phẩm</Th>
              <Th>Mô tả</Th>
              <Th>Loại</Th>
              <Th>Giá (VND)</Th>
              <Th>Số lượng</Th>
              <Th>Ngày tạo</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product, index) => (
                <Tr key={product._id}>
                  <Td>{indexOfFirstItem + index + 1}</Td>
                  <Td>{product.code}</Td>
                  <Td>
                    <img
                      src={`http://localhost:3001${product.image}`}
                      alt={product.name}
                      width="50px"
                      height="50px"
                      style={{ borderRadius: "5px", objectFit: "cover" }}
                    />
                  </Td>
                  <Td>{product.name}</Td>
                  <Td>{product.description}</Td>
                  <Td>{product.type}</Td>
                  <Td>{product.price.toLocaleString()}</Td>
                  <Td>{product.quantity}</Td>
                  <Td>
                    {new Date(product.createdAt).toLocaleDateString("vi-VN")}
                  </Td>
                  <Td>
                    <Flex gap={2}>
                      <Button
                        colorScheme="blue"
                        size="sm"
                        onClick={() => openEditProduct(product)}
                      >
                        Sửa
                      </Button>
                      <Button
                        colorScheme="red"
                        size="sm"
                        onClick={() => openDeleteProduct(product)}
                      >
                        Xóa
                      </Button>
                    </Flex>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan="9" textAlign="center">
                  Không tìm thấy sản phẩm phù hợp.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
      <Box
        mt={4}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text>
          Hiển thị {indexOfFirstItem + 1} -{" "}
          {Math.min(indexOfLastItem, filteredProducts.length)} trong{" "}
          {filteredProducts.length} sản phẩm
        </Text>
        <Box>
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
              colorScheme={index + 1 === currentPage ? "teal" : "gray"}
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
        </Box>
      </Box>

      {/* Modal thêm sản phẩm */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Thêm sản phẩm</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Mã sản phẩm</FormLabel>
              <Input
                name="code"
                placeholder="Nhập mã sản phẩm"
                value={formData.code}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Tên sản phẩm</FormLabel>
              <Input
                name="name"
                placeholder="Nhập tên sản phẩm"
                value={formData.name}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Giá</FormLabel>
              <Input
                name="price"
                placeholder="Nhập giá sản phẩm"
                type="number"
                value={formData.price}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Mô tả</FormLabel>
              <Input
                name="description"
                placeholder="Nhập mô tả sản phẩm"
                value={formData.description}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Số lượng</FormLabel>
              <Input
                name="quantity"
                placeholder="Nhập số lượng sản phẩm"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Loại</FormLabel>
              <Select
                name="type"
                placeholder="Chọn loại sản phẩm"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="Giày thể thao">Giày thể thao</option>
                <option value="Giày Sneaker">Giày Sneaker</option>
                <option value="Giày tây">Giày tây</option>
                <option value="Giày boots">Giày boots</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Hình ảnh</FormLabel>
              <Input type="file" accept="image/*" onChange={handleFileChange} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} mr={3}>
              Hủy
            </Button>
            <Button colorScheme="teal" onClick={handleAddProduct}>
              Thêm sản phẩm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sửa sản phẩm</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Mã sản phẩm</FormLabel>
              <Input
                name="code"
                placeholder="Nhập mã sản phẩm"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Tên sản phẩm</FormLabel>
              <Input
                name="name"
                placeholder="Nhập tên sản phẩm"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Giá</FormLabel>
              <Input
                name="price"
                placeholder="Nhập giá sản phẩm"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Mô tả</FormLabel>
              <Input
                name="description"
                placeholder="Nhập mô tả sản phẩm"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Số lượng</FormLabel>
              <Input
                name="quantity"
                placeholder="Nhập số lượng sản phẩm"
                type="number"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Loại</FormLabel>
              <Select
                name="type"
                placeholder="Chọn loại sản phẩm"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                <option value="Giày thể thao">Giày thể thao</option>
                <option value="Giày Sneaker">Giày Sneaker</option>
                <option value="Giày tây">Giày tây</option>
                <option value="Giày boots">Giày boots</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Hình ảnh (nếu cần thay đổi)</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.files[0] })
                }
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onEditClose} mr={3}>
              Hủy
            </Button>
            <Button colorScheme="blue" onClick={handleEditProduct}>
              Lưu thay đổi
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal Xóa Sản Phẩm */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Xóa sản phẩm</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Bạn có chắc chắn muốn xóa sản phẩm{" "}
              <strong>{selectedProduct?.name}</strong>?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onDeleteClose} mr={3}>
              Hủy
            </Button>
            <Button colorScheme="red" onClick={handleDeleteProduct}>
              Xóa
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
