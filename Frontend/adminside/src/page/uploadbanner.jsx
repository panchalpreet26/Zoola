import React, { useState } from "react";
import axios from "axios";

function AdminBannerUpload() {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);

    try {
      await axios.post("http://localhost:5000/api/banner/create", formData);
      alert("Banner uploaded successfully!");
    } catch (err) {
      alert("Upload failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Banner title" onChange={(e) => setTitle(e.target.value)} />
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button type="submit">Upload</button>
    </form>
  );
}

export default AdminBannerUpload;
