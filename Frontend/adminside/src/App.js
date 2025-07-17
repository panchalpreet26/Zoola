import logo from "./logo.svg";
import "./App.css";
import Sidebar from "./page/Sidebar";
import Header from "./page/Header";
import Dashboard from "./page/Dashboard";
import Footer from "./page/Footer";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Buttons from "./page/button";
import Addproduct from "./page/addproduct";
import Order from "./page/order";
import User from "./page/user";
import Allproducts from "./page/allproducts";
import OrderHistory from "./page/orderhistory";
import EditProduct from "./page/editproduct";
import AdminBannerUpload from "./page/uploadbanner";
import AddNewProduct from "./page/newproductadd";
import ManageNewProducts from "./page/managenewproduct";
import AdminContentManager from "./page/storypageManage";


function App() {
  return (
    
    <div className="App">
      <div className="container-scroller">
        <Sidebar></Sidebar>
        <div className="container-fluid page-body-wrapper">
          <Header></Header>
          <div className="main-panel">
            
            <Routes>
              <Route path="/" element={<Dashboard></Dashboard>}></Route>
              <Route path="/button" element={<Buttons></Buttons>}></Route>
              <Route path="/addproduct" element={<Addproduct></Addproduct>}></Route>
              <Route path="//order" element={<Order></Order>}></Route>
              <Route path="/user" element={<User></User>}></Route>
              <Route path="/allproducts" element={<Allproducts></Allproducts>}></Route>
              <Route path="/orderhistory" element={<OrderHistory></OrderHistory>}></Route>
              <Route path="/editproduct/:id" element={<EditProduct></EditProduct>}></Route>
              <Route path="/uploadbanner" element={<AdminBannerUpload></AdminBannerUpload>}></Route>
              <Route path="/newproduct" element={<AddNewProduct></AddNewProduct>}></Route>
              <Route path="/managenewproduct" element={<ManageNewProducts></ManageNewProducts>}></Route>
              <Route path="/managestorypage" element={<AdminContentManager></AdminContentManager>}></Route>
              
            </Routes>
            
            
          </div>
        </div>
      </div>
    </div>
    
  );
}

export default App;
