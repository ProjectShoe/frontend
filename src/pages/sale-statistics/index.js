import React, { useEffect, useState } from "react";
import {
    Box,
    Text,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Spinner,
    Alert,
    AlertIcon,
    Button,
    Input,
    Flex,
} from "@chakra-ui/react";
import { axiosInstance } from "../../api/client.js";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SaleStatistics = () => {
    const [orders, setOrders] = useState([]);
    const [groupedData, setGroupedData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axiosInstance.get("http://localhost:3001/order");
                if (response.data.status === "OK") {
                    setOrders(response.data.data);
                    groupData(response.data.data);
                } else {
                    setError("Không thể tải danh sách đơn hàng.");
                }
            } catch (err) {
                setError("Có lỗi xảy ra khi kết nối tới máy chủ.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const groupData = (data) => {
        const filteredData = data.filter((order) => {
            const orderDate = new Date(order.createdAt);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;
            return (!start || orderDate >= start) && (!end || orderDate <= end);
        });

        const grouped = filteredData.reduce((acc, order) => {
            const dateKey = new Date(order.createdAt).toLocaleDateString("vi-VN");
            if (!acc[dateKey]) {
                acc[dateKey] = { date: dateKey, totalRevenue: 0, orderCount: 0 };
            }
            acc[dateKey].totalRevenue += order.totalPrice;
            acc[dateKey].orderCount += 1;
            return acc;
        }, {});

        setGroupedData(Object.values(grouped));
    };

    const handleFilter = () => {
        groupData(orders);
    };

    const chartData = {
        labels: groupedData.map((item) => item.date),
        datasets: [
            {
                label: "Doanh thu (VND)",
                data: groupedData.map((item) => item.totalRevenue),
                backgroundColor: "rgba(75, 192, 192, 0.5)",
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Thống kê doanh thu theo ngày",
            },
        },
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
            <Text fontSize="2xl" fontWeight="bold" mb={5}>
                Thống kê doanh thu theo ngày
            </Text>
            <Flex mb={5} gap={5} alignItems="center">
                <Input
                    type="date"
                    placeholder="Ngày bắt đầu"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <Input
                    type="date"
                    placeholder="Ngày kết thúc"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <Button colorScheme="teal" onClick={handleFilter}>
                    Lọc
                </Button>
            </Flex>
            <Box mb={5}>
                <Text fontSize="lg">
                    Tổng doanh thu:{" "}
                    <Text as="span" fontWeight="bold" color="teal.500">
                        {groupedData.reduce((sum, item) => sum + item.totalRevenue, 0).toLocaleString()} VND
                    </Text>
                </Text>
                <Text fontSize="lg">
                    Tổng số đơn hàng:{" "}
                    <Text as="span" fontWeight="bold" color="teal.500">
                        {groupedData.reduce((sum, item) => sum + item.orderCount, 0)}
                    </Text>
                </Text>
            </Box>
            <Box mb={10}>
                <Bar data={chartData} options={chartOptions} />
            </Box>
            <TableContainer>
                <Table variant="striped" colorScheme="teal">
                    <Thead>
                        <Tr>
                            <Th>STT</Th>
                            <Th>Ngày</Th>
                            <Th>Doanh thu</Th>
                            <Th>Số đơn hàng</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {groupedData.map((item, index) => (
                            <Tr key={index}>
                                <Td>{index + 1}</Td>
                                <Td>{item.date}</Td>
                                <Td>{item.totalRevenue.toLocaleString()} VND</Td>
                                <Td>{item.orderCount}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default SaleStatistics;
