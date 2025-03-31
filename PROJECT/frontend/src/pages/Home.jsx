import { Link } from "react-router-dom";
import logo from "../assets/logo.png"; // Import logo
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import "./Home.css";

const messages = ["Delicious Meals.", "Fresh Ingredients.", "Unforgettable Flavors."];

const Home = () => {
  const [currentText, setCurrentText] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });

  useEffect(() => {
    const typingSpeed = isDeleting ? 100 : 150;
    const delayBeforeDelete = 1000;

    const handleTyping = () => {
      setCurrentText((prev) => {
        const currentMessage = messages[index];

        if (!isDeleting) {
          if (prev === currentMessage) {
            setTimeout(() => setIsDeleting(true), delayBeforeDelete);
            return prev;
          }
          return currentMessage.substring(0, prev.length + 1);
        } else {
          if (prev === "") {
            setIsDeleting(false);
            setIndex((prevIndex) => (prevIndex + 1) % messages.length);
            return "";
          }
          return currentMessage.substring(0, prev.length - 1);
        }
      });
    };

    const typingTimeout = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(typingTimeout);
  }, [currentText, isDeleting, index]);

  // Features Section
  const features = [
    { title: "Organic Ingredients", description: "Fresh, high-quality organic ingredients for our meals." },
    { title: "Expert Chefs", description: "World-class chefs crafting unique and delicious dishes." },
    { title: "Quick Service", description: "Fast and efficient service ensures timely meal delivery." },
    { title: "Customizable Meals", description: "Tailor meals to suit your dietary preferences." },
    { title: "Sustainable Practices", description: "Eco-friendly and sustainable ingredient sourcing." },
    { title: "Diverse Menu", description: "A mix of classic favorites and exotic new dishes." },
  ];

  const services = [
    { title: "Recipe Generator", description: "Generate recipes based on available ingredients.", buttonText: "Click Here", link: "/R_g" },
    { title: "Inventory Update", description: "Track and manage stock levels in real-time.", buttonText: "Click Here", link: "/Inventory" },
    { title: "Menu", description: "Explore a variety of delicious meals.", buttonText: "Click Here", link: "/Menu" },
    ];

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, features.length - 4));
  };
  // Define handleInputChange function
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
  <div className="hero-content">
    {/* Large Centered Logo */}
    <motion.img 
      src={logo} 
      alt="Food Haven Logo" 
      className="hero-logo"
      initial={{ opacity: 0, scale: 0.8 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ duration: 1 }} 
    />

    <motion.h1 initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
      Welcome to <span className="highlight">Food Haven</span>
    </motion.h1>
    <h2 className="typing-text">{currentText}</h2>
    <p className="hero-description">Discover flavors that bring joy to every meal.</p>
  </div>
</section>

      {/* Services Section */}
      <section className="services" id="services">
        <h2 className="section-title">Our Services</h2>
        <p className="services-description">At Food Haven, we provide a range of services tailored to your needs.</p>
        <div className="services-cards">
          {services.map((service, idx) => (
            <motion.div key={idx} className="service-card" whileHover={{ scale: 1.05 }}>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <Link to={service.link}>
                <button className="cta-button">{service.buttonText}</button>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

     
          {/* About Us Section */}
       <section id="about" className="about">
        <h2 className="section-title">About Us</h2>
        <p className="about-description">
          At Food Haven, we are passionate about bringing delicious, high-quality meals to your table. Our team is
          dedicated to providing exceptional culinary experiences using fresh, locally sourced ingredients.
        </p>
      
      {/* Features Section */}
      <section className="features" >
        <button className="arrow left-arrow" onClick={handlePrev}>❮</button>
        <div className="feature-carousel">
          {features.slice(currentIndex, currentIndex + 4).map((feature, idx) => (
            <motion.div key={idx} whileHover={{ scale: 1.05 }} className="feature-card">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
        <button className="arrow right-arrow" onClick={handleNext}>❯</button>
      </section>
      </section>
      {/* Contact Us Section */}
      <section className="contact-us" id="contact">
        <h2>Contact Us</h2>
        <form>
          <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleInputChange} required />
          <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleInputChange} required />
          <textarea name="message" placeholder="Your Message" rows="4" value={formData.message} onChange={handleInputChange} required></textarea>
          <button className="cta-button">Submit</button>
        </form>
      </section>
      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Food Haven | Crafted with ❤️ for Food Lovers</p>
      </footer>
    </div>
  );
};

export default Home;