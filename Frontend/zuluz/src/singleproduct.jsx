import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const API = process.env.REACT_APP_API_URL;

function Singleproduct() {
  const productId = sessionStorage.getItem("productId");
  const [singleproduct, setSingleproduct] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewOpen, setReviewOpen] = useState(true); // control review dropdown

  const fetchProductAndRecommendations = async () => {
    try {
      const res = await axios.get(
        `${API}/api/product/productshowById/${productId}`
      );
      const data = res.data.data;
      setSingleproduct(data);

      const recommendationRes = await axios.post(
        `${API}/api/product/recommendation`,
        {
          categories: [data.categories],
          excludeIds: [data._id],
        }
      );

      if (recommendationRes.data.success) {
        setRecommendedProducts(recommendationRes.data.products);
      }
    } catch (err) {
      console.error("Failed to fetch product or recommendations:", err);
    }
  };

  useEffect(() => {
    fetchProductAndRecommendations();
  }, []);

  const handleAddToCart = async () => {
    const userId = sessionStorage.getItem("userid");

    if (!userId) {
      toast.error("Please log in first to add to cart.");
      return;
    }

    try {
      await axios.post(`${API}/api/cart/addtocart`, {
        userId,
        productId,
      });
      toast.success("Product added to cart!");
    } catch (err) {
      console.error("Add to cart failed:", err);
      toast.error("Failed to add to cart.");
    }
  };

  const handleSubmitReview = async () => {
    const userId = sessionStorage.getItem("userid");
    const username = `${sessionStorage.getItem(
      "firstname"
    )} ${sessionStorage.getItem("lastname")}`;

    if (!userId) {
      toast.error("Please log in to leave a review.");
      return;
    }

    if (!comment || rating < 1 || rating > 5) {
      toast.warning("Please provide a comment and rating (1–5 stars).");
      return;
    }

    try {
      await axios.post(`${API}/api/product/addreview`, {
        productId,
        userId,
        username,
        comment,
        rating,
      });
      // toast.success("Review submitted!");
      setComment("");
      setRating(0);
      fetchProductAndRecommendations();
      setReviewOpen(true); // ensure review section remains open
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit review.");
    }
  };

  const calculateAverageRating = () => {
    if (!singleproduct?.reviews?.length) return 0;
    const sum = singleproduct.reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / singleproduct.reviews.length).toFixed(1);
  };

  return (
    <div style={{ backgroundColor: "#FFF5EB" }}>
      <Header />
      {singleproduct && (
        <div className="px-4">
          <div className="text-center mb-4">
            <h4>{singleproduct.name}</h4>
            <small>{`Home / ${singleproduct.categories} / ${singleproduct.name}`}</small>
          </div>

          <div className="row mb-5">
            <div className="col-md-2 d-none d-md-block">
              <div className="d-flex flex-column gap-2">
                {[...Array(4)].map((_, i) => (
                  <a
                    key={i}
                    href={`${API}/uploads/${singleproduct.image}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={`${API}/uploads/${singleproduct.image}`}
                      className="img-fluid rounded border"
                      alt={`Thumbnail ${i + 1}`}
                    />
                  </a>
                ))}
              </div>
            </div>

            <div className="col-md-5 text-center mb-4 mb-md-0 border rounded">
              <a
                href={`${API}/uploads/${singleproduct.image}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={`${API}/uploads/${singleproduct.image}`}
                  className="img-fluid rounded"
                  alt="Main"
                  style={{ width: "500px", height: "500px" }}
                />
              </a>
            </div>

            <div className="col-md-5 text-center">
              <h5>{singleproduct.name}</h5>
              <div className="mb-2">
                ⭐ {calculateAverageRating()} / 5 (
                {singleproduct.reviews?.length || 0} Reviews)
              </div>
              <h4 className="text-success">₹{singleproduct.newprice}</h4>
              <p className="text-muted text-decoration-line-through">
                ₹{singleproduct.oldprice}
              </p>
              <div className="d-flex gap-2 mb-3 justify-content-center">
                <button className="btn btn-dark">Buy Now</button>
                <button
                  className="btn btn-outline-dark"
                  onClick={handleAddToCart}
                >
                  Add Cart
                </button>
              </div>

              {/* Accordion */}
              <div className="accordion" id="productAccordion">
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#desc"
                    >
                      Description
                    </button>
                  </h2>
                  <div
                    id="desc"
                    className="accordion-collapse collapse show"
                    data-bs-parent="#productAccordion"
                  >
                    <div className="accordion-body">
                      {singleproduct.description}
                    </div>
                  </div>
                </div>

                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#shipping"
                    >
                      Shipping Information
                    </button>
                  </h2>
                  <div
                    id="shipping"
                    className="accordion-collapse collapse"
                    data-bs-parent="#productAccordion"
                  >
                    <div className="accordion-body">
                      Free shipping across India. Delivery within 5–7 business
                      days.
                    </div>
                  </div>
                </div>

                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className={`accordion-button ${
                        reviewOpen ? "" : "collapsed"
                      }`}
                      type="button"
                      onClick={() => setReviewOpen(!reviewOpen)}
                      data-bs-toggle="collapse"
                      data-bs-target="#review"
                    >
                      Reviews
                    </button>
                  </h2>
                  <div
                    id="review"
                    className={`accordion-collapse collapse ${
                      reviewOpen ? "show" : ""
                    }`}
                    data-bs-parent="#productAccordion"
                  >
                    <div className="accordion-body">
                      {singleproduct.reviews?.length > 0 ? (
                        singleproduct.reviews.map((rev, idx) => (
                          <div key={idx} className="mb-3 border-bottom pb-2">
                            <strong>{rev.username}</strong> - ⭐ {rev.rating}/5
                            <p className="mb-0">{rev.comment}</p>
                          </div>
                        ))
                      ) : (
                        <p>No reviews yet.</p>
                      )}

                      <div className="mt-3">
                        <h6>Write a Review</h6>
                        <select
                          className="form-select w-auto mb-2"
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}
                        >
                          <option value={0}>Select Rating</option>
                          {[1, 2, 3, 4, 5].map((r) => (
                            <option key={r} value={r}>
                              {r} Star{r > 1 ? "s" : ""}
                            </option>
                          ))}
                        </select>
                        <textarea
                          className="form-control mb-2"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Write your review..."
                        />
                        <button
                          className="btn btn-primary"
                          onClick={handleSubmitReview}
                        >
                          Submit Review
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* You Might Also Like */}
          {recommendedProducts.length > 0 && (
            <>
              <div className="mb-4">
                <h5>You Might Also Like</h5>
              </div>
              <div className="row">
                {recommendedProducts.map((product) => (
                  <div className="col-6 col-md-3 mb-4" key={product._id}>
                    <div className="card h-100 shadow-sm">
                      <img
                        src={`${API}/uploads/${product.image}`}
                        className="card-img-top"
                        alt={product.name}
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                      <div className="card-body text-center">
                        <h6 className="card-title">{product.name}</h6>
                        <p className="text-muted">₹{product.newprice}</p>
                        <button
                          className="btn btn-sm btn-dark"
                          onClick={async () => {
                            const userId = sessionStorage.getItem("userid");
                            if (!userId) {
                              toast.error("Please log in first.");
                              return;
                            }
                            try {
                              await axios.post(
                                `${API}/api/cart/addtocart`,
                                {
                                  userId,
                                  productId: product._id,
                                  quantity: 1,
                                }
                              );
                              toast.success("Product added to cart!");
                            } catch (err) {
                              console.error("Add to cart failed:", err);
                              toast.error("Failed to add to cart.");
                            }
                          }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
      <ToastContainer position="top-right" autoClose={4000} />
    </div>
  );
}

export default Singleproduct;
