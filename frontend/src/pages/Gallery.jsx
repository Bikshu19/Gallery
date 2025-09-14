import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Footer from "../components/Footer";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { token, role, logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get("https://gallery-qzxx.onrender.com/api/gallery");
        setImages(res.data);
      } catch (err) {
        setError("Failed to load gallery. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const handleLogout = () => {
    logout();           // clear auth state + localStorage
    navigate("/login"); // redirect
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Loading gallery...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-serif font-bold text-gray-800">Gallery</h1>

          {!token ? (
            <div className="space-x-3">
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md shadow hover:bg-gray-50 transition"
              >
                Register
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 px-4 py-2 rounded-full border text-sm text-gray-700">
                Welcome,{" "}
                <span className="font-semibold capitalize">{role}</span>
              </div>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Gallery */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {images.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 
                  002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-serif font-semibold text-gray-800 mb-2">
              No Images Available
            </h3>
            <p className="text-gray-600">
              The gallery is currently empty. Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {images.map((img) => (
              <div
                key={img._id}
                className="group bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden border border-gray-200"
              >
                <div className="relative overflow-hidden h-48">
                  <img
                    src={`${img.imageUrl}`}
                    alt={img.title}
                    onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-serif font-semibold text-gray-800 mb-1 group-hover:text-gray-900">
                    {img.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {img.description}
                  </p>
<h3 className="text-lg font-serif font-semibold text-gray-800 mb-1 group-hover:text-gray-900">
                    {img.category}
                  </h3>
                  
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer/>
     
    </div>
  );
}
