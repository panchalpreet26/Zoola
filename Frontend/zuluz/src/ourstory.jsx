import React from "react";
import Header from "./header";
import { motion } from "framer-motion";

function OurStory() {
  return (
    <div style={{ backgroundColor: "#FFF5EB", overflowX: "hidden" }}>
      <Header />

      <div className="container-fluid px-3">
        {/* Title */}
        <div className="text-center mb-4 pt-4">
          <h5 className="text-muted">Our Story</h5>
          <small>Home / Story</small>
        </div>

        {/* Introduction Section */}
        <div className="container mb-5">
          <div className="row align-items-center">
            {/* Text + Small Swing Images */}
            <motion.div
              className="col-12 col-md-6 mb-4 mb-md-0"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="fw-bold" style={{ fontFamily: "serif" }}>
                Zulas n More brings you top-notch swings which give you better
                comfort and luxury.
              </h3>
              <p className="text-muted mt-3">
                Zulas n More is a leading force in the world of furniture
                manufacturing, driven by a relentless commitment to
                craftsmanship, innovation, and design excellence...
              </p>

              <div className="d-flex flex-wrap gap-3 mt-4">
                {[1, 2].map((_, i) => (
                  <motion.img
                    key={i}
                    src="image/1new.jpg"
                    alt={`Mini Swing ${i + 1}`}
                    className="img-fluid rounded"
                    style={{
                      width: "48%",
                      height: "40vh",
                      objectFit: "cover",
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.2, duration: 0.6 }}
                    viewport={{ once: true }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Main Image */}
            <motion.div
              className="col-12 col-md-6 text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <img
                src="image/2new.jpg"
                alt="Main Swing"
                className="img-fluid rounded-5"
                style={{
                  maxHeight: "500px",
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                }}
              />
            </motion.div>
          </div>
        </div>

        {/* Our Expertise */}
        <motion.div
          className="mb-4 px-3 text-start"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h5>Our Expertise:</h5>
        </motion.div>

        <div className="row text-center mb-5 px-2">
          {["Furniture Design", "Material Selection", "Technology Driven", "On-site Support"].map(
            (text, i) => (
              <motion.div
                key={i}
                className="col-6 col-md-3 mb-3"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <img
                  src="image/WoodenSwings.jpeg"
                  className="img-fluid rounded mb-2"
                  alt={`Expertise ${i + 1}`}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <p className="fw-semibold">{text}</p>
              </motion.div>
            )
          )}
        </div>

        {/* Why Choose Us */}
        <motion.div
          className="mb-4 px-3 text-start"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h5>Why Choose Zulas n More?</h5>
        </motion.div>

        <div className="row text-center px-2 pb-5">
          {["Innovation Hub", "Team Collaboration", "Customer-Centric", "Modern Design"].map(
            (reason, i) => (
              <motion.div
                key={i}
                className="col-6 col-md-3 mb-3"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <img
                  src="image/WoodenSwings.jpeg"
                  className="img-fluid rounded mb-2"
                  alt={`Reason ${i + 1}`}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <p className="fw-semibold">{reason}</p>
              </motion.div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default OurStory;
