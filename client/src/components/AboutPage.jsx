import React, { useEffect, useState } from "react";
import BannerCarousel from "./middlewares/BannerCourosel";
import Navbar from "./Navbar";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/AlertSlice";
import { userRequest } from "../Helper/instance";
import { apiEndPoints } from "../util/api";

function AboutPage() {
  const [banners, setBanners] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    getBanners();
  }, []);

  const getBanners = async () => {
    dispatch(showLoading());
    userRequest({
      url: apiEndPoints.getAllBanners,
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
      <Navbar />
      <BannerCarousel banners={banners} />
    </>
  );
}

export default AboutPage;
