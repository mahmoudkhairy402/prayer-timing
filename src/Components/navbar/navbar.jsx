import React from "react";
import styles from "./nav.module.scss";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import { delay, easeInOut, motion } from "framer-motion";

export default function Navbar() {
  return (
    <>
      <nav className={`navbar navbar-expand-lg p-0 ${styles.navbar}`}>
        <div className="container-fluid">
          <Link className="logoContainer" to="/">
            <img src={logo} alt="logo" srcset="" />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <motion.ul
              className="navbar-nav me-auto ms-3 mb-2 mb-lg-0"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2,
                    delay: 0.3, // This will stagger child animations
                  },
                },
              }}
              initial="hidden"
              animate="show"
            >
              <motion.li
                className="nav-item"
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.3, ease: "easeInOut" },
                  },
                }}
              >
                <Link
                  className={`nav-link ${styles.navLink} ms-2`}
                  aria-current="page"
                  to="/iqraa"
                >
                  اقرأ
                </Link>
              </motion.li>
              <motion.li
                className="nav-item"
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.3, ease: "easeInOut" },
                  },
                }}
              >
                <Link
                  className={`nav-link ${styles.navLink} ms-2`}
                  aria-current="page"
                  to="/prayer"
                >
                  مواقيت الصلاة
                </Link>
              </motion.li>
            </motion.ul>

            {/* <form className="d-flex" role="search">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form> */}
          </div>
        </div>
      </nav>
    </>
  );
}
