import iconEmployee from "../assets/icons/sider/employee.svg";
import iconProduct from "../assets/icons/sider/product.svg";
import iconSell from "../assets/icons/sider/sell.svg";
import iconSales from "../assets/icons/sider/sales.svg";
import iconCustomer from "../assets/icons/sider/customer.svg";
export const enumMenu = [
  {
    path: "#",
    name: "Quản lý nhân sự",
    icon: iconEmployee,
    children: [
      {
        path: "/",
        name: "Quản lý nhân viên",
      },
      {
        path: "/timekeeping",
        name: "Quản lý chấm công",
      },
      {
        path: "/on-leave",
        name: "Xin nghỉ phép",
      },
    ],
  },
  {
    path: "#",
    name: "Quản lý sản phẩm",
    icon: iconProduct,
    children: [
      {
        path: "/product-shoe",
        name: "Quản lý sản phẩm",
      },
    ],
  },
  {
    path: "#",
    name: "Quản lý bán hàng",
    icon: iconSell,
    children: [
      {
        path: "/customer",
        name: "Quản lý khách hàng",
      },
      {
        path: "/orders",
        name: "Quản lý đơn hàng",
      },
    ],
  },

  {
    path: "#",
    name: "Thống kê",
    icon: iconSales,
    children: [
      {
        path: "/sales-statistics",
        name: "Quản lý doanh số",
      },
      {
        path: "/product-statistics",
        name: "Sản phẩm bán chạy",
      },
      // {
      //   path: "/customer-statistics",
      //   name: "Khách hàng",
      // },
    ],
  },
];
