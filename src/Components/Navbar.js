import React, { useEffect } from "react";
import { useState } from "react";
import logo from "../../src/image/black-logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = () => {
  const navigate = useNavigate();

  const [profileName, setProfileName] = useState("");

  useEffect(() => {
    let tok = localStorage.getItem("token");
    let user = JSON.parse(localStorage.getItem("user"));
    console.log(user);
    setProfileName(user.name);
  }, []);

  const logOut = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="home-main">
      <nav class="navbar navbar-expand-lg navbar-light">
        <Link to="/dashboard">
          <img src={logo} alt="logo" />
        </Link>
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
              <Link to="/dashboard" className="nav-link">
                Home
              </Link>
            </li>
            <li class="nav-item active">
              <Link to="/allproject" className="nav-link">
                Project
              </Link>
            </li>
          </ul>
          <form class="form-inline my-2 my-lg-0">
            <ul class="navbar-nav mr-auto">
              <li class="nav-item">
                <div className="logo-profile">
                  <div className="drop-down">
                    <Link className="profile-name" to="./">
                      {profileName}
                    </Link>
                    <div className="dropdown-content" onClick={logOut}>
                      <span>Log-out</span>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </form>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
