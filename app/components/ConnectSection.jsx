import React from 'react';
import { ArrowRight } from 'lucide-react';

const ConnectSection = () => {
  return (
    <section className="bg-white py-20 px-6 md:px-12 lg:px-24 text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl playfair font-bold text-gray-800">Contact Us</h3>
          <h2 className="text-4xl md:text-4xl font-bold mona my-6">Connect with Ratoomal's</h2>
          <h6 className="text-gray-600 text-md ">
            We welcome inquiries from international retailers, distributors, interior design partners, and export clients.
          </h6>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Jaipur Office */}
          <div className="space-y-6">
            <h4 className="text-xl playfair font-bold  ">Jaipur Office and Showroom</h4>
            <div className="flex gap-4 h-64 md:h-80">
              <a 
                href="https://maps.google.com/?q=2,+Ratan+Niwas,+Opposite+Anukampa+Mansion,+M.I.+Road,+Jaipur+302001,+Rajasthan,+India"
                target="_blank"
                rel="noopener noreferrer"
                className="w-1/2 block hover:opacity-90 transition-opacity"
              >
                <img 
                  src="/images/connect/image-118.svg" 
                  alt="Hawa Mahal Jaipur" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </a>
              <a 
                href="https://maps.google.com/?q=2,+Ratan+Niwas,+Opposite+Anukampa+Mansion,+M.I.+Road,+Jaipur+302001,+Rajasthan,+India"
                target="_blank"
                rel="noopener noreferrer"
                className="w-1/2 block hover:opacity-90 transition-opacity"
              >
                <img 
                  src="/images/connect/image-119.svg" 
                  alt="Jaipur Location Map" 
                  className="w-full h-full object-cover rounded-2xl border border-gray-200"
                />
              </a>
            </div>
            <div className="space-y-4 pt-4">
              <h5 className="text-xl mona font-bold">Ratoomal's Handicraft's</h5>
              <p className="text-sm leading-relaxed mona text-gray-700">
                <span className="font-bold mona text-black">Address :</span> 2, Ratan Niwas, Opposite Anukampa Mansion, M.I. Road, Jaipur — 302001, Rajasthan, India.
              </p>
              <p className="text-sm text-gray-700 mona">
                <span className="font-bold mona text-black">Phone :</span> +91-9828358847 / +91-9414069594
              </p>
              <p className="text-sm text-gray-700 mona">
                <span className="font-bold mona text-black">Email :</span> ratoomal@ratoomals.com
              </p>
            </div>
          </div>

          {/* Greater Noida Showroom */}
          <div className="space-y-6">
            <h4 className="text-xl playfair font-bold">Greater Noida Showroom</h4>
            <div className="flex gap-4 h-64 md:h-80">
              <a 
                href="https://maps.google.com/?q=Plot+No.+23/25,+27/29,+Knowledge+Park+II,+Greater+Noida,+Uttar+Pradesh+201310"
                target="_blank"
                rel="noopener noreferrer"
                className="w-1/2 block hover:opacity-90 transition-opacity"
              >
                <img 
                  src="/images/connect/Mask-group.svg" 
                  alt="Greater Noida Statue" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </a>
              <a 
                href="https://maps.google.com/?q=Plot+No.+23/25,+27/29,+Knowledge+Park+II,+Greater+Noida,+Uttar+Pradesh+201310"
                target="_blank"
                rel="noopener noreferrer"
                className="w-1/2 block hover:opacity-90 transition-opacity"
              >
                <img 
                  src="/images/connect/image-123.svg" 
                  alt="Noida Location Map" 
                  className="w-full h-full object-cover rounded-2xl border border-gray-200"
                />
              </a>
            </div>
            <div className="space-y-4 pt-4">
              <h5 className="text-xl mona font-bold uppercase">INDIA EXPO CENTRE & MART</h5>
              <p className="text-sm leading-relaxed text-gray-700 mona">
                Plot No. 23/25, 27/29, Knowledge Park II, Greater Noida, Uttar Pradesh 201310
              </p>
              <button className="mt-4 bg-[#121212] text-white px-8 py-3 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-gray-800 transition-all">
                Reserve Your Visit <span className="text-lg">+</span>
              </button>
            </div>
          </div>

        </div>
      </div>
     
    </section>
  );
};

export default ConnectSection;