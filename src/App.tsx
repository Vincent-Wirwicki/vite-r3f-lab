import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        {
          path: "about",
          lazy: () => import("./pages/About"),
        },
        {
          path: "disp-gallery-1",
          lazy: () => import("./pages/DispGallery"),
        },
        {
          path: "basic-1",
          lazy: () => import("./pages/gallery/basic/Demo1Page"),
        },
        {
          path: "abstract-1",
          lazy: () => import("./pages/abstract/Page"),
        },
        {
          path: "bg-1",
          lazy: () => import("./pages/background/Page"),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />;
};

export default App;
