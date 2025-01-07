import React, { useState } from "react";
import {
  ChakraProvider,
  Box,
  IconButton,
  Avatar,
  VStack,
} from "@chakra-ui/react";
import { FaCamera } from "react-icons/fa";

function AvatarUpload(props) {
  const [image, setImage] = useState(null);
  const { setImageFile } = props;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <ChakraProvider>
      <VStack spacing={4}>
        <Box position="relative" w="120px" h="120px">
          <Avatar src={image} bg="gray.200" w="100px" h="100px" />
          <Box
            position="absolute"
            bottom="0"
            right="0"
            bg="white"
            rounded="full"
            p={2}
            shadow="md"
          >
            <IconButton
              icon={<FaCamera />}
              size="sm"
              variant="ghost"
              onClick={() => document.getElementById("avatarInput").click()}
            />
            <input
              id="avatarInput"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </Box>
        </Box>
      </VStack>
    </ChakraProvider>
  );
}

export default AvatarUpload;
