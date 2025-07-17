import "./App.css";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";


// Pages
import Desktop from "./Desktop";
import AllProduct from "./allproduct";
import ShopByCategories from "./shopbycategories";
import LoginPage from "./login";
import Registration from "./registration";
import NewProduct from "./newproduct";
import OurStory from "./ourstory";
import Contactus from "./contactus";
import Singleproduct from "./singleproduct";
import AddProduct from "./addproduct";
import Checkout from "./checkout";
import Cart from "./cart";
import Pay2 from "./payment";
import Wishlist from "./wishlist";
import UserProfile from "./userprofile";

// Layout
import Header from "./header";
import Footer from "./footer";

// Global Loader Context
import { LoaderProvider, useLoader } from "./LoaderContext";

// 🔄 Scroll and show loader on route change
function ScrollToTopAndShowLoader() {
  const { pathname } = useLocation();
  const { setIsLoading } = useLoader();

  useEffect(() => {
    setIsLoading(true);
    window.scrollTo(0, 0);
    const timeout = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
}

function AnimatedCenterLoader() {
  const { isLoading } = useLoader();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="center-loader-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="center-loading-bar"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// 💡 Global loader display
function GlobalLoader() {
  const { isLoading } = useLoader();

  if (!isLoading) return null;

  return (
    <div className="full-page-loader">
      <div className="loader-box">
        <div className="spinner-border text-dark" role="status" />
        <span className="ms-3">Loading...</span>
      </div>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const hideFooterRoutes = ["/login", "/registration"];

  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  return (
    <>
      <ScrollToTopAndShowLoader />
      <AnimatedCenterLoader  />

      <Routes>
        <Route path="/" element={<Desktop />} />
        <Route path="/allproduct" element={<AllProduct />} />
        <Route path="/shopbycategory" element={<ShopByCategories />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/newproduct" element={<NewProduct />} />
        <Route path="/ourstory" element={<OurStory />} />
        <Route path="/contactus" element={<Contactus />} />
        <Route path="/singleproduct/:id" element={<Singleproduct />} />
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/payment" element={<Pay2 />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/userprofile" element={<UserProfile />} />
      </Routes>

      {!shouldHideFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <LoaderProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </LoaderProvider>
  );
}

export default App;
