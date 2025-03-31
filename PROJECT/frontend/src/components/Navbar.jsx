import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Navbar, Nav, NavDropdown, Container, Image } from "react-bootstrap";
import { HashLink } from 'react-router-hash-link';
import { 
  FaHome, FaUtensils, FaConciergeBell, FaInfoCircle, FaEnvelope, FaSignInAlt, 
  FaUserPlus, FaUser, FaSignOutAlt, FaTachometerAlt, FaBoxOpen, FaListAlt, FaCog
} from "react-icons/fa"; 
import "./NavigationBar.css"; // Updated styles
import logo from "../assets/logo.png"; // Import the logo

function NavigationBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate(); 

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login"); 
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Navbar expand="lg" fixed="top" className="custom-navbar">
      <Container>
        {/* Logo */}
        <Navbar.Brand as={Link} to="/" className="brand">
          <img 
            src={logo} 
            alt="NWN Logo" 
            className="nav-logo" // Add CSS for proper sizing
          /> 
          NoWasteNow
        </Navbar.Brand>

        {/* Mobile Menu Toggle */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* Public Links */}
            <Nav.Link as={Link} to="/" className="nav-item">
              <FaHome className="nav-icon" /> Home
            </Nav.Link>
            <Nav.Link as={HashLink} smooth to="/#services" className="nav-item">
              <FaConciergeBell /> Services
            </Nav.Link>
            <Nav.Link as={HashLink} smooth to="/#about" className="nav-item">
              <FaInfoCircle /> About
            </Nav.Link>
            <Nav.Link as={HashLink} smooth to="/#contact" className="nav-item">
              <FaEnvelope /> Contact Us
            </Nav.Link>
           
            {/* Authenticated User Menu */}
            {user ? (
              <NavDropdown
                title={
                  <span className="user-dropdown">
                    {user.photoURL ? (
                      <Image src={user.photoURL} roundedCircle className="profile-img" />
                    ) : (
                      <FaUser className="nav-icon" />
                    )}
                    {user.displayName || "Profile"}
                  </span>
                }
                id="user-dropdown"
                align="end"
                className="text-light"
              >
                <NavDropdown.Item as={Link} to="/profile">
                  <FaUser className="nav-icon" /> Profile
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/dashboard">
                  <FaTachometerAlt className="nav-icon" /> Dashboard
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/inventory">
                  <FaBoxOpen className="nav-icon" /> Inventory
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/R_g">
                  <FaUtensils className="nav-icon" /> Recipe Generator
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/menu">
                  <FaListAlt className="nav-icon" /> Menu
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} className="logout-btn">
                  <FaSignOutAlt className="nav-icon" /> Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="nav-item">
                  <FaSignInAlt className="nav-icon" /> Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="nav-item">
                  <FaUserPlus className="nav-icon" /> Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
