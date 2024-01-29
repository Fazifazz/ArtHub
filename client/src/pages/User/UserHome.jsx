import React from "react";
import Navbar from "../../components/Navbar";
import PostCard from "../../components/PostCard";
import ProfileCard from "../../components/userComponents/ProfileCd";
import { useSelector } from "react-redux";
import ContactCard from "../../components/userComponents/ContactCard";

const UserHome = () => {
  const { user } = useSelector((state) => state.Auth);
  return (
    <>
      <Navbar />
      <div className="flex ">
        <div className="hidden md:block w-1/4 p-6">
          <ProfileCard user={user} />
        </div>
        <div className="w-full md:w-2/4">
          <PostCard />
        </div>
        <div className="hidden md:block mt-6">
          <ContactCard /> 
        </div>
      </div>
    </>
  );
};

export default UserHome;
