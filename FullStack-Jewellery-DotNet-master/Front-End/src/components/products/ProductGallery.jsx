import React, { useState } from 'react';

const ProductGallery = ({ mainImage }) => {
  // Create an array of images for demonstration
  const images = [
    mainImage,
    'https://cdn.bradojewellery.com/p/540x/1710404013885.jpeg',
    'https://cdn.bradojewellery.com/p/540x/1710406122399.jpeg',
    'https://cdn.bradojewellery.com/p/540x/1710405940481.jpeg',
    'https://cdn.bradojewellery.com/p/540x/1710405940481.jpeg'
    
  ];

  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="space-y-4">
      {/* Main Image Container */}
      <div className="relative w-full h-[500px] bg-white rounded-lg overflow-hidden group">
        <img
          src={selectedImage || '/placeholder.jpg'}
          alt="Product"
          className="w-full h-full object-contain transform transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.target.src = '/placeholder.jpg' }}
        />
        <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm text-gray-600 px-3 py-2 rounded-full text-sm flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <i className="bi bi-zoom-in me-2"></i>
          Hover to zoom
        </div>
      </div>

      {/* Thumbnails Row */}
      <div className="grid grid-cols-5 gap-2">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(img)}
            className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-300
              ${selectedImage === img 
                ? 'ring-2 ring-offset-2 ring-primary' 
                : 'hover:ring-2 hover:ring-offset-2 hover:ring-gray-300'}`}
          >
            <img
              src={img || '/placeholder.jpg'}
              alt={`Product view ${index + 1}`}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              onError={(e) => { e.target.src = '/placeholder.jpg' }}
            />
            {selectedImage === img && (
              <div className="absolute inset-0 bg-primary/10"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;