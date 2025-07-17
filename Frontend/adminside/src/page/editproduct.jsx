import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, useNavigate, useParams } from "react-router-dom";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    categories: "",
    oldprice: "",
    newprice: "",
    stock: "",
    description: "",
    image: "", // image name for preview
  });

  const [file, setFile] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/product/productshowById/${id}`)
      .then((res) => {
        const data = res.data?.data;
        if (data) {
          setProduct({
            name: data.name || "",
            categories: Array.isArray(data.categories)
              ? data.categories.join(", ")
              : data.categories || "",
            oldprice: data.oldprice || "",
            newprice: data.newprice || "",
            stock: data.stock || "",
            description: data.description || "",
            image: data.image || "",
          });
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        alert("Failed to load product data");
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("categories", product.categories); // send comma-separated string
    formData.append("oldprice", product.oldprice);
    formData.append("newprice", product.newprice);
    formData.append("stock", product.stock);
    formData.append("description", product.description);
    if (file) {
      formData.append("image", file);
    }

    try {
      await axios.put(
        `http://localhost:5000/api/product/productupdate/${id}`,
        formData
      );
      alert("Product updated successfully");
      navigate("/allproducts");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update product");
    }
  };

  return (
    <div className="col-md-10 mx-auto grid-margin stretch-card">
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">Edit Product</h4>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="form-group mb-3">
              <label>Product Name</label>
              <input
                type="text"
                className="form-control bg-dark text-white"
                name="name"
                value={product.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label>Categories (comma separated)</label>
              <input
                type="text"
                className="form-control bg-dark text-white"
                name="categories"
                value={product.categories}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label>Old Price (₹)</label>
              <input
                type="number"
                className="form-control bg-dark text-white"
                name="oldprice"
                value={product.oldprice}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label>New Price (₹)</label>
              <input
                type="number"
                className="form-control bg-dark text-white"
                name="newprice"
                value={product.newprice}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label>Stock</label>
              <input
                type="number"
                className="form-control bg-dark text-white"
                name="stock"
                value={product.stock}
                onChange={handleChange}
              />
            </div>

            {product.image && !file && (
              <div className="mb-3">
                <label>Current Image</label>
                <div>
                  <img
                    src={`http://localhost:5000/uploads/${product.image}`}
                    alt="Product"
                    className="img-thumbnail"
                    style={{ height: "150px" }}
                  />
                </div>
              </div>
            )}

            <div className="form-group mb-3">
              <label>New Image (optional)</label>
              <input
                type="file"
                className="form-control bg-dark text-white"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <div className="form-group mb-4">
              <label>Description</label>
              <textarea
                className="form-control bg-dark text-white"
                name="description"
                rows="3"
                value={product.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <button type="submit" className="btn btn-success me-2">
              Update
            </button>
            <NavLink to="/allproducts">
              <button type="button" className="btn btn-danger ml-3">
                Cancel
              </button>
            </NavLink>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProduct;
