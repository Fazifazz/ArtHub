import React from "react";
import { motion } from "framer-motion";
import { FaFacebook, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const ContactCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 p-6 rounded-md shadow-md text-white mb-4 fixed top-40"
    >
      <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
      <div className="flex items-center mb-2">
        <span className="mr-2">&#128231;</span>
        <p>fazzfasi7@gmail.com</p>
      </div>
      <div className="flex items-center mb-2">
        <span className="mr-2">
          <FaFacebook />
        </span>
        <p>https://www.facebook.com/fasi.fazz.52/</p>
      </div>
      <div className="flex items-center mb-2">
        <span className="mr-2">
          <FaInstagram />
        </span>
        <p>https://instagram.com/_.faz__i?igshid=MzNlNGNkZWQ4Mg==</p>
      </div>
      <div className="flex items-center">
        <span className="mr-2">
          <FaLinkedinIn />
        </span>
        <p>https://www.linkedin.com/in/mohamed-fasil-p-927365277/</p>
      </div>
    </motion.div>
  );
};

export default ContactCard;
