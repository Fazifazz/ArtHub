import React, { useState } from "react";
import AdminNavbar from "../../components/AdminNav";
import { useLocation, useNavigate } from "react-router-dom";
import { apiEndPoints } from "../../util/api";
import { ServerVariables } from "../../util/ServerVariables";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/AlertSlice";
import toast from "react-hot-toast";
import { adminRequest } from "../../Helper/instance";
import BannerImageCrop from "../../components/BannerImgCrop";
import { API_BASE_URL } from "../../config/api";

function EditBanner() {
  const location = useLocation();
  const banner = location.state ? location?.state?.banner : "";
  const [title, setTitle] = useState(banner?.title);
  const [description, setDescription] = useState(banner?.description);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(banner?.image || null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const [bannerUrl,setBannerUrl] = useState('')

  const addCropImg = (file) => {
    setPreview(file || banner?.image || null);
  };
  

  const handleUpdateBanner = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      setError("All fields are required");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }
  
    const data = new FormData();
    if (preview) {
      if (preview instanceof File) {
        if (preview.type && preview.type.startsWith("image")) {
          data.append("banner", preview);
        } else {
          setError("Only images are allowed to upload");
          setTimeout(() => {
            setError("");
          }, 2000);
          return;
        }
      } else {
        // If preview is a URL, send it as a string
        data.append("bannerUrl", preview);
      }
    }
    data.append("title", title);
    data.append("bannerId", banner._id);
    data.append("description", description);
  
    dispatch(showLoading());
    adminRequest({
      url: apiEndPoints.updateBanner,
      method: "post",
      data: data,
    }).then((res) => {
      dispatch(hideLoading());
      if (res.data.success) {
        toast.success(res.data.success);
        navigate(ServerVariables.banners);
      } else {
        toast.success(res.data.error);
      }
    });
  };
  

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Edit Banner</h2>
            <form onSubmit={handleUpdateBanner}>
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-600"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  className="mt-1 p-2 w-full border rounded-md"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter title"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-600"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  className="mt-1 p-2 w-full border rounded-md"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description"
                  rows="4"
                />
              </div>

              {preview && (
                <div className="card mt-2 mb-4">
                  <div className="card-header text-[#E0CDB6]">Preview</div>
                  <div className="card-body">
                    <div className="d-flex justify-content-center">
                      <img
                        src={`${API_BASE_URL}/banners/${preview}`}
                        className="preview"
                        style={{
                          maxWidth: "200px",
                          objectFit: "cover",
                          maxHeight: "300px",
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <BannerImageCrop onNewImageUrl={addCropImg} />

              {error && <p className="text-red-600">{error}</p>}

              <div className="flex items-center space-x-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => navigate(ServerVariables.banners)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditBanner;
