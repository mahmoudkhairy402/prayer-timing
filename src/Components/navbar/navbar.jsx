import React from "react";
import styles from "./nav.module.scss";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
export default function Navbar() {
  return (
    <>
      <nav className={`navbar navbar-expand-lg p-0 ${styles.navbar}`}>
        <div className="container-fluid">
          <a className="logoContainer" href="#">
            <img src={logo} alt="logo" srcset="" />
          </a>
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
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a
                  className={`nav-link ${styles.navLink}`}
                  aria-current="page"
                  href="#iqraa"
                >
                  اقرأ
                </a>
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