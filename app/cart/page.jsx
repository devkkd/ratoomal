"use client";
import React from 'react';
import Link from 'next/link';

const CartPage = () => {
  return (
    <div className="min-h-screen bg-[#FFF6EB] py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Shopping Cart</h1>
          <p className="text-gray-600 mb-8">Your cart is currently empty</p>
          
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
            <div className="mb-6">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
              <p className="text-gray-500 text-sm">Add some products to get started!</p>
            </div>
            
            <Link href="/category">
              <button className="w-full bg-[#C08237] text-white py-3 px-6 rounded-full font-semibold hover:bg-[#a66f2e] transition-colors">
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;