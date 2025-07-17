import React from "react";
import Header from "./header";
import { motion } from "framer-motion";
const API = process.env.REACT_APP_API_URL;

function Contactus() {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        type: "spring",
      },
    }),
  };

  return (
    <div style={{ backgroundColor: "#FFF5EB", overflowX: "hidden" }}>
      <Header />

      <div className="container-fluid px-3">
        {/* Page Title */}
        <motion.div
          className="text-center mb-4 pt-4"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <h4>Contact Us</h4>
          <small>Home / Contact us</small>
        </motion.div>

        {/* Buttons for Cities */}
        <motion.div
          className="d-flex flex-wrap gap-2 mb-4 px-2"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          <button className="btn btn-dark">Surat</button>
          <button className="btn btn-outline-dark">Ahmedabad</button>
          <button className="btn btn-outline-dark">Mumbai</button>
        </motion.div>

        {/* Contact Card - 1 */}
        <motion.div
          className="row align-items-center mb-5"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="col-12 col-md-6 mb-3 mb-md-0">
            <img
              src="image/contectus.png"
              className="img-fluid rounded w-100"
              alt="Zulas n More Surat"
            />
          </div>
          <div className="col-12 col-md-6">
            <h5>Bhatar</h5>
            <p>
              102, Ashapura Square Nizampura Plot 77A Ambika Industrial Estate
              <br />
              Opp Vamora Near Navjivan Circle Udhna-Magdalla, Main Road,
              <br />
              Surat, Gujarat
            </p>
            <p>
              info.zulasnmore@gmail.com
              <br />
              9824441703
            </p>
          </div>
        </motion.div>

        {/* Contact Card - 2 */}
        <motion.div
          className="row align-items-center mb-5"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="col-12 col-md-6 order-md-2 mb-3 mb-md-0">
            <img
              src="image/contectus.png"
              className="img-fluid rounded w-100"
              alt="Zulas n More Surat"
            />
          </div>
          <div className="col-12 col-md-6 order-md-1">
            <h5>Bhatar</h5>
            <p>
              102, Ashapura Square Nizampura Plot 77A Ambika Industrial Estate
              <br />
              Opp Vamora Near Navjivan Circle Udhna-Magdalla, Main Road,
              <br />
              Surat, Gujarat
            </p>
            <p>
              info.zulasnmore@gmail.com
              <br />
              9824441703
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Contactus;
