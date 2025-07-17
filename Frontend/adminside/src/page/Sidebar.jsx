import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div>
      <nav className="sidebar sidebar-offcanvas" id="sidebar">
        <div className="sidebar-brand-wrapper d-none d-lg-flex align-items-center justify-content-center fixed-top">
          <NavLink to="/" className="text-white text-decoration-none">
            <img
              src="/image/zulaslogo.png"
              alt="Zulas Logo"
              style={{
                height: "60px",
                width: "auto",
                objectFit: "contain",
                backgroundColor:"white"
              }}
              className="rounded"
            />
          </NavLink>
        </div>

        <ul className="nav">
          <li className="nav-item profile">
            <div className="profile-desc">
              <div className="profile-pic">
                <div className="count-indicator">
                  <img
                    className="img-xs rounded-circle"
                    src="assets/images/faces/face15.jpg"
                    alt=""
                  />
                  <span className="count bg-success" />
                </div>
                <div className="profile-name">
                  <h5 className="mb-0 font-weight-normal">Preet Panchal</h5>
                  <span>Admin</span>
                </div>
              </div>
            </div>
          </li>

          <li className="nav-item nav-category">
            <span className="nav-link">Navigation</span>
          </li>

          <li className="nav-item menu-items">
            <NavLink to="/" className="nav-link">
              <span className="menu-icon">
                <i className="mdi mdi-speedometer"></i>
              </span>
              Dashboard
            </NavLink>
          </li>

          {/* Product Management */}
          <li className="nav-item menu-items">
            <a
              className="nav-link"
              data-toggle="collapse"
              href="#productMenu"
              aria-expanded="false"
              aria-controls="productMenu"
            >
              <span className="menu-icon">
                <i className="mdi mdi-laptop" />
              </span>
              <span className="menu-title">Product Management</span>
              <i className="menu-arrow" />
            </a>
            <div className="collapse" id="productMenu">
              <ul className="nav flex-column sub-menu">
                <li className="nav-item">
                  <NavLink to="/addproduct" className="nav-link">
                    Add Product
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/allproducts" className="nav-link">
                    All Product
                  </NavLink>
                </li>
              </ul>
            </div>
          </li>

          {/* ✅ Orders Management Dropdown */}
          <li className="nav-item menu-items">
            <a
              className="nav-link"
              data-toggle="collapse"
              href="#orderMenu"
              aria-expanded="false"
              aria-controls="orderMenu"
            >
              <span className="menu-icon">
                <i className="mdi mdi-truck-delivery" />
              </span>
              <span className="menu-title">Orders Management</span>
              <i className="menu-arrow" />
            </a>
            <div className="collapse" id="orderMenu">
              <ul className="nav flex-column sub-menu">
                <li className="nav-item">
                  <NavLink to="/order" className="nav-link">
                    Orders
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/orderhistory" className="nav-link">
                    Orders History
                  </NavLink>
                </li>
              </ul>
            </div>
          </li>

          <li className="nav-item menu-items">
            <NavLink to="/user" className="nav-link">
              <span className="menu-icon">
                <i className="mdi mdi-table-large" />
              </span>
              Customer Management
            </NavLink>
          </li>
           <li className="nav-item menu-items">
            <NavLink to="/uploadbanner" className="nav-link">
              <span className="menu-icon">
                <i className="mdi mdi-table-large" />
              </span>
              Banner
            </NavLink>
          </li>
            <li className="nav-item menu-items">
            <a
              className="nav-link"
              data-toggle="collapse"
              href="#orderMenu"
              aria-expanded="false"
              aria-controls="orderMenu"
            >
              <span className="menu-icon">
                <i className="mdi mdi-truck-delivery" />
              </span>
              <span className="menu-title">New Product</span>
              <i className="menu-arrow" />
            </a>
            <div className="collapse" id="orderMenu">
              <ul className="nav flex-column sub-menu">
                <li className="nav-item">
                  <NavLink to="/newproduct" className="nav-link">
                    Add
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/managenewproduct" className="nav-link">
                    Manage New Product
                  </NavLink>
                </li>
               
              </ul>
            </div>
          </li>
          <li className="nav-item menu-items">
            <NavLink to="/managestorypage" className="nav-link">
              <span className="menu-icon">
                <i className="mdi mdi-table-large" />
              </span>
              Story Management
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
