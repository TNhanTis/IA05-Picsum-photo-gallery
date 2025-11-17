import axios from "axios";

const BASE_URL = "https://picsum.photos";
const PHOTOS_PER_PAGE = 20;

/**
 * Fetch a list of photos from Lorem Picsum API
 * @param {number} page - The page number to fetch
 * @param {number} limit - Number of photos per page
 * @returns {Promise} - Promise resolving to array of photo objects
 */
export const fetchPhotos = async (page = 1, limit = PHOTOS_PER_PAGE) => {
  try {
    const response = await axios.get(`${BASE_URL}/v2/list`, {
      params: {
        page,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching photos:", error);
    throw error;
  }
};

/**
 * Fetch details of a specific photo by ID
 * @param {string} id - The photo ID
 * @returns {Promise} - Promise resolving to photo details
 */
export const fetchPhotoById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/id/${id}/info`);
    return response.data;
  } catch (error) {
    console.error("Error fetching photo details:", error);
    throw error;
  }
};

/**
 * Get the URL for a photo thumbnail
 * @param {string} id - The photo ID
 * @param {number} width - Thumbnail width
 * @param {number} height - Thumbnail height
 * @returns {string} - The thumbnail URL
 */
export const getThumbnailUrl = (id, width = 400, height = 300) => {
  return `${BASE_URL}/id/${id}/${width}/${height}`;
};

/**
 * Get the URL for a full-size photo
 * @param {string} id - The photo ID
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {string} - The full-size image URL
 */
export const getFullSizeUrl = (id, width = 1200, height = 800) => {
  return `${BASE_URL}/id/${id}/${width}/${height}`;
};
