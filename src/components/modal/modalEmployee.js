import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import AvatarUpload from "../avatar";
import { axiosInstance } from "../../api/client.js";
import toast from "react-hot-toast";
import moment from "moment/moment.js";

export default function ModalEmployee({ onClose, isOpen, userData = null }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    startTime: "",
    bankCode: "",
    code: "",
  });

  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (userData) {
      setFormData({
        username: userData.fullName || "",
        email: userData.contact.split(", ")[1] || "",
        password: "", // Mật khẩu không được lấy từ dữ liệu hiện có
        phone: userData.contact.split(", ")[0] || "",
        address: userData.currentAddress || "",
        startTime: userData.startTime || "",
        bankCode: userData.bankInfo || "",
        code: userData.code || "",
      });
    } else {
      setFormData({
        username: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        startTime: "",
        bankCode: "",
        code: "",
      })
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (file) => {
    setImageFile(file);
  };

  const handleSubmit = async () => {
    let hasError = false;

    // Kiểm tra các trường bắt buộc
    if (!formData.username) {
      toast.error("Vui lòng nhập Username!");
      hasError = true;
    }

    if (!formData.email) {
      toast.error("Vui lòng nhập Email!");
      hasError = true;
    }

    if (!formData.startTime) {
      toast.error("Vui lòng nhập Ngày vào làm!");
      hasError = true;
    }

    if (!formData.bankCode) {
      toast.error("Vui lòng nhập Số tài khoản ngân hàng!");
      hasError = true;
    }

    if (!formData.code) {
      toast.error("Vui lòng nhập Mã nhân viên!");
      hasError = true;
    }

    // Nếu có lỗi, không tiếp tục
    if (hasError) {
      return;
    }
    try {
      const formDataPayload = new FormData();

      // Append form fields
      for (const key in formData) {
        formDataPayload.append(key, formData[key]);
      }

      // Append image file if present
      if (imageFile) {
        formDataPayload.append("image", imageFile);
      }

      if (userData) {
        // Cập nhật người dùng (PUT request)

        await axiosInstance.put(`http://localhost:3001/employee/${userData.id}`, formDataPayload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("okok");

        toast.success("Cập nhật nhân viên thành công!");
      } else {
        await axiosInstance.post("http://localhost:3001/employee/addUser", formDataPayload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Thêm nhân viên thành công!");
      }

      onClose(); // Đóng modal sau khi thành công
    } catch (error) {
      console.error("Error saving employee:", error);
      toast.error(error.response.data.message);
    }
  };


  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <Box
          maxW="md"
          mx="auto"
          maxH={"90vh"}
          overflowY={"auto"}
          p={6}
          bg="white"
          borderRadius={"10px"}
        >
          <VStack spacing={4}>
            {/* Upload Avatar */}
            <FormControl>
              <FormLabel>Ảnh đại diện</FormLabel>
              <AvatarUpload setImageFile={handleImageUpload} />
            </FormControl>

            <HStack>
              {/* Username */}
              <FormControl isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  name="username"
                  placeholder="Nhập username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </FormControl>

              {/* Email */}
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  name="email"
                  placeholder="Nhập email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </FormControl>
            </HStack>

            {!userData && (
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  name="password"
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                />
              </FormControl>
            )}

            <HStack>
              {/* Phone */}
              <FormControl>
                <FormLabel>Phone</FormLabel>
                <Input
                  type="tel"
                  name="phone"
                  placeholder="Nhập số điện thoại"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </FormControl>

              {/* Address */}
              <FormControl>
                <FormLabel>Address</FormLabel>
                <Input
                  type="text"
                  name="address"
                  placeholder="Nhập địa chỉ"
                  value={formData.address}
                  onChange={handleChange}
                />
              </FormControl>
            </HStack>

            {/* Start Date */}
            <FormControl isRequired>
              <FormLabel>Ngày tháng năm vào làm</FormLabel>
              <Input
                type="date"
                name="startTime"
                value={moment(new Date(formData.startTime)).format("yyyy-MM-DD")}

                onChange={handleChange}
              />
            </FormControl>

            {/* Bank Account */}
            <FormControl isRequired>
              <FormLabel>Số tài khoản ngân hàng</FormLabel>
              <Input
                type="text"
                name="bankCode"
                placeholder="Nhập số tài khoản ngân hàng"
                value={formData.bankCode}
                onChange={handleChange}
              />
            </FormControl>

            {/* Code */}
            <FormControl isRequired>
              <FormLabel>Mã nhân viên</FormLabel>
              <Input
                type="text"
                name="code"
                placeholder="Nhập mã nhân viên"
                value={formData.code}
                onChange={handleChange}
                disabled={!!userData} // Không cho phép chỉnh sửa mã nhân viên khi cập nhật
              />
            </FormControl>

            {/* Submit Button */}
            <Button
              backgroundImage="var(--color-button)"
              width="full"
              _hover={{
                backgroundImage: "var(--color-button)",
              }}
              _active={{
                backgroundImage: "var(--color-button)",
              }}
              onClick={handleSubmit}
            >
              <Text
                fontSize={{ base: "15px" }}
                fontWeight={600}
                color="var(--color-main)"
              >
                {userData ? "Cập nhật nhân viên" : "Thêm nhân viên"}
              </Text>
            </Button>
          </VStack>
        </Box>
      </ModalContent>
    </Modal>
  );
}
