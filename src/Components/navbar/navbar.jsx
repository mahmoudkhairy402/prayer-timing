import React from "react";
import styles from "./nav.module.scss";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
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
            <ul className="navbar-nav me-auto ms-3 mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  className={`nav-link ${styles.navLink} ms-2`}
                  aria-current="page"
                  to="/iqraa"
                >
                  اقرأ
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${styles.navLink} ms-2`}
                  aria-current="page"
                  to="/prayer"
                >
                  مواقيت الصلاة
                </Link>
              </li>
            </ul>
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
