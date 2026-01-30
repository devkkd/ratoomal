// "use client";
// import React, { useState } from 'react';
// import { ChevronDown, CheckCircle, AlertCircle, ArrowRight, Package, Users, Palette, Award } from 'lucide-react';

// const CustomBulkSolutions = () => {
//   const [formData, setFormData] = useState({
//     companyName: '',
//     contactPersonName: '',
//     businessEmail: '',
//     country: '',
//     phone: '',
//     inquiryType: '',
//     productCategory: '',
//     estimatedQuantity: '',
//     customizationRequired: '',
//     message: ''
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState(null);
//   const [submitMessage, setSubmitMessage] = useState('');

//   const countries = [
//     'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Belgium', 'Switzerland', 'Austria', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Japan', 'South Korea', 'Singapore', 'Hong Kong', 'India', 'UAE', 'Saudi Arabia', 'Other'
//   ];

//   const inquiryTypes = [
//     { value: 'bulk_order', label: 'Bulk Order (50+ pieces)' },
//     { value: 'custom_design', label: 'Custom Design & Manufacturing' },
//     { value: 'wholesale', label: 'Wholesale Partnership' },
//     { value: 'private_label', label: 'Private Label/OEM' },
//     { value: 'corporate_project', label: 'Corporate Gifting Project' },
//     { value: 'other', label: 'Other Requirements' }
//   ];

//   const productCategories = [
//     { value: 'elephant_figurines', label: 'Elephant Figurines' },
//     { value: 'god_figurines', label: 'God Figurines' },
//     { value: 'utility_decor', label: 'Utility & Decor Items' },
//     { value: 'animal_figurines', label: 'Animal Figurines' },
//     { value: 'all_categories', label: 'All Categories' },
//     { value: 'other', label: 'Other/Custom Category' }
//   ];

//   const quantities = [
//     { value: '1-50', label: '1-50 pieces' },
//     { value: '51-100', label: '51-100 pieces' },
//     { value: '101-500', label: '101-500 pieces' },
//     { value: '501-1000', label: '501-1000 pieces' },
//     { value: '1000+', label: '1000+ pieces' },
//     { value: 'not_sure', label: 'Not sure yet' }
//   ];

//   const customizations = [
//     { value: 'finish_color', label: 'Finish & Color Customization' },
//     { value: 'material_change', label: 'Material Modification' },
//     { value: 'size_modification', label: 'Size Modification' },
//     { value: 'branding_logo', label: 'Branding & Logo Addition' },
//     { value: 'packaging', label: 'Custom Packaging' },
//     { value: 'none', label: 'No Customization Needed' },
//     { value: 'other', label: 'Other Requirements' }
//   ];

//   const features = [
//     {
//       icon: Package,
//       title: 'Bulk Manufacturing',
//       description: 'Large-scale production with consistent quality and competitive pricing for wholesale orders.'
//     },
//     {
//       icon: Palette,
//       title: 'Custom Designs',
//       description: 'Bespoke figurines tailored to your specifications, from concept to finished product.'
//     },
//     {
//       icon: Users,
//       title: 'Corporate Solutions',
//       description: 'Branded corporate gifts and promotional items that reflect your company values.'
//     },
//     {
//       icon: Award,
//       title: 'Premium Quality',
//       description: 'Handcrafted excellence with attention to detail in every piece we create.'
//     }
//   ];

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setSubmitStatus(null);

//     try {
//       const response = await fetch('/api/contact', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           ...formData,
//           source: 'home_page_bulk_section'
//         }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         setSubmitStatus('success');
//         setSubmitMessage(data.message);
//         // Reset form
//         setFormData({
//           companyName: '',
//           contactPersonName: '',
//           businessEmail: '',
//           country: '',
//           phone: '',
//           inquiryType: '',
//           productCategory: '',
//           estimatedQuantity: '',
//           customizationRequired: '',
//           message: ''
//         });
//       } else {
//         setSubmitStatus('error');
//         setSubmitMessage(data.error || 'Failed to submit inquiry. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       setSubmitStatus('error');
//       setSubmitMessage('Network error. Please check your connection and try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <section className="bg-[#FFFBF2] py-20 px-6 md:px-12 lg:px-24">
//       <div className="max-w-7xl mx-auto">
        
//         {/* Header Section */}
//         <div className="text-center mb-16">
//           <h2 className="text-3xl md:text-4xl font-