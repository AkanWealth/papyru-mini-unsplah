import axios from 'axios';
import ImageModal from './ImageModal';
import { Photo } from './LandingScreen';
import LoadingPlaceholder from './LandingScreen';
import React, { useState, useEffect } from 'react';

interface SearchInputProps {
  onSearch: (query: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  useEffect(() => {
    const handleSearch = async () => {
      try {
        setLoading(true);
        const apiUrl = `https://api.unsplash.com/search/photos?query=${searchQuery}&client_id=${
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

    handleSearch();
  }, [searchQuery]);

  return (
    <div className="container mx-auto">
      <div className="mx-auto ml-10 lg:ml-0 mr-0 lg:mr-0">
        {searchQuery ? (
          <h1 className="text-2xl text-sky-950">
            Search Result for <span className='text-slate-500'>"Fun"</span>
          </h1>
        ) : null}
        {!searchQuery && (
          <input
            type="text"
            placeholder="Search for photo"
            value={searchQuery}
            autoComplete="name"
            className="p-5 block w-full rounded-md border-0 text-gray-900 bg-white h-12 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
            onChange={handleChange}
          />
        )}
      </div>
      <div className="grid-rows-none lg:grid lg:grid-cols-3 gap-5 mt-12 lg:w-2/3 top-60 ml-32">
        {loading
          ? Array.from({ length: 8 }).map(() => <LoadingPlaceholder />)
          : searchResults.length === 0
          ? null
          : searchResults.map((result) => (
              <div
                key={result.id}
                className=""
                onClick={() => setSelectedImage(result.urls.regular)}
              >
                <img
                  src={result.urls.regular}
                  alt={result.alt_description}
                  className="rounded-lg"
                />

                <div className="absolute bottom-0 right-0 text-white text-center p-4">
                  <p className="text-lg font-bold">
                    {result.user.first_name} {result.user.last_name}
                  </p>
                  <p className="text-sm">{result.user.location}</p>
                </div>
              </div>
            ))}
      </div>

      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          altDescription="Image Description"
          firstName={
            searchResults.find(
              (result) => result.urls.regular === selectedImage
            )?.user.first_name || ''
          }
          lastName={
            searchResults.find(
              (result) => result.urls.regular === selectedImage
            )?.user.last_name || ''
          }
          location={
            searchResults.find(
              (result) => result.urls.regular === selectedImage
            )?.user.location || ''
          }
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};

export default SearchInput;
