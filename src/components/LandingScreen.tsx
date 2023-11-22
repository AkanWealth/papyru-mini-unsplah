import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ImageModal from './ImageModal';
import SearchInput from './SearchInput';
import LoadingScreen from './LoadingScreen';

export interface Photo {
  id: string;
  urls: {
    regular: string;
  };
  alt_description: string;
  user: {
    first_name: string;
    last_name: string;
    location: string;
  };
  blur_hash: string
}

const LandingScreen: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Photo[]>([]);

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleSearch = async (query: string) => {
    try {
      setLoading(true);
      setSearchQuery(query);
      const apiUrl = `https://api.unsplash.com/search/photos?query=${query}&client_id=${
        import.meta.env.VITE_UNSPLASH_ACCESS_KEY
      }`;

      const response = await axios.get(apiUrl);

      setSearchResults(response.data.results);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get(
          `https://api.unsplash.com/photos/?client_id=${
            import.meta.env.VITE_UNSPLASH_ACCESS_KEY
          }`
        );
        setPhotos(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching photos:', error);
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  const displayedPhotos = searchQuery ? searchResults : photos;
  return (
    <div>
      <div className="w-full lg:w-5/6 absolute top-0 lg:top-40 left-0 lg:left-32 overflow-hidden mx-auto mt-5 lg:mt-0">
        <SearchInput onSearch={handleSearch} />
      </div>
      <div className="grid-cols-none lg:grid lg:grid-cols-3 gap-5 mt-20 lg:mt-4 w-auto lg:w-2/3 absolute top-0 lg:top-60 left-0 lg:left-64 overflow-hidden ml-5 lg:ml-0 mr-5 lg:mr-0 lg:p-4">
        {loading
          ? Array.from({ length: 9 }).map((_, index) => (
            <LoadingScreen key={index} />
            ))
          : displayedPhotos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => handleImageClick(photo.urls.regular)}
                className='mt-5 lg:mt-0'
              >
                <div className="relative">
                  <img
                    src={photo.urls.regular}
                    alt={photo.alt_description}
                    className="rounded-lg"
                  />
                  <div className="absolute bottom-0 left-0 text-white text-center p-4">
                    <p className="text-sm">
                      {photo.user.first_name} {photo.user.last_name}
                    </p>
                    <p className="text-xs">{photo.user.location}</p>
                  </div>
                </div>
              </div>
            ))}
        {selectedImage && (
          <div className="">
            <ImageModal
              imageUrl={selectedImage}
              altDescription="Image Description"
              firstName={
                displayedPhotos.find(
                  (photo) => photo.urls.regular === selectedImage
                )?.user.first_name || ''
              }
              lastName={
                displayedPhotos.find(
                  (photo) => photo.urls.regular === selectedImage
                )?.user.last_name || ''
              }
              location={
                displayedPhotos.find(
                  (photo) => photo.urls.regular === selectedImage
                )?.user.location || ''
              }
              onClose={handleCloseModal}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingScreen;
