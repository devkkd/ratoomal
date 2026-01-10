import React from 'react';
import { Instagram, Facebook, Youtube, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import ConnectSection from './ConnectSection';
import Guarantees from './Guarantees';

const Footer = () => {
  return (
    <div>
       <div className="">
        <ConnectSection/>
        </div>
 <hr className='text-gray-300'/>
         <div className="">
        <Guarantees/>
       
    </div>
    <footer className="bg-[#FCF8F1] pt-12 font-sans text-gray-800">

      <div className="max-w-7xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="mb-4">
             
              <h2 className="text-xl font-serif font-bold text-[#B8860B]">
                <img src='/images/Group-56121.svg' alt="Ratoomal's Logo" className='text-xl w-48' />
              </h2>
            </div>
            <h3 className="font-bold mona text-xs mb-4">Ratoomals Handicrafts <br />
              House of Quality Since 1955</h3>
            <p className="text-[11px]  text-gray-600">
             Rooted in Jaipur, Rajasthan, Ratoomals is a trusted B2B manufacturer and exporter of handcrafted statues, sculptures, and décor. For generations, we have upheld uncompromising quality standards while supplying heritage-inspired craftsmanship to global markets.

            </p>
            <p className="mt-4 font-bold text-[10px]">Handcrafted in India. Supplied Worldwide.</p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-sm mb-6 mona">Our Category</h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li><a href="#" className="hover:text-amber-700 mona">Animal</a></li>
              <li><a href="#" className="hover:text-amber-700 mona" >God Figure</a></li>
              <li><a href="#" className="hover:text-amber-700 mona">utility / Decor</a></li>
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h4 className="font-bold text-sm mb-6 mona">About Us</h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li><a href="#" className="hover:text-amber-700">About Us</a></li>
              <li><a href="#" className="hover:text-amber-700 mona">Our Vision & Philosophy</a></li>
              <li><a href="#" className="hover:text-amber-700 mona">Our Values</a></li>
              <li><a href="#" className="hover:text-amber-700 mona">Our History</a></li>
              <li><a href="#" className="hover:text-amber-700 mona  ">CEO Message</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm mb-6 mona">Quick Links</h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li><a href="/faq" className="hover:text-amber-700 mona">FAQ's</a></li>
              <li><a href="/testimonials" className="hover:text-amber-700 mona">Testimonials</a></li>
              <li><a href="/contact-us" className="hover:text-amber-700 mona">Contact Us</a></li>
              <li><a href="#" className="hover:text-amber-700 mona">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-amber-700 mona">Terms of Services</a></li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div>
            <h4 className="font-bold text-sm mb-6 mona">Contact</h4>
            <div className="text-xs text-gray-600 space-y-2">
              <p className="flex items-start gap-2 mona">Jaipur, Rajasthan, India</p>
              <p className='mona'>Email: ratoomal@ratoomals.com</p>
              <p className='mona'>Phone: +91-9828358847</p>
            </div>

            
          </div>

          <div>
            <h4 className="font-bold text-sm mb-6 mona">Follow us on</h4>
            <div className="space-y-2">
              <a href="#" className="flex items-center gap-2 text-xs text-gray-600 hover:text-amber-700">
                <img src="/images/icons/instagram-logo-vector-illustrati-2.svg"  className="w-6" /> @ratoomal
              </a>
              <a href="#" className="flex items-center gap-2 text-xs text-gray-600 hover:text-amber-700">
                <img src="/images/icons/g21.svg"  className="w-6" /> @ratoomal
              </a>
              <a href="#" className="flex items-center gap-2 text-xs text-gray-600 hover:text-amber-700">
                <img src="/images/icons/Group.svg"  className="w-6     " /> @ratoomal
              </a>
              <a href="#" className="flex items-center gap-2 text-xs text-gray-600 hover:text-amber-700">
               <img src="/images/icons/LinkedIn_logo_initials-1.svg"  className="w-6" /> @ratoomal
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Global Trade Banner */}
      <div className="bg-[#C08237] py-3 text-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-2 md:gap-4">
          <span className="font-bold text-sm mona">Global Trade Presence</span>
         
          <p className="text-[11px] text-center md:text-left mona text-gray-200">
            Serving international buyers across USA, Europe, Middle East, Asia & beyond, supported by export-ready documentation and dependable delivery timelines.
          </p>
        </div>
      </div>

      {/* Services List & Copyright */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center text-[11px] text-gray-500 mb-4">
          <p className="font-bold mona text-md">
            Wholesale Supply • Bulk Manufacturing • Custom Development • Private Label Solutions • Export Logistics
          </p>
          
        </div>
        <div className='flex justify-between'>
          
      
        <p className="text-[11px] font-bold text-gray-500">© Ratoomals Handicrafts. All rights reserved.</p>
        <p className="text-[11px] font-bold text-gray-500">
            House of Quality Since 1955. Crafted by artisans. Trusted by global buyers.
          </p>
            </div>
      </div>

      {/* Decorative Skyline Bottom */}
      <div className="w-full">
        {/* Replace this with your actual SVG skyline image */}
        <img
          src="/images/Group-277.svg"
          alt="Jaipur Skyline"
          className="w-full h-auto object-bottom opacity-80"
        />
      </div>


    </footer>

     </div>
  );
};

export default Footer;