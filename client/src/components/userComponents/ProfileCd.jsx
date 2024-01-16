import React from 'react';
import { motion } from 'framer-motion';

const ProfileCard = ({ user }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-200 p-4 rounded-md shadow-md lg:w-1/4 h-92  fixed top-40"
    >
      <div className="flex flex-col items-center">
        <img
          className="h-20 w-20 rounded-full mb-4 mt-4"
          src={`http://localhost:5000/userProfile/${user.profile}`}
          alt=""
        />
        <div className='mt-3'>
          <p className="text-base font-medium text-gray-800 uppercase">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
          <p className="text-sm text-gray-500">{user.mobile}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
