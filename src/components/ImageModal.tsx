import React from 'react';

interface ImageModalProps {
  imageUrl: string;
  altDescription: string;
  firstName: string;
  lastName: string;
  location: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, altDescription, firstName, lastName, location, onClose }) => (
  <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex justify-center items-center" onClick={onClose}>
    <div className="ml-7 lg:ml-0 mr-7 lg:mr-0">
      <img src={imageUrl} alt={altDescription} className='rounded-t-lg' width={500}/>
      <div className="bg-white p-5 rounded-b-lg">
        <h3>{firstName} {lastName}</h3>
        <p className='text-slate-400 text-sm'>{location || 'Location Not Available'}</p>
      </div>
    </div>
  </div>
);

export default ImageModal;
