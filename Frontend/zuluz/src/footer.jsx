import React from "react";
function Footer() {
  return (
    <div>
      <footer className="bg-dark text-white pt-5 pb-3">
        <div className="container">
          <div className="row text-start">
            {/* Logo and Description */}
            <div className="col-md-6 mb-4">
              <h4 className="fw-bold mb-3">ZULAS</h4>
            </div>
            <div className="col-md-6">
              <p className="small pb-5 p-3">
                Zulas n More is a leading force in the world of furniture
                manufacturing, driven by a relentless commitment to
                craftsmanship, innovation, and design excellence. Having
                cumulative experience of 15+ Years,
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-7 d-flex justify-content-between text-start">
              <div className="col-md-2 mb-4">
                <h6 className="fw-bold mb-3">Shop</h6>
                <ul className="list-unstyled small  lh-2">
                  <li className="fs-6">Single Seats Swings</li>
                  <li>Acrylic Swings</li>
                  <li>Outdoor Swings</li>
                  <li>Macrame Swings</li>
                  <li>SS Swings</li>
                  <li>Wooden Swings</li>
                  <li>Designer Swings</li>
                </ul>
              </div>
              <div className="col-md-2 mb-4">
                <h6 className="fw-bold mb-3">Quick Link</h6>
                <ul className="list-unstyled small">
                  <li>Home</li>
                  <li>All Product</li>
                  <li>Shop by Categories</li>
                  <li>New Product</li>
                  <li>Our Story</li>
                  <li>Offers</li>
                  <li>Contact</li>
                </ul>
              </div>
              <div className="col-md-2 mb-4">
                <h6 className="fw-bold mb-3">Have Question?</h6>
                <ul className="list-unstyled small">
                  <li>Shipping Information</li>
                  <li>Return &amp; Exchange</li>
                  <li>Contact US</li>
                </ul>
              </div>
            </div>

            <div className="col-md-5">
              <div className="row">
                <div className="col-md-4"></div>
                <div className="col-md-8 text-start mb-4">
                  <h6 className="fw-bold mb-3">Join Our Community</h6>
                  <p className="small">
                    Enter your email below to be the first to know about new
                    collections and product launches.
                  </p>
                  <div className="input-group mb-3 rounded-pill overflow-hidden bg-light">
                    <input
                      type="text"
                      className="form-control border-light-0 bg-dark"
                      placeholder="Enter Your e-mail"
                    />
                    <button className="btn btn-outline-light border-light bg-dark border-0">
                      <i className="fas fa-arrow-right" />
                    </button>
                  </div>
                  {/* Social Icons */}
                  <div className="d-flex gap-3">
                    <button className="btn btn-outline-light rounded-circle">
                      <i className="fab fa-instagram" />
                    </button>
                    <button className="btn btn-outline-light rounded-circle">
                      <i className="fab fa-facebook-f" />
                    </button>
                    <button className="btn btn-outline-light rounded-circle">
                      <i className="fab fa-youtube" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center border-top border-light pt-3 mt-4 small">
            © ZULAS N MORE 2023
          </div>
        </div>
      </footer>
    </div>
  );
}
export default Footer;
