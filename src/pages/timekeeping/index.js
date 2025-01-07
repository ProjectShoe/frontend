import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Heading,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Textarea,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import { axiosInstance } from "../../api/client.js";

export default function TimeKeeping() {
  const [timecards, setTimecards] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newTimecard, setNewTimecard] = useState({
    userId: "",
    checkinAt: "",
    status: "",
    note: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Số mục hiển thị mỗi trang

  // Tính toán danh sách chấm công cho trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  console.log(indexOfLastItem);
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Tính tổng số trang
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Hàm chuyển trang
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  useEffect(() => {
    // Lấy dữ liệu từ API
    const fetchData = async () => {
      try {
        setLoading(true);
        const [timecardsResponse, usersResponse] = await Promise.all([
          axiosInstance.get("http://localhost:3001/time-card/getAllTimecards"),
          axiosInstance.get("http://localhost:3001/employee/getAllUser"),
        ]);

        setTimecards(timecardsResponse.data.data);
        setUsers(usersResponse.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [reload]);

  useEffect(() => {
    // Lọc dữ liệu theo ngày và nhân viên
    let filtered = timecards;

    if (selectedDate) {
      filtered = filtered.filter((timecard) => {
        const checkinDate = new Date(timecard.checkinAt)
          .toISOString()
          .split("T")[0];
        return checkinDate === selectedDate;
      });
    }

    if (selectedUser) {
      filtered = filtered.filter(
        (timecard) => timecard.userId._id === selectedUser
      );
    }

    setFilteredData(filtered);
  }, [selectedDate, selectedUser, timecards]);

  const handleAddTimecard = async () => {
    try {
      const response = await axiosInstance.post(
        "http://localhost:3001/time-card/addTimecard",
        newTimecard
      );
      setReload(!reload);
      onClose();
    } catch (error) {
      console.error("Lỗi khi thêm chấm công", error);
    }
  };

  const handleCheckOut = async (timecardId, checkinAt) => {
    try {
      const checkoutAt = checkinAt
        ? new Date(
            new Date(checkinAt).getTime() + 8 * 60 * 60 * 1000
          ).toISOString()
        : new Date().toISOString();
      const status = "checked-out";
      const note = "Tự động check-out với thời gian làm 8 giờ";

      await axiosInstance.put(`http://localhost:3001/time-card/${timecardId}`, {
        checkoutAt,
        status,
        note,
      });

      setReload(!reload);
    } catch (error) {
      console.error("Lỗi khi check-out", error);
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" mt="20">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Heading mb={4}>Danh sách chấm công</Heading>

      <Box justifyContent="space-between" display="flex" gap={4} mb={4}>
        <Box gap={5} display="flex" alignItems="center">
          <label htmlFor="date">Ngày:</label>
          <input
            id="date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </Box>

        <Box display="flex" gap={5} alignItems="center" width="fit-content">
          <label style={{ width: "110px" }} htmlFor="user">
            Nhân viên:
          </label>
          <Select
            id="user"
            placeholder="Tất cả nhân viên"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username} ({user.email})
              </option>
            ))}
          </Select>
        </Box>

        <Button colorScheme="teal" onClick={onOpen}>
          Thêm chấm công
        </Button>
      </Box>

      <Table variant="striped" colorScheme="teal">
        <Thead>
          <Tr>
            <Th>Nhân viên</Th>
            <Th>Giờ vào</Th>
            <Th>Giờ ra</Th>
            <Th>Số giờ làm</Th>
            <Th>Trạng thái</Th>
            <Th>Hành động</Th>
          </Tr>
        </Thead>
        <Tbody>
          {paginatedData.map((timecard) => {
            const isIncomplete =
              timecard.hoursWorked < 8 || !timecard.checkoutAt;
            return (
              <Tr
                key={timecard._id}
                bgColor={isIncomplete ? "red.100" : "transparent"}
              >
                <Td>{timecard?.userId?.username || "Không xác định"}</Td>
                <Td>{new Date(timecard.checkinAt).toLocaleString()}</Td>
                <Td>
                  {timecard.checkoutAt
                    ? new Date(timecard.checkoutAt).toLocaleString()
                    : "Chưa check-out"}
                </Td>
                <Td>{timecard.hoursWorked || 0}</Td>
                <Td>{timecard.status}</Td>
                <Td>
                  {isIncomplete && (
                    <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={() =>
                        handleCheckOut(timecard._id, timecard.checkinAt)
                      }
                    >
                      Check-out
                    </Button>
                  )}
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      <Box
        mt={4}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text>
          Hiển thị {indexOfFirstItem + 1} -{" "}
          {Math.min(indexOfLastItem, filteredData.length)} trong{" "}
          {filteredData.length} mục
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
          <ModalHeader>Thêm chấm công mới</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mb={4}>
              <label>Nhân viên:</label>
              <Select
                placeholder="Chọn nhân viên"
                value={newTimecard.userId}
                onChange={(e) =>
                  setNewTimecard({ ...newTimecard, userId: e.target.value })
                }
              >
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.username}
                  </option>
                ))}
              </Select>
            </Box>
            <Box mb={4}>
              <label>Giờ vào:</label>
              <Input
                type="datetime-local"
                value={newTimecard.checkinAt}
                onChange={(e) =>
                  setNewTimecard({ ...newTimecard, checkinAt: e.target.value })
                }
              />
            </Box>
            <Box mb={4}>
              <label>Trạng thái:</label>
              <Select
                placeholder="Chọn trạng thái"
                value={newTimecard.status}
                onChange={(e) =>
                  setNewTimecard({ ...newTimecard, status: e.target.value })
                }
              >
                <option value="checked-in">Đã check-in</option>
                <option value="checked-out">Đã check-out</option>
                <option value="absent">Vắng mặt</option>
              </Select>
            </Box>
            <Box mb={4}>
              <label>Ghi chú:</label>
              <Textarea
                value={newTimecard.note}
                onChange={(e) =>
                  setNewTimecard({ ...newTimecard, note: e.target.value })
                }
              />
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleAddTimecard}>
              Thêm
            </Button>
            <Button onClick={onClose}>Hủy</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
