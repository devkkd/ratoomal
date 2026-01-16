'use client';

import { useState, useEffect } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, XCircle, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

const BulkUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv'
      ];
      
      if (!validTypes.includes(selectedFile.type)) {
        setError('Please upload a valid Excel file (.xlsx, .xls, .csv)');
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setError('');
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setProgress(0);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);

      const response = await fetch('/api/admin/bulk-upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.message || 'Upload failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    if (!isClient) return;

    // Create sample template
    const templateData = [
      {
        'Product Name': 'Wooden Dining Chair',
        'Price (₹)': 2999,
        'MOQ': 1,
        'Category': 'Furniture',
        'Sub Category': 'Dining Chairs',
        'Thumbnail Image': 'uploads/chairs/chair_thumb.jpg',
        'Additional Images': 'chair1.jpg,chair2.jpg,chair3.jpg',
        '360° Video (Optional)': '',
        'Services': 'Free Installation, 10 Year Warranty',
        'Features': 'Ergonomic Design, Adjustable Height, Solid Wood',
        'God Name (If Applicable)': '',
        'Color': 'Brown',
        'Suitable For': 'Dining Room, Kitchen',
        'Usage': 'Indoor use only',
        'Posture': 'Straight Back',
        'Base Shape': 'Round',
        'Finish': 'Matte',
        'Appearance': 'Classic',
        'Care Instructions': 'Wipe with dry cloth',
        'Assembly Required': 'true',
        'Availability': 'In Stock',
        'Product Type': 'Dining Chair',
        'Short Description': 'Premium wooden dining chair',
        'Long Description': 'High-quality wooden chair perfect for dining rooms',
        'Full Description': 'Made from solid sheesham wood with premium finish'
      },
      {
        'Product Name': 'Brass Ganesha Idol',
        'Price (₹)': 1599,
        'MOQ': 1,
        'Category': 'Decor',
        'Sub Category': 'Idols',
        'Thumbnail Image': 'uploads/idols/ganesha_thumb.jpg',
        'Additional Images': 'ganesha1.jpg,ganesha2.jpg',
        '360° Video (Optional)': '',
        'Services': 'Free Gift Box, Authenticity Certificate',
        'Features': 'Handcrafted, Antique Finish, Blessings Included',
        'God Name (If Applicable)': 'Ganesha',
        'Color': 'Gold',
        'Suitable For': 'Pooja Room, Office Desk',
        'Usage': 'Religious purposes',
        'Posture': 'Sitting',
        'Base Shape': 'Round Base',
        'Finish': 'Antique',
        'Appearance': 'Traditional',
        'Care Instructions': 'Polish monthly',
        'Assembly Required': 'false',
        'Availability': 'In Stock',
        'Product Type': 'Idol',
        'Short Description': 'Beautiful brass Ganesha idol',
        'Long Description': 'Handmade brass idol for home decor',
        'Full Description': 'Traditional handcrafted brass idol with intricate designs'
      }
    ];

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    
    // Set column widths
    const colWidths = [
      { wch: 20 }, // Product Name
      { wch: 10 }, // Price
      { wch: 5 },  // MOQ
      { wch: 15 }, // Category
      { wch: 15 }, // Sub Category
      { wch: 25 }, // Thumbnail
      { wch: 25 }, // Additional Images
      { wch: 20 }, // Video
      { wch: 25 }, // Services
      { wch: 25 }, // Features
      { wch: 20 }, // God Name
      { wch: 10 }, // Color
      { wch: 20 }, // Suitable For
      { wch: 15 }, // Usage
      { wch: 15 }, // Posture
      { wch: 15 }, // Base Shape
      { wch: 10 }, // Finish
      { wch: 15 }, // Appearance
      { wch: 20 }, // Care Instructions
      { wch: 15 }, // Assembly Required
      { wch: 15 }, // Availability
      { wch: 15 }, // Product Type
      { wch: 20 }, // Short Description
      { wch: 25 }, // Long Description
      { wch: 30 }  // Full Description
    ];
    worksheet['!cols'] = colWidths;

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products Template');
    
    // Download
    XLSX.writeFile(workbook, 'Product_Bulk_Upload_Template.xlsx');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Bulk Product Upload
        </h1>
        <p className="text-gray-600">
          Upload an Excel file to create multiple products at once. Images will be automatically uploaded to Cloudinary.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Upload Section */}
        <div className="lg:col-span-2">
          {/* Upload Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6 hover:border-blue-500 transition-colors">
            <input
              type="file"
              id="file-upload"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />
            
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center">
                <FileSpreadsheet className="w-20 h-20 text-gray-400 mb-4" />
                {file ? (
                  <div className="text-center">
                    <p className="text-lg font-medium text-gray-700">
                      {file.name}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      Click to select Excel file
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports .xlsx, .xls, .csv files
                    </p>
                  </div>
                )}
              </div>
            </label>

            {file && (
              <button
                onClick={() => setFile(null)}
                className="mt-4 px-4 py-2 text-sm bg-red-100 text-red-600 hover:bg-red-200 rounded-lg"
                disabled={uploading}
              >
                Remove file
              </button>
            )}
          </div>

          {/* Progress Bar */}
          {uploading && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Uploading and processing...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-red-700">Error</p>
                <p className="text-red-600 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Success Result */}
          {result && (
            <div className="mb-6 p-6 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-green-800">Upload Successful!</h3>
                  <p className="text-green-700">{result.message}</p>
                </div>
              </div>
              
              {result.created && result.created.length > 0 && (
                <div className="mt-4 p-4 bg-white rounded-lg border border-green-100">
                  <h4 className="font-medium text-gray-700 mb-3">✅ Created Products ({result.created.length}):</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                    {result.created.map((product, index) => (
                      <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm">
                          <span className="font-medium">Row {product.row}:</span> {product.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {result.errors && result.errors.length > 0 && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-100">
                  <h4 className="font-medium text-red-700 mb-3">❌ Errors ({result.errors.length}):</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {result.errors.slice(0, 10).map((error, index) => (
                      <div key={index} className="flex items-start p-2 bg-white rounded">
                        <XCircle className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-red-600">{error}</span>
                      </div>
                    ))}
                    {result.errors.length > 10 && (
                      <div className="text-center text-red-500 text-sm pt-2">
                        ...and {result.errors.length - 10} more errors
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className={`w-full py-4 rounded-lg font-medium flex items-center justify-center text-lg ${
              !file || uploading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all'
            }`}
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Processing... Please wait
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-3" />
                {file ? `Upload ${file.name}` : 'Select a file to upload'}
              </>
            )}
          </button>
        </div>

        {/* Right Column - Instructions & Actions */}
        <div className="space-y-6">
          {/* Download Template */}
          <div className="p-6 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
              <Download className="w-5 h-5 mr-2" />
              Download Template
            </h3>
            <p className="text-blue-700 text-sm mb-4">
              Use our pre-formatted Excel template with sample data
            </p>
            <button
              onClick={downloadTemplate}
              disabled={!isClient}
              className="w-full py-3 bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50 rounded-lg font-medium flex items-center justify-center"
            >
              <FileSpreadsheet className="w-5 h-5 mr-2" />
              Download Excel Template
            </button>
          </div>

          {/* Instructions */}
          <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3">📋 Instructions</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <div className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">1</div>
                <span>Download and fill the template</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">2</div>
                <span><strong>Required fields:</strong> Product Name, Price, Category</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">3</div>
                <span>For images, use file paths or URLs</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">4</div>
                <span>Ensure categories exist in database</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">5</div>
                <span>Save and upload the Excel file</span>
              </li>
            </ul>
          </div>

          {/* Tips */}
          <div className="p-6 bg-amber-50 rounded-lg border border-amber-100">
            <h3 className="font-semibold text-amber-800 mb-3">💡 Tips</h3>
            <ul className="space-y-2 text-sm text-amber-700">
              <li className="flex items-start">
                <span className="font-medium mr-2">• Images:</span>
                <span>Use file paths or direct URLs</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">• Multiple Images:</span>
                <span>Separate with commas: img1.jpg, img2.jpg</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">• Assembly:</span>
                <span>Use "true" or "false"</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">• Availability:</span>
                <span>"In Stock" or "Out of Stock"</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">• Max File Size:</span>
                <span>10MB recommended</span>
              </li>
            </ul>
          </div>

          {/* Reset Button */}
          <button
            onClick={() => {
              setFile(null);
              setResult(null);
              setError('');
              setProgress(0);
            }}
            className="w-full py-3 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg font-medium"
          >
            Clear & Start Over
          </button>
        </div>
      </div>

      {/* Quick Reference Table */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Excel Columns Reference</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 px-3 border text-left font-medium">Column</th>
                <th className="py-2 px-3 border text-left font-medium">Required</th>
                <th className="py-2 px-3 border text-left font-medium">Type</th>
                <th className="py-2 px-3 border text-left font-medium">Example</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white">
                <td className="py-2 px-3 border font-medium">Product Name</td>
                <td className="py-2 px-3 border text-red-600 font-medium">YES</td>
                <td className="py-2 px-3 border">Text</td>
                <td className="py-2 px-3 border">"Wooden Chair"</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="py-2 px-3 border font-medium">Price (₹)</td>
                <td className="py-2 px-3 border text-red-600 font-medium">YES</td>
                <td className="py-2 px-3 border">Number</td>
                <td className="py-2 px-3 border">2999</td>
              </tr>
              <tr className="bg-white">
                <td className="py-2 px-3 border font-medium">Category</td>
                <td className="py-2 px-3 border text-red-600 font-medium">YES</td>
                <td className="py-2 px-3 border">Text</td>
                <td className="py-2 px-3 border">"Furniture"</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="py-2 px-3 border font-medium">Thumbnail Image</td>
                <td className="py-2 px-3 border">NO</td>
                <td className="py-2 px-3 border">Path/URL</td>
                <td className="py-2 px-3 border">"products/chair.jpg"</td>
              </tr>
              <tr className="bg-white">
                <td className="py-2 px-3 border font-medium">Additional Images</td>
                <td className="py-2 px-3 border">NO</td>
                <td className="py-2 px-3 border">Comma-separated</td>
                <td className="py-2 px-3 border">"img1.jpg, img2.jpg"</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BulkUpload;