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
  Select,
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  RadioGroup,
  Radio,
  Stack,
} from "@chakra-ui/react";
import { axiosInstance } from "../../api/client.js";
import moment from "moment";

export default function OnLeave() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [editingRequest, setEditingRequest] = useState(null);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(true);
  const [filterUserId, setFilterUserId] = useState("");

  const [error, setError] = useState(null);
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [newLeaveType, setNewLeaveType] = useState("oneDay");
  const [newLeaveData, setNewLeaveData] = useState({
    startDate: moment(new Date()).set('h', 8).format("yyyy-MM-DDThh:mm"),
    endDate: moment(new Date()).set('h', 16).format("yyyy-MM-DDThh:mm"),
    startTime: "08:00",
    endTime: "17:00",
    reason: "",
    userId: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Số mục trên mỗi trang

  // Tính toán danh sách yêu cầu nghỉ cho trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedRequests = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);

  // Tổng số trang
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  // Hàm chuyển trang
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const openEditModal = (request) => {
    setEditingRequest(request);
    onEditOpen();
  };

  const handleEditRequest = async () => {
    try {
      const payload = {
        status: editingRequest.status,
        approver: "6772c2db651bde59f0ee1915", // Thay bằng ID thật của người phê duyệt
        comments: editingRequest.comments,
      };
      await axiosInstance.put(`http://localhost:3001/leave-request/${editingRequest._id}`, payload);
      alert("Cập nhật yêu cầu nghỉ thành công!");
      setReload(!reload);
      onEditClose();
    } catch (err) {
      alert("Có lỗi xảy ra khi cập nhật yêu cầu nghỉ.");
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leaveResponse, userResponse] = await Promise.all([
          axiosInstance.get("http://localhost:3001/leave-request/allLeaveRequests"),
          axiosInstance.get("http://localhost:3001/employee/getAllUser"),
        ]);

        if (leaveResponse.data.status === "OK" && userResponse.data.status === "OK") {
          setLeaveRequests(leaveResponse.data.data);
          setUsers(userResponse.data.data);
          setFilteredRequests(leaveResponse.data.data);
        } else {
          setError("Không thể tải dữ liệu.");
        }
      } catch (err) {
        setError("Có lỗi xảy ra khi kết nối tới máy chủ.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [reload]);

  const handleAddLeave = async () => {
    try {
      const payload = { ...newLeaveData };
      if (newLeaveType === "halfDay") {
        payload.endDate = payload.startDate;
      }

      await axiosInstance.post("http://localhost:3001/leave-request/addLeaveRequest", payload);
      alert("Thêm yêu cầu nghỉ thành công!");
      onClose();
      setReload(!reload)
    } catch (err) {
      alert("Có lỗi xảy ra khi thêm yêu cầu nghỉ.");
    }
  };

  const handleLeaveTypeChange = (type) => {
    setNewLeaveType(type);
    const today = new Date().toISOString().split("T")[0];

    if (type === "oneDay") {
      setNewLeaveData((prev) => ({ ...prev, startDate: moment(new Date()).set("h", 8).format("yyyy-MM-DDThh:mm"), endDate: moment(new Date()).set("h", 16).format("yyyy-MM-DDThh:mm") }));
    } else if (type === "halfDay" || type === "multipleDays") {
      setNewLeaveData((prev) => ({ ...prev, startDate: today, endDate: today }));
    }
  };

  const filterRequests = () => {
    let filtered = leaveRequests;

    if (filterDate) {
      const date = new Date(filterDate);
      filtered = filtered.filter((request) => {
        const startDate = new Date(request.startDate);
        const endDate = new Date(request.endDate);
        return date >= startDate && date <= endDate;
      });
    }

    if (filterStatus) {
      filtered = filtered.filter((request) => request.status === filterStatus);
    }

    if (filterUserId) {
      filtered = filtered.filter((request) => request.user._id === filterUserId);
    }

    setFilteredRequests(filtered);
  };


  const handleAction = async (id, status) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"))
      await axiosInstance.put(`http://localhost:3001/leave-request/${id}`, {
        status,
        approver: user?.data?._id, // Replace with the actual approver ID if needed
        comments: status === "Approved" ? "Yêu cầu được duyệt." : "Yêu cầu bị từ chối."
      });
      setFilteredRequests((prev) =>
        prev.map((request) =>
          request._id === id ? { ...request, status } : request
        )
      );
    } catch (err) {
      alert("Có lỗi xảy ra khi cập nhật trạng thái.");
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
        Danh sách yêu cầu nghỉ phép
      </Text>

      <Box display="flex" gap={4} mb={5}>
        <Input
          type="date"
          placeholder="Chọn ngày"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
        <Select
          placeholder="Lọc theo trạng thái"
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="Pending">Chờ duyệt</option>
          <option value="Approved">Đã duyệt</option>
          <option value="Rejected">Từ chối</option>
        </Select>
        <Select
          placeholder="Chọn người dùng"
          onChange={(e) => setFilterUserId(e.target.value)}
        >
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.username}
            </option>
          ))}
        </Select>
        <Button colorScheme="teal" onClick={filterRequests}>
          Lọc
        </Button>
      </Box>


      <Box display="flex" gap={4} mb={5}>



        <Button colorScheme="blue" onClick={onOpen}>
          Thêm yêu cầu nghỉ
        </Button>
      </Box>

      <TableContainer>
        <Table variant="striped" colorScheme="teal">
          <Thead>
            <Tr>
              <Th>Người yêu cầu</Th>
              <Th>Email</Th>
              <Th>Ngày bắt đầu</Th>
              <Th>Ngày kết thúc</Th>
              <Th>Lý do</Th>
              <Th>Trạng thái</Th>
              <Th>Hành động</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedRequests.map((request) => (
              <Tr key={request._id}>
                <Td>{request.user.username}</Td>
                <Td>{request.user.email}</Td>
                <Td>{new Date(request.startDate).toLocaleDateString("vi-VN")}</Td>
                <Td>{new Date(request.endDate).toLocaleDateString("vi-VN")}</Td>
                <Td>{request.reason}</Td>
                <Td>{request.status}</Td>
                <Td>
                  {request.status === "Pending" && (
                    <>
                      <Button
                        colorScheme="green"
                        size="sm"
                        onClick={() => handleAction(request._id, "Approved")}
                      >
                        Duyệt
                      </Button>
                      <Button
                        colorScheme="red"
                        size="sm"
                        onClick={() => handleAction(request._id, "Rejected")}
                        ml={2}
                      >
                        Từ chối
                      </Button>
                    </>
                  )}
                  <Button
                    colorScheme="teal"
                    ml={2}
                    size="sm"
                    onClick={() => openEditModal(request)}
                  >
                    Chỉnh sửa
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>

        </Table>
      </TableContainer>
      <Box mt={4} display="flex" justifyContent="space-between" alignItems="center">
        <Text>
          Hiển thị {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredRequests.length)} trong {filteredRequests.length} mục
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

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Thêm yêu cầu nghỉ</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <RadioGroup onChange={handleLeaveTypeChange} value={newLeaveType}>
              <Stack direction="row">
                <Radio value="oneDay">Nghỉ 1 ngày</Radio>
                <Radio value="multipleDays">Nghỉ nhiều ngày</Radio>
                <Radio value="halfDay">Nghỉ nửa ngày</Radio>
              </Stack>
            </RadioGroup>

            <Input
              mt={4}
              placeholder="Ngày bắt đầu"
              type="datetime-local"
              value={newLeaveData.startDate}
              onChange={(e) =>
                newLeaveType === 'oneDay' ?
                  setNewLeaveData((prev) =>
                    ({ ...prev, startDate: moment(e.target.value).set('h', 8).format("yyyy-MM-DDThh:mm"), endDate: moment(e.target.value).set('h', 16).format("yyyy-MM-DDThh:mm") }))
                  : newLeaveType === 'multipleDays' ? setNewLeaveData((prev) =>
                    ({ ...prev, startDate: moment(e.target.value).set('h', 8).format("yyyy-MM-DDThh:mm") })) : setNewLeaveData((prev) =>
                      ({ ...prev, startDate: moment(e.target.value).format("yyyy-MM-DDThh:mm") }))
              }
            />
            {newLeaveType !== "oneDay" && (
              <Input
                mt={4}
                placeholder="Ngày kết thúc"
                type="datetime-local"
                value={newLeaveData.endDate}
                onChange={(e) =>
                  setNewLeaveData((prev) => ({ ...prev, endDate: moment(e.target.value).format("yyyy-MM-DDThh:mm") }))
                }
              />
            )}

            <Input
              mt={4}
              placeholder="Lý do"
              onChange={(e) =>
                setNewLeaveData((prev) => ({ ...prev, reason: e.target.value }))
              }
            />
            <Select
              mt={4}
              placeholder="Chọn người dùng"
              onChange={(e) =>
                setNewLeaveData((prev) => ({ ...prev, userId: e.target.value }))
              }
            >
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.username}
                </option>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddLeave}>
              Thêm
            </Button>
            <Button onClick={onClose}>Hủy</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Chỉnh sửa yêu cầu nghỉ</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Select
              placeholder="Trạng thái"
              value={editingRequest?.status || ""}
              onChange={(e) =>
                setEditingRequest((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              <option value="Approved">Đã duyệt</option>
              <option value="Rejected">Từ chối</option>
            </Select>
            <Input
              mt={4}
              placeholder="Bình luận"
              value={editingRequest?.comments || ""}
              onChange={(e) =>
                setEditingRequest((prev) => ({ ...prev, comments: e.target.value }))
              }
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleEditRequest}>
              Cập nhật
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
