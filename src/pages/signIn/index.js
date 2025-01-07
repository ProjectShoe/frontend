import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Stack,
  FormControl,
  Input,
  Checkbox,
  Link,
  Button,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import { loginUser } from "../../redux/slices/apiRequestsSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import BackgroundLogin from "../../assets/images/signIn/background-login.png";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const passwordValue = watch("password");

  const handleSignIn = (data) => {
    const { email, password } = data;
    const newUser = {
      email,
      password,
    };

    loginUser(newUser, dispatch, navigate);
  };
  return (
    <Flex
      backgroundImage={`url(${BackgroundLogin})`}
      backgroundRepeat={"no-repeat"}
      backgroundColor="var(--color-background)"
      h={"100vh"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Box
        padding={{ base: "40px" }}
        borderRadius={{ base: "16px" }}
        w={{ base: "500px" }}
        minHeight={{ base: "500px" }}
        backgroundColor="var(--color-main)"
        position={"relative"}
      >
        <Flex
          h={"100%"}
          w={"100%"}
          flexDirection={{ base: "column" }}
          alignItems={{ base: "center" }}
        >
          {/* <Image src={logoLogin} /> */}
          <Text
            fontSize={{ base: "26px" }}
            fontWeight={600}
            mt={{ base: "23px" }}
            mb={{ base: "36px" }}
          >
            Đăng nhập
          </Text>
          <Box w={"100%"}>
            <form onSubmit={handleSubmit(handleSignIn)}>
              <Flex flexDirection={{ base: "column" }}>
                <FormControl mb={{ base: "16px" }}>
                  <Text fontSize={{ base: "12px" }} fontWeight={500}>
                    Tên đăng nhập
                  </Text>
                  <Input
                    type="email"
                    fontSize={{ base: "14px" }}
                    padding={"0px"}
                    borderRadius={"0px"}
                    border={"none"}
                    borderBottom={"1px solid #E1E1E1"}
                    placeholder="Nhập email"
                    _focus={{
                      boxShadow: "none",
                      borderColor: "#E1E1E1",
                    }}
                    {...register("email", {
                      required: "Tên đăng nhập là bắt buộc",
                    })}
                  />
                  {errors.email && (
                    <Text fontSize={{ base: "12px" }} color={"red"}>
                      {errors.email.message}
                    </Text>
                  )}
                </FormControl>
                <FormControl id="password" mb={{ base: "13px" }}>
                  <Text fontSize={{ base: "12px" }} fontWeight={500}>
                    Mật khẩu
                  </Text>
                  <InputGroup>
                    <Input
                      fontSize={{ base: "14px" }}
                      padding={"0px"}
                      borderRadius={"0px"}
                      border={"none"}
                      borderBottom={"1px solid #E1E1E1"}
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu "
                      _focus={{
                        boxShadow: "none",
                        borderColor: "#E1E1E1",
                      }}
                      {...register("password", {
                        required: "Mật khẩu là bắt buộc",
                      })}
                    />
                    {passwordValue && (
                      <InputRightElement>
                        <IconButton
                          _hover={{
                            bg: "var(--color-main)",
                          }}
                          backgroundColor={"none"}
                          icon={showPassword ? <ViewIcon /> : <ViewOffIcon />}
                          onClick={() => setShowPassword(!showPassword)}
                          variant="ghost"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        />
                      </InputRightElement>
                    )}
                  </InputGroup>
                  {errors.password && (
                    <Text fontSize={{ base: "12px" }} color={"red"}>
                      {errors.password.message}
                    </Text>
                  )}
                </FormControl>
                <Stack
                  fontSize={{ base: "12px" }}
                  direction="row"
                  justify="space-between"
                  align="center"
                  pb={{ base: "58px" }}
                >
                  <Checkbox>
                    <Text
                      fontSize={{ base: "13px" }}
                      lineHeight={"normal"}
                      color="var(--color-info-employee)"
                    >
                      Lưu mật khẩu
                    </Text>
                  </Checkbox>
                  <Link
                    href="#"
                    color="var(--color-option-employee-hover)"
                    fontSize={"13px"}
                    fontWeight={600}
                    lineHeight={"normal"}
                  >
                    Quên mật khẩu?
                  </Link>
                </Stack>
                <Button
                  backgroundImage="var(--color-button)"
                  _hover={{
                    backgroundImage: "var(--color-button)",
                  }}
                  type="submit"
                >
                  <Text
                    color={"#FFF"}
                    fontSize={{ base: "15px" }}
                    fontWeight={700}
                  >
                    Đăng nhập
                  </Text>
                </Button>
              </Flex>
            </form>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}
