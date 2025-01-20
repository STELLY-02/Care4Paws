import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div>
      <h1>Welcome to Care4Paws!</h1>
      <p>Your go-to platform for animal welfare and shelter support.</p>

      <div>
        <Link to="/login">Login</Link> |<Link to="/register">Register</Link>
      </div>
    </div>
  );
}

export default HomePage;
