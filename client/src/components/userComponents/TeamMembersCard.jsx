import React from 'react';
import { motion } from 'framer-motion';

const TeamMemberCard = ({ name, role, imageSrc }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{scale:1.1}}
      className="bg-white rounded-lg p-4 shadow-md mb-4"
    >
      <img
        src={imageSrc}
        alt={name}
        className="w-32 h-32 mx-auto rounded-full"
      />
      <h3 className="text-xl font-semibold mt-2">{name}</h3>
      <p className="text-gray-600">{role}</p>
    </motion.div>
  );
};

const TeamSection = () => {
  const teamMembers = [
    { name: 'John Doe', role: 'Co-founder', imageSrc: 'images/adminImages/myphoto1.jpg' },
    { name: 'Jane Smith', role: 'Designer', imageSrc: 'images/userImages/myoffice photo.jpg' },
    { name: 'David Johnson', role: 'Developer', imageSrc: 'images/adminImages/myphoto1.jpg' },
    { name: 'Emily Davis', role: 'Marketing', imageSrc: 'images/adminImages/myphoto1.jpg' },
  ];

  return (
    <section className="bg-gray-200 py-12 h-1 mt-6 ">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-4">Our Team</h2>
        <div className="grid grid-cols-1 w-80 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8">
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={index} {...member} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
