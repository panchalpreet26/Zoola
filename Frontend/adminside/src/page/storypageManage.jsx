import React, { useState, useEffect } from "react";
import axios from "axios";

const sections = [
  { name: "General", api: "http://localhost:5000/api/content/contentadd" },
  {
    name: "Our Expertise",
    api: "http://localhost:5000/api/expertise/expertiseadd",
  },
  {
    name: "Why Choose Us",
    api: "http://localhost:5000/api/chooseus/chooseUsadd",
  },
];

export default function AdminContentManager() {
  const [activeSection, setActiveSection] = useState(sections[0]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeSection]);

  const fetchData = async () => {
    try {
      const res = await axios.get(activeSection.api);
      setData(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("description", formData.description);
    if (formData.image) payload.append("image", formData.image);

    try {
      if (editId) {
        await axios.put(`${activeSection.api}/${editId}`, payload);
      } else {
        await axios.post(activeSection.api, payload);
      }
      resetForm();
      fetchData();
    } catch (err) {
      console.error("Submit Error:", err);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      title: item.title,
      description: item.description || "",
      image: null,
    });
    setPreview(`http://localhost:5000/${item.image}`);
    setEditId(item._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this entry?")) {
      try {
        await axios.delete(`${activeSection.api}/${id}`);
        fetchData();
      } catch (err) {
        console.error("Delete Error:", err);
      }
    }
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", image: null });
    setPreview(null);
    setEditId(null);
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4 text-center">Zulas Admin Content Manager</h2>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        {sections.map((section, i) => (
          <li className="nav-item" key={i}>
            <button
              className={`nav-link ${
                section.name === activeSection.name
                  ? "active fw-bold text-primary border-primary"
                  : ""
              }`}
              onClick={() => {
                setActiveSection(section);
                resetForm();
              }}
            >
              {section.name}
            </button>
          </li>
        ))}
      </ul>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="mb-5"
      >
        <div className="mb-3">
          <input
            type="text"
            name="title"
            value={formData.title}
            placeholder="Enter title"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <textarea
            name="description"
            value={formData.description}
            placeholder="Enter description"
            className="form-control"
            rows="4"
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <input
            type="file"
            name="image"
            className="form-control"
            onChange={handleChange}
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="img-thumbnail mt-2"
              style={{ height: "200px", objectFit: "cover" }}
            />
          )}
        </div>

        <button type="submit" className="btn btn-success">
          {editId ? "Update Content" : "Add Content"}
        </button>
      </form>

      {/* Content Cards */}
      <div className="row">
        {data.map((item) => (
          <div className="col-md-4 mb-4" key={item._id}>
            <div className="card h-100">
              <img
                src={`http://localhost:5000/${item.image}`}
                alt={item.title}
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
                <p className="card-text">{item.description}</p>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
