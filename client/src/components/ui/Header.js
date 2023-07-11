import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import logo from "../../assests/img/logo.svg";
import avatar from "../../assests/img/avatar1.png";

const Header = () => {
  const loc = useLocation();
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);

  const logout = () => {
    localStorage.removeItem("cmsToken");
    localStorage.removeItem("cmsUserID");
    localStorage.removeItem("cmsRole");
    localStorage.removeItem("cmsInstituteID");
    localStorage.removeItem("cmsUserName");
    navigate("/login", { replace: true });
  };
  return (
    <div className="header">
      <div style={{ color: "white", fontSize: "32px" }}>
        <span>S</span>
        <span style={{}}>M</span>
        <span>S</span>
      </div>
      <div className="header__nav">
        {!localStorage.getItem("cmsToken") &&
          (loc.pathname.includes("signup") ? (
            <Link to="/" className="btn btn--white">
              Login
            </Link>
          ) : (
            <Link to="signup" className="btn btn--white">
              Register
            </Link>
          ))}
        {localStorage.getItem("cmsToken") && (
          <div className="header__nav__profile">
            <div
              className="header__nav__profile__imgCont"
              onClick={() => setShowPopup(!showPopup)}
            >
              <img src={avatar} alt="person" />
            </div>

            <div
              className={
                "header__nav__profile__popup " + (!showPopup ? "hidePopup" : "")
              }
            >
              <h3 className="header__nav__profile__popup__header">
                {localStorage.getItem("cmsUserName") || "Profile"}
              </h3>

              <button
                className="header__nav__profile__popup__option"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
