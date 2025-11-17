import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPhotos, getThumbnailUrl } from "../services/api";

const PhotoList = () => {
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const observer = useRef();

  // Reference to the last photo element for intersection observer
  const lastPhotoRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // Fetch photos when page changes
  useEffect(() => {
    const loadPhotos = async () => {
      try {
        setLoading(true);
        setError(null);
        const newPhotos = await fetchPhotos(page);

        if (newPhotos.length === 0) {
          setHasMore(false);
        } else {
          setPhotos((prevPhotos) => {
            // Prevent duplicates
            const existingIds = new Set(prevPhotos.map((p) => p.id));
            const uniqueNewPhotos = newPhotos.filter(
              (p) => !existingIds.has(p.id)
            );
            return [...prevPhotos, ...uniqueNewPhotos];
          });
        }
      } catch (err) {
        setError("Failed to load photos. Please try again later.");
        console.error("Error loading photos:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPhotos();
  }, [page]);

  const handlePhotoClick = (photoId) => {
    navigate(`/photos/${photoId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            📸 Lorem Picsum Gallery
          </h1>
          <p className="text-gray-600 mt-1 text-sm">
            Discover beautiful photography
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo, index) => {
            const isLastPhoto = photos.length === index + 1;
            return (
              <div
                key={photo.id}
                ref={isLastPhoto ? lastPhotoRef : null}
                onClick={() => handlePhotoClick(photo.id)}
                className="group bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex items-center gap-3 p-2"
              >
                <div className="relative overflow-hidden flex-shrink-0">
                  <img
                    src={getThumbnailUrl(photo.id, 120, 120)}
                    alt={`Photo by ${photo.author}`}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0 py-1">
                  <p className="text-xs text-gray-400 mb-1">#{photo.id}</p>
                  <p className="text-sm text-gray-700 truncate font-medium">
                    {photo.author}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200"></div>
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
            </div>
            <span className="ml-3 text-gray-600 font-medium">
              Loading more photos...
            </span>
          </div>
        )}

        {/* End of List Message */}
        {!hasMore && photos.length > 0 && (
          <div className="text-center py-8 text-gray-500">
            No more photos to load
          </div>
        )}

        {/* Empty State */}
        {!loading && photos.length === 0 && !error && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No photos found</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default PhotoList;
