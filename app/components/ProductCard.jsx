export default function ProductCard() {
  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition">
      
      <div className="h-56 bg-gray-200" />

      <div className="p-4">
        <h4 className="font-playfair text-lg mb-1">
          Perfume Name
        </h4>

        <p className="font-mona text-[13px] text-gray-600 mb-3">
          ₹2,499
        </p>

        <button className="font-geistMono bg-black text-white px-4 py-2 rounded text-sm">
          View Product
        </button>
      </div>

    </div>
  );
}
