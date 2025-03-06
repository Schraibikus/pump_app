import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import { SchemeBuilder } from "./components/SchemeBuilder";
import { Layout } from "./Layout/Layout";
import { MainPage } from "./pages/MainPage";
import { useAppDispatch, useAppSelector } from "./hooks/useReduxHooks";
import { fetchProducts } from "./store/modules/products/thunk";
import { OrdersPage } from "./pages/OrdersPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProductGroupPage } from "./pages/ProductGroupPage";
import { OrderDone } from "./pages/OrderDone";

const App = () => {
  const dispatch = useAppDispatch();
  const { products, isLoaded } = useAppSelector((state) => state.products);
  // console.log(products);

  useEffect(() => {
    if (!isLoaded) {
      dispatch(fetchProducts());
    }
  }, [dispatch, isLoaded]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<MainPage />} />
        {products.map(({ path, id, src, width, drawing, name, head }) => (
          <Route
            key={id}
            path={`/${head}${path}`}
            element={
              <SchemeBuilder
                schemaSrc={src}
                productId={id}
                productWidth={width}
                productDrawing={drawing || 0}
                productName={name}
                productHead={head}
              />
            }
          />
        ))}
        <Route path="/:head" element={<ProductGroupPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orderDone" element={<OrderDone />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default App;
