import { Route, Routes } from "react-router-dom";
import DefaultLayout from "./layouts";
import { routes } from "./routes";
import { Fragment } from "react";

function App() {
  return (
    <Routes>
      {routes.map((route, index) => {
        const Layout = route.isShowHeader ? DefaultLayout : Fragment;
        const Page = route.page;
        return (
          <Route
            key={index}
            path={route.path}
            element={
              <Layout>
                <Page />
              </Layout>
            }
          />
        );
      })}
    </Routes>
  );
}

export default App;
