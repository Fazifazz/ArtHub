import React, { useEffect, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

function ImageCrop({onNewImageUrl}) {
  const [avatarUrl, setNewAvatarUrl] = useState();
  const [preview, setPreview] = useState();
  const [cropper, setCropper] = useState();

 

  function getNewAvatarUrl(e) {
    if (e.target.files) {
      setNewAvatarUrl(URL.createObjectURL(e.target.files[0]));
    }
  }

  const getCropData = async (e) => {
    e.preventDefault()
    if (cropper) {
      const file = await fetch(cropper.getCroppedCanvas().toDataURL())
        .then((res) => res.blob())
        .then((blob) => {
          return new File([blob], "newAvatar.png", { type: "image/png" });
        });
      if (file) {
        console.log(file);
        const url = URL.createObjectURL(file);
        setPreview(url);
        onNewImageUrl(file)
      }
    }
  };

  return (
    <>
      <div className="mb-4">
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-600"
                >
                  Post
                </label>
                <input
                  type="file"
                  id="upload"
                  name="post"
                  accept="image/*"
                  onChange={getNewAvatarUrl}
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>
      {avatarUrl && (
        <Cropper
          src={avatarUrl}
          style={{ height: 400, width: 400 }}
          initialAspectRatio={4 / 3}
          minCropBoxHeight={100}
          minCropBoxWidth={100}
          guides={false}
          checkOrientation={false}
          onInitialized={(instance) => {
            setCropper(instance);
          }}
        />
      )}
      {avatarUrl && <button className="mb-2 w-10 bg-yellow-500" onClick={getCropData}>crop</button>}

      {preview && (
        <div className="card mt-2 mb-4">
          <div className="card-header text-[#E0CDB6]">Preview</div>
          <div className="card-body">
            <div className="d-flex justify-content-center">
              <img
                src={preview}
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
    </>
  );
}

export default ImageCrop;