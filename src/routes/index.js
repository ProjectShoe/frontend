import SignIn from "../pages/signIn/index";
import Employee from "../pages/employee/index";
import TimeKeeping from "../pages/timekeeping";
import OnLeave from "../pages/onLeave";
import Products from "../pages/products";
import Order from "../pages/order";
import Customer from "../pages/customers";
import SaleStatistics from "../pages/sale-statistics/index.js";
import ProductStatstics from "../pages/product-statstics/index.js";

export const routes = [
  { path: "/login", page: SignIn, isShowHeader: false },
  {
    path: "/",
    page: Employee,
    isShowHeader: true,
  },
  {
    path: "/timekeeping",
    page: TimeKeeping,
    isShowHeader: true,
  },
  {
    path: "/on-leave",
    page: OnLeave,
    isShowHeader: true,
  },
  {
    path: "/product-shoe",
    page: Products,
    isShowHeader: true,
  },
  {
    path: "/orders",
    page: Order,
    isShowHeader: true,
  },
  {
    path: "/customer",
    page: Customer,
    isShowHeader: true,
  },
  {
    path: "/sales-statistics",
    page: SaleStatistics,
    isShowHeader: true,
  },
  {
    path: "/product-statistics",
    page: ProductStatstics,
    isShowHeader: true,
  },
  {
    path: "/customer",
    page: Customer,
    isShowHeader: true,
  },
];
