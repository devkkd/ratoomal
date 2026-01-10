
"use client";
import Image from "next/image";
import { useState } from "react";

export default function Utility() {
    const [wishlist, setWishlist] = useState([]);

    const products = [
        {
            id: 1,
            name: "Brown Wooden Elephant Statue",
            qty: "Minimum Order Quantity: 100 Piece",
            price: "₹ 300/Piece",
            img: "/images/products/image-42.svg",
        },
        {
            id: 2,
            name: "Lord Ganesha Sitting Statue",
            qty: "Minimum Order Quantity: 100 Piece",
            price: "₹ 5,000/Piece",
            img: "/images/products/image-36.svg",
        },
        {
            id: 3,
            name: "Blue White Owl Showpiece",
            qty: "Minimum Order Quantity: 100 Piece",
            price: "₹ 500/Piece",
            img: "/images/products/image-73.svg",
        },
        {
            id: 4,
            name: "Multicolor Wooden Elephant Statue",
            qty: "Minimum Order Quantity: 100 Piece",
            price: "₹ 3,500/Piece",
            img: "/images/products/image-48.svg",
        },
    ];

    const toggleWishlist = (id) => {
        setWishlist(prev => {
            if (prev.includes(id)) {
                return prev.filter(item => item !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    return (
        <div className="max-w-7xl items-center mx-auto px-4 sm:px-6 lg:px-12 my-10 ">
           
            <h3 className="playfair text-xl md:text-[30px] text-center flex justify-center font-semibold letter-spacing-[-0.01em] mb-10">
               Utility / Decor
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-6">
                {products.map((item) => (
                    <div key={item.id} className="cursor-pointer w-full max-w-[480px] relative group">
                        <div className="relative w-full h-[280px] sm:h-[330px] bg-gray-100 overflow-hidden rounded-2xl">
                            <Image
                                src={item.img}
                                alt={item.name}
                                fill
                                className="object-cover hover:scale-105 transition duration-300"
                            />
                            
                            {/* Wishlist Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleWishlist(item.id);
                                }}
                                className="absolute top-3 right-3 z-10 p-2 bg-[#FFFFFF80] backdrop-blur-sm rounded-full 
                                           shadow-lg hover:bg-white  active:scale-95 
                                           transition-all duration-200"
                                aria-label={wishlist.includes(item.id) ? "Remove from wishlist" : "Add to wishlist"}
                            >
                                {/* Heart SVG Icon */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-5 w-6 transition-colors duration-200 ${
                                        wishlist.includes(item.id) 
                                            ? "fill-red-500 text-red-500" 
                                            : "text-gray-800 fill-transparent hover:text-red-400"
                                    }`}
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={wishlist.includes(item.id) ? 0 : 2}
                                >
                                    <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/>
                                </svg>
                               
                            </button>
                        </div>

                        <div className="mt-3">
                            <h3 className="font-funnel font-semibold text-md text-black">
                                {item.name}
                            </h3>
                            <p className="font-funnel text-gray-600 font-light text-xs mt-1">
                                {item.qty}
                            </p>
                            <p className="font-funnel font-semibold text-black text-sm mt-1">
                                {item.price}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-center w-full flex justify-center items-center  mt-10">
               
            <button className="mt-8 mona px-10 py-4 bg-[#c48b46] text-white rounded-full flex items-center gap-1 hover:bg-[#a6753a] transition-all duration-300 font-medium text-base">
           See All Utility / Decor →
              {/* <span className="text-xl group-hover:translate-y-1 transition-transform duration-300">
                
              </span> */}
            </button>
            </div>

             <hr className="border-t border-gray-300 mt-8 " />
        </div>
    );
}