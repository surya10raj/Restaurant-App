import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import axios from "axios";
export default function Navebar() {
  const storedUser = JSON.parse(sessionStorage.getItem("user"));
  const [activeuser, setActiveuser] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (storedUser) {
      // Send the stored user data to the server to determine role
      axios
        .get("http://localhost:4000/api/activeuser", {
          params: { userEmail: storedUser.email }
        })
        .then((response) => {
          const username = response.data.username;
          console.log(username)// Extract the username from the response
          setActiveuser(username); // Set activeuser to the extracted username
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [storedUser]);

  const handleLogout = () => {
    // Show loading animation
    setLoading(true);

    // Remove user data from sessionStorage
    sessionStorage.removeItem("user");
    
    // Reload the page after a short delay (for the animation to be visible)
    setTimeout(() => {
      window.location.reload();
      window.location.href= "/login";
    }, 1000); // Adjust the delay as needed
  };

  useEffect(() => {
    console.log("storedUser has changed:", storedUser);
  }, [storedUser]);

  return (
    <header>
      <Navbar bg="black" variant="dark" expand="md" className="p-4 ">
        <div className="container">
          <Link to="/" className="navbar-brand">
            <h4 className=" text-yellow-500 text-2xl">Foodie's Hub</h4>
          </Link>
          {activeuser?(<div  className="active-user text-white text-xl">
                    Hello, <span className="user-name text-orange-500">{activeuser}</span>
                  </div>):null}
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="m-auto ">
              <Link to="/home" className="nav-link ">
                Home <i class="bi bi-house-door"></i>
              </Link>
              
              {storedUser ? (
                <>
                  <Link to="/Menu" className="nav-link">
                    Menu <i class="bi bi-arrow-down"></i>
                  </Link>
                  <Link to="/Cart" className="nav-link">
                    Cart <i class="bi bi-arrow-down"></i>
                  </Link>
                </>

              ) : (
                <Link to="/signup" className="nav-link">
                  Signup <i class="bi bi-person-circle"></i>
                </Link>
              )}
            </Nav>
            <Nav>
              {storedUser ? (
                <>
                  {loading ? (
                    <div className="loading-animation">
                      Loading...
                    </div>
                  ) : (
                    <button
                      onClick={handleLogout}
                      className="ml-2 p-2 text-white bg-violet-900"
                    >
                      Logout <i className="bi bi-box-arrow-left"></i>
                    </button>
                  )}
                </>
              ) : (
                <Link to="/login" className="nav-link">
                  Login <i className="bi bi-box-arrow-right"></i>
                </Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>
    </header>
  );
};