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
} from "@chakra-ui/react";
import { axiosInstance } from "../../api/client.js";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const ProductStatistics = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axiosInstance.get("http://localhost:3001/order");
                if (response.data.status === "OK") {
                    const orders = response.data.data;

                    // Nhóm doanh thu theo sản phẩm
                    const productRevenue = orders.reduce((acc, order) => {
                        order.products.forEach((product) => {
                            if (product.productId) {

                                const productId = product.productId?._id;
                                const productName = product.productId?.name;
                                const productRevenue = product.quantity * product.productId?.price;

                                if (!acc[productId]) {
                                    acc[productId] = {
                                        name: productName,
                                        revenue: 0,
                                        quantity: 0,
                                    };
                                }

                                acc[productId].revenue += productRevenue;
                                acc[productId].quantity += product.quantity;

                            }
                        });

                        return acc;
                    }, {});

                    // Chuyển thành mảng và sắp xếp theo doanh thu giảm dần
                    const sortedProducts = Object.values(productRevenue).sort(
                        (a, b) => b.revenue - a.revenue
                    );

                    setProducts(sortedProducts);
                } else {
                    setError("Không thể tải danh sách đơn hàng.");
                }
            } catch (err) {
                console.log(err);
                setError("Có lỗi xảy ra khi kết nối tới máy chủ.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const chartData = {
        labels: products.map((product) => product.name),
        datasets: [
            {
                label: "Doanh thu (VND)",
                data: products.map((product) => product.revenue),
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                    "#FF9F40",
                ],
                hoverBackgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                    "#FF9F40",
                ],
            },
        ],
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
                Thống kê doanh thu theo sản phẩm
            </Text>
            <Box mb={10} width="300px" mx="auto">
                <Pie data={chartData} />
            </Box>
            <TableContainer>
                <Table variant="striped" colorScheme="teal">
                    <Thead>
                        <Tr>
                            <Th>STT</Th>
                            <Th>Tên sản phẩm</Th>
                            <Th>Doanh thu</Th>
                            <Th>Số lượng bán</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {products.map((product, index) => (
                            <Tr key={index}>
                                <Td>{index + 1}</Td>
                                <Td>{product.name}</Td>
                                <Td>{product.revenue.toLocaleString()} VND</Td>
                                <Td>{product.quantity}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ProductStatistics;
