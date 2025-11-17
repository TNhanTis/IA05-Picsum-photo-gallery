import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPhotoById, getFullSizeUrl } from "../services/api";

const PhotoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPhotoDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const photoData = await fetchPhotoById(id);
        setPhoto(photoData);
      } catch (err) {
        setError("Failed to load photo details. Please try again.");
        console.error("Error loading photo details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadPhotoDetails();
    }
  }, [id]);

  const handleBack = () => {
    navigate("/photos");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading photo details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={handleBack}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Back to Gallery
          </button>
        </div>
      </div>
    );
  }

  if (!photo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Photo not found</p>
          <button
            onClick={handleBack}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Back to Gallery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header with Back Button */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={handleBack}
            className="flex items-center text-blue-600 hover:text-blue-700 transition-all font-medium group"
          >
            <svg
              className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Gallery
          </button>
        </div>
      </header>

      {/* Photo Details */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Full-size Image */}
          <div className="relative bg-gray-900">
            <img
              src={getFullSizeUrl(
                photo.id,
                Math.min(photo.width, 1000),
                Math.min(photo.height, 700)
              )}
              alt={`Photo by ${photo.author}`}
              className="w-full h-auto max-h-[60vh] object-contain mx-auto"
            />
          </div>

          {/* Photo Information */}
          <div className="p-6 md:p-8">
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {photo.author ? `${photo.author}` : "Unknown Photographer"}
                </h1>
                <p className="text-sm text-gray-500 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Photo ID: #{photo.id}
                </p>
              </div>

              <div className="border-t border-gray-200 pt-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Details
                </h2>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Author
                    </dt>
                    <dd className="mt-2 text-base font-semibold text-gray-900">
                      {photo.author || "Unknown"}
                    </dd>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Dimensions
                    </dt>
                    <dd className="mt-2 text-base font-semibold text-gray-900">
                      {photo.width} × {photo.height} px
                    </dd>
                  </div>
                  {photo.url && (
                    <div className="md:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">
                        Original Source
                      </dt>
                      <dd className="mt-1">
                        <a
                          href={photo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                        >
                          {photo.url}
                        </a>
                      </dd>
                    </div>
                  )}
                  {photo.download_url && (
                    <div className="md:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">
                        Download URL
                      </dt>
                      <dd className="mt-1">
                        <a
                          href={photo.download_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                        >
                          {photo.download_url}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Description Section */}
              <div className="border-t border-gray-200 pt-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Description
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {photo.description ||
                    `A beautiful photograph captured by ${
                      photo.author || "an unknown photographer"
                    }. 
                    This image is part of the Lorem Picsum collection, showcasing high-quality photography 
                    for design and development purposes.`}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-200 pt-4 flex flex-wrap gap-3">
                <a
                  href={
                    photo.download_url ||
                    getFullSizeUrl(photo.id, photo.width, photo.height)
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  View Original
                </a>
                <button
                  onClick={handleBack}
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Back to Gallery
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PhotoDetail;
