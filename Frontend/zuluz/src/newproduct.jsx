import React, { useEffect, useState } from "react";
import Header from "./header";
import { motion } from "framer-motion";
import axios from "axios";
const API = process.env.REACT_APP_API_URL;

export default function NewProduct() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${API}/api/newproduct/newproductshow`
        );
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div style={{ overflowX: "hidden" }}>
      <Header />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{ backgroundColor: "#FFF5EB" }}
        className="container-fluid px-3"
      >
        <motion.div
          className="text-center mb-5 pt-4"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h5 className="fw-bold">New Product</h5>
          <small>Home / New Product</small>
        </motion.div>

        {products.map((product, index) => (
          <div key={index} className="row g-4 justify-content-center pb-5">
            {/* Left side: Two stacked images */}
            <div className="col-12 col-lg-6 d-flex flex-column gap-4">
              {/* Top Image with overlay */}
              <motion.div
                className="position-relative rounded overflow-hidden shadow"
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <img
                  src={`${API}/uploads/${product.images[0]}`}
                  alt={product.title}
                  className="img-fluid w-100"
                  style={{
                    width: "100%",
                    height: "300px",
                    objectFit: "cover",
                  }}
                />
                <motion.div
                  className="position-absolute bottom-0 start-0 end-0 p-3 text-white"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))",
                  }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <h6 className="fw-bold">{product.title}</h6>
                  <p className="mb-0 small">{product.description}</p>
                </motion.div>
              </motion.div>

              {/* Second Image */}
              <motion.div
                className="rounded overflow-hidden shadow"
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <img
                  src={`${API}/uploads/${product.images[1]}`}
                  alt={product.title + " - 2"}
                  className="img-fluid w-100"
                  style={{
                    width: "100%",
                    height: "300px",
                    objectFit: "cover",
                  }}
                />
              </motion.div>
            </div>

            {/* Right side: Third Image */}
            <motion.div
              className="col-12 col-lg-5 d-flex align-items-center justify-content-center"
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-100 text-center">
                <img
                  src={`${API}/uploads/${product.images[2]}`}
                  alt={product.title + " - 3"}
                  className="img-fluid rounded"
                  style={{
                    width: "75%",
                    height: "300px",
                    objectFit: "cover",
                  }}
                />
              </div>
            </motion.div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
