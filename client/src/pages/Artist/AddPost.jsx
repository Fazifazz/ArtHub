import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArtistRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../util/api";
import { ServerVariables } from "../../util/ServerVariables";
import ArtistNavbar from "../../components/ArtistNav";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/AlertSlice";
import toast from "react-hot-toast";
import ImageCrop from "../../components/imageCrop";

function AddPost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleForm = async (e) => {
    e.preventDefault();
    if (!image) {
      setError("All fields are required");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    const data = new FormData();
    if (image) {
      if (image.type.startsWith("image")) {
        data.append("post", image);
      } else {
        setError("Only images are allowed to upload");
        setTimeout(() => {
          setError("");
        }, 2000);
        return;
      }
    }
    data.append("title", title);
    data.append("description", description);
    dispatch(showLoading());
    ArtistRequest({
      url: apiEndPoints.uploadPost,
      method: "post",
      data: data,
    }).then((res) => {
      dispatch(hideLoading());
      if(res.data.expired){
        toast.error(res.data.expired)
        return navigate(ServerVariables.plansAvailable)
      }
      if (res.data.success) {
        toast.success(res.data.success);
        navigate(ServerVariables.artistPosts);
      } else {
        toast.success(res.data.error);
      }
    });
  };

  const addCropImg = (file) => {
    setImage(file);
  };

  return (
    <>
      <ArtistNavbar />
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Add Post</h2>
            <form>
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

              <ImageCrop onNewImageUrl={addCropImg} />

              {error && <p className="text-red-600">{error}</p>}

              <div className="flex items-center space-x-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  onClick={handleForm}
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => navigate(ServerVariables.artistPosts)}
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

export default AddPost;
