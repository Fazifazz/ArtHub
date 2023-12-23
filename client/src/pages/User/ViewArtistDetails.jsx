import React from "react";
import Navbar from "../../components/Navbar";
import ProfileCard from "../../components/ProfileCard";
import { useLocation } from "react-router-dom";
import ArtistAllPosts from "../../components/ArtistAllPosts";

function ViewArtistDetails() {
  const location = useLocation();
  const artist  = location?.state ? location?.state?.artist : "";
  return (
    <>
      <Navbar />
      <ProfileCard Artist={artist} />
      <ArtistAllPosts artistId={artist._id} />
    </>
  );
}

export default ViewArtistDetails;
