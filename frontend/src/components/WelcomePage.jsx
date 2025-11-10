import React from 'react';
// Import components directly from the react-bootstrap module
import { Container, Button, Image } from 'react-bootstrap';

/**
 * GlobalStyles component
 * Contains all the custom CSS for the Welcome Page.
 * This includes the new animated gradient, animations,
 * enhanced glassmorphism buttons, and all responsive design rules.
 */
const GlobalStyles = () => (
  <style type="text/css">{`
    /* --- Font Import --- */
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');

    /* --- Base Setup --- */
    body, html {
      height: 100%;
      margin: 0;
    }

    /* --- 1. Background (NEW) --- */
    .welcome-container {
      font-family: 'Poppins', sans-serif;
      min-height: 100vh;
      width: 100%;
      
      /* New animated gradient background */
      background: linear-gradient(135deg, #4a00e0, #8e2de2, #5e0d7d);
      background-size: 200% 200%; /* Important for animation */
      
      position: relative;
      overflow: hidden; 
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      
      /* Animation for the gradient shift */
      animation: gradientShift 15s ease infinite;
    }

    /* Background gradient animation */
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    /* --- 2. Foreground Content --- */
    .welcome-content {
      position: relative;
      z-index: 2; /* Sits on top of the background */
      text-align: center;
      /* Fade in on page load */
      animation: fadeIn 1s 0.2s ease-out forwards;
      opacity: 0;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    /* --- 3. Main Logo --- */
    .main-logo {
      width: 150px; 
      height: 150px;
      border-radius: 1.5rem;
      /* Enhanced shadow and new border */
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      border: 2px solid rgba(255, 255, 255, 0.1);
      
      /* Transitions for hover */
      transition: transform 0.4s ease, box-shadow 0.4s ease;
      
      /* Gentle floating animation */
      animation: float 6s ease-in-out infinite, fadeInLogo 1.2s ease-out forwards;
      opacity: 0;
    }
    
    /* Logo hover animation */
    .main-logo:hover {
      transform: scale(1.1); /* Scale up 1.1x */
      box-shadow: 0 15px 40px rgba(255, 255, 255, 0.25); /* Brighter glow */
    }

    /* Logo floating animation */
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); } /* Moves 5px up */
    }
    
    /* Logo fade-in animation */
    @keyframes fadeInLogo {
      from { opacity: 0; transform: scale(0.8); }
      to { opacity: 1; transform: scale(1); }
    }

    /* --- 4. Text (Name & Motto) --- */
    .website-name {
      font-size: 3.5rem;
      font-weight: 700;
      color: #fff;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      /* Fade-in animation (delayed) */
      animation: fadeInText 1s 0.4s ease-out forwards;
      opacity: 0;
      margin-top: 1.5rem;
    }
    
    @keyframes fadeInText {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .motto {
      font-size: 1.25rem;
      font-weight: 300;
      color: #e0e0e0;
      font-style: italic; 
      margin-top: -10px;
      margin-bottom: 2.5rem;
      /* Slide-up animation */
      animation: slideUp 1s 0.6s ease-out forwards;
      opacity: 0;
    }
    
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* --- 5. Login Buttons (Enhanced Glassmorphism) --- */
    .button-group {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      /* Buttons fade in last */
      animation: fadeIn 1s 0.8s ease-out forwards;
      opacity: 0;
    }
    
    .welcome-btn {
      /* Enhanced Glassmorphism base */
      background: rgba(255, 255, 255, 0.1); /* Slightly more transparent */
      border: 1px solid rgba(255, 255, 255, 0.2); /* Clearer border */
      backdrop-filter: blur(12px); /* More blur */
      -webkit-backdrop-filter: blur(12px); /* Safari support */
      
      color: #fff;
      font-weight: 600;
      font-size: 1rem;
      padding: 0.75rem 2rem;
      border-radius: 50px; /* Rounded pill shape */
      text-transform: uppercase;
      letter-spacing: 1px;
      
      /* Shadow & transitions */
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15); /* Softer shadow */
      transition: all 0.4s ease;
    }

    .welcome-btn:hover {
      background: rgba(255, 255, 255, 0.2); /* Brighter glass */
      /* More pronounced "pop" */
      transform: translateY(-5px) scale(1.03);
      /* Glowing hover effect */
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
      color: #fff;
    }
    
    /* Override Bootstrap's default focus */
    .welcome-btn:focus, .welcome-btn:active {
      background: rgba(255, 255, 255, 0.2);
      color: #fff;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
      outline: none;
      border-color: rgba(255, 255, 255, 0.2);
    }

    /* --- 6. Responsiveness --- */
    @media (max-width: 768px) {
      .website-name {
        font-size: 2.5rem;
      }
      .motto {
        font-size: 1rem;
      }
      .button-group {
        flex-direction: column; /* Stack buttons vertically */
        width: 100%;
        max-width: 300px; /* Constrain button width */
        margin: 0 auto;
      }
      .main-logo {
        width: 120px;
        height: 120px;
      }
    }
  `}</style>
);

/**
 * The Welcome Page Component
 */
const WelcomePage = () => {
  // We assume the route to your AuthPage (with the toggle) is '/login'
  const goToLogin = () => {
    // This simple redirect works without React Router
    window.location.href = '/login';
  };
    const goToLogin1 = () => {
    // This simple redirect works without React Router
    window.location.href = '/customer/login';
  };
  
  // Fallback image URL
  const placeholderLogo = "https://placehold.co/150x150/6e2de2/white?text=Orderly";

  return (
    <>
      <GlobalStyles />
      <Container fluid className="welcome-container">
        
        <div className="welcome-content">
          
          {/* 1. Main Logo */}
          <Image 
            src="/orderly.jpg" 
            alt="Orderly Logo"
            className="main-logo" 
            onError={(e) => { e.target.onerror = null; e.target.src = placeholderLogo; }}
          />
          
          {/* 2. Website Name */}
          <h1 className="website-name">Orderly</h1>
          
          {/* 3. Motto/Slogan */}
          <p className="motto">Your world, ordered.</p>
          
          {/* 4. Login Buttons */}
          <div className="button-group">
            <Button 
              className="welcome-btn" 
              onClick={goToLogin1}
            >
              Customer Login
            </Button>
            <Button 
              className="welcome-btn" 
              onClick={goToLogin}
            >
              Owner Login
            </Button>
          </div>

        </div>
      </Container>
    </>
  );
};

// Assuming this component will be imported by a main App file
export default WelcomePage;