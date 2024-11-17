import axios from "axios";

const imgbbAPIKey = "e7a8a1178ef5edbc9712872092e4cbf4"; // Thay bằng API key từ ImgBB

const uploadImageToImgBB = async (imageFile) => {
  if (!imageFile) {
    throw new Error("No file selected");
  }

  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await axios.post(
      "https://api.imgbb.com/1/upload",
      formData,
      {
        params: {
          key: imgbbAPIKey, // Sử dụng API key từ ImgBB
        },
      }
    );

    const imageUrl = response.data.data.url; // URL của hình ảnh sau khi upload
    return imageUrl;
  } catch (error) {
    console.error("Lỗi khi upload ảnh: ", error);
    throw new Error("Không thể upload ảnh");
  }
};

export default uploadImageToImgBB;
