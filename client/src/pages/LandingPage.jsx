import React from "react";
import MyButton from "../components/MyButton";
import { ServerVariables } from "../util/ServerVariables";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate()
  return (
    <div className="font-sans">
      {/* Hero Section */}
      <section className="hero-section bg-black text-white text-center py-20">
        <img
          src="/images/userImages/hub1.png"
          alt="Logo"
          className="h-48 w-48 mx-auto mb-4"
        />
        <h1 className="text-4xl font-bold mb-4">Welcome to ArtHub</h1>
        <p className="text-lg mb-8">
          {/* Your go-to platform for art lovers and creators. */}
          Whether art is your passion or profession, you've come to the right
          place.
        </p>
        <p className="text-lg mb-8">WHO ARE YOU ?</p>
        <MyButton text="USER"  onClick={()=>navigate(ServerVariables.Login)}/>
        <MyButton text="ARTIST" onClick={()=>navigate(ServerVariables.ArtistLogin)}/>
      </section>
      {/* Featured Content */}``
      <section className="featured-content text-center py-16">
        <h2 className="text-2xl font-bold mb-8">Featured Artworks</h2>
        <div className="flex justify-center space-x-8">
          <div className="max-w-xs">
            <img
              src="/images/userImages/art.jpg"
              alt="Artwork 1"
              className="w-full h-auto rounded-lg"
            />
            <p className="mt-2">By Mohamed Fasil</p>
          </div>
          <div className="max-w-xs">
            <img
              src="/images/userImages/Artist-1.jpeg"
              alt="Artwork 2"
              className="w-full h-auto rounded-lg"
            />
            <p className="mt-2">By Bilal</p>
          </div>
          {/* Add more featured artworks as needed */}
        </div>
      </section>
      {/* Footer */}
      <footer className="text-center p-4 bg-gray-800 text-white">
        <p>&copy; 2023 ArtHub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
