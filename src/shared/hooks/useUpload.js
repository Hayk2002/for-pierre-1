import { useState } from "react";

const useUpload = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [image, setImage] = useState("");

  const uploadImage = (event) => {
    const { files } = event.target;
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    setImage(files[0]);

    reader.onloadend = () => {
      setImageUrl(reader.result);
    };
  };

  const resetImage = () => {
    setImage("");
    setImageUrl("");
  };

  return { imageUrl, image, uploadImage, resetImage };
};

export default useUpload;
