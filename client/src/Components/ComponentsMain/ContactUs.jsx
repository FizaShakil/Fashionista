import React, { useState } from "react";
import Heading from "../Reusable-subComponents/Heading";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    concern: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
    <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 to-gray-700 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Get in <span className="text-blue-400">Touch</span>
            </h1>
            <p className="text-base md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Form */}
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Send us a Message
                  </h2>
                  <p className="text-gray-600">
                    Fill out the form below and we'll get back to you within 24 hours.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
          <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <i className="fas fa-user mr-2 text-[#3c6d95]"></i>
                      Full Name
                    </label>
            <input
              type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your full name"
              required
            />
          </div>

          <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <i className="fas fa-envelope mr-2 text-[#3c6d95]"></i>
                      Email Address
                    </label>
            <input
              type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your email address"
              required
            />
          </div>

          <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <i className="fas fa-comment mr-2 text-[#3c6d95]"></i>
                      Your Concern
                    </label>
            <textarea
                      name="concern"
                      value={formData.concern}
                      onChange={handleInputChange}
                      rows="6"
                      className="w-full border-2 border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                      placeholder="Tell us about your concern or question..."
              required
            ></textarea>
          </div>

          <button
            type="submit"
                    className="w-full bg-gradient-to-r from-[#193246] to-[#26608f] text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
                    <i className="fas fa-paper-plane mr-2"></i>
                    Send Message
          </button>
        </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="order-1 lg:order-2">
              <div className="space-y-8">
        {/* Contact Details */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">
                    Contact Information
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors duration-300">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <i className="fas fa-map-marker-alt text-blue-600 text-xl"></i>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">Our Location</h4>
                        <p className="text-gray-600">123 Developer Street, Code City, 54321</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-green-50 transition-colors duration-300">
                      <div className="bg-green-100 p-3 rounded-full">
                        <i className="fas fa-phone text-green-600 text-xl"></i>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">Phone Number</h4>
                        <p className="text-gray-600">021 12345678</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors duration-300">
                      <div className="bg-purple-100 p-3 rounded-full">
                        <i className="fas fa-envelope text-purple-600 text-xl"></i>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">Email Address</h4>
                        <p className="text-gray-600">fashionista@example.com</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    <i className="fas fa-clock mr-3 text-orange-600"></i>
                    Business Hours
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Monday - Friday</span>
                      <span className="font-semibold text-gray-900">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Saturday</span>
                      <span className="font-semibold text-gray-900">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Sunday</span>
                      <span className="font-semibold text-red-600">Closed</span>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    <i className="fas fa-share-alt mr-3 text-blue-600"></i>
                    Follow Us
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <a href="#" className="flex items-center justify-center p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300">
                      <i className="fab fa-facebook-f text-xl mr-3"></i>
                      <span className="font-semibold">Facebook</span>
                    </a>
                    <a href="#" className="flex items-center justify-center p-4 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors duration-300">
                      <i className="fab fa-instagram text-xl mr-3"></i>
                      <span className="font-semibold">Instagram</span>
                    </a>
                    <a href="#" className="flex items-center justify-center p-4 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors duration-300">
                      <i className="fab fa-twitter text-xl mr-3"></i>
                      <span className="font-semibold">Twitter</span>
                    </a>
                    <a href="#" className="flex items-center justify-center p-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300">
                      <i className="fab fa-youtube text-xl mr-3"></i>
                      <span className="font-semibold">YouTube</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
            </div>
          </div>

      {/* Map Section */}
      <div className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Find Us on the Map
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Visit our store location or get directions to find us easily.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="bg-gray-200 rounded-xl h-64 flex items-center justify-center">
              <div className="text-center">
                <i className="fas fa-map-marked-alt text-6xl text-gray-400 mb-4"></i>
                <p className="text-gray-600 text-lg">Interactive Map Coming Soon</p>
                <p className="text-gray-500">123 Developer Street, Code City, 54321</p>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default ContactUs;
