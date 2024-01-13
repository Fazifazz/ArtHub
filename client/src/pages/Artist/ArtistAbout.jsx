import React, { useEffect, useState } from "react";
import BannerCarousel from "../../components/BannerCourosel";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/AlertSlice";
import { ArtistRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../util/api";
import ArtistNavbar from "../../components/ArtistNav";

function ArtistAboutPage() {
  const [banners, setBanners] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    getArtistBanners();
  }, []);

 
  const getArtistBanners = async () => {
    dispatch(showLoading());
    ArtistRequest({
      url: apiEndPoints.getArtistBanners,
      method: "get",
    }).then((res) => {
      dispatch(hideLoading());
      if (res.data?.success) {
        setBanners(res.data?.banners);
      } else {
        toast.error(res.data?.error);
      }
    });
  };

  return (
    <>
      <ArtistNavbar />
      <BannerCarousel banners={banners} />
    </>
  );
}

export default ArtistAboutPage;
