import React from 'react'
import { Link } from 'react-router-dom'
const AboutUs = () => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 to-gray-700 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="text-blue-400">Fashionista</span>
            </h1>
            <p className="text-base md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Your ultimate destination for fashion, style, and self-expression. 
              We believe everyone deserves to look and feel their best.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-users text-2xl text-blue-600"></i>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">10K+</h3>
              <p className="text-gray-600">Happy Customers</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-shipping-fast text-2xl text-green-600"></i>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">50K+</h3>
              <p className="text-gray-600">Orders Delivered</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-star text-2xl text-purple-600"></i>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">4.8</h3>
              <p className="text-gray-600">Customer Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Our History */}
          <div className="mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
    <div>
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <i className="fas fa-history text-2xl text-blue-600"></i>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Our History</h2>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic laboriosam nisi cumque velit? 
                  Perferendis dolore facere molestias repellat quibusdam praesentium assumenda sequi, laborum 
                  est odit consequatur reiciendis earum? Suscipit, reprehenderit?
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Excepturi sapiente rerum commodi omnis voluptates ex reprehenderit vitae totam repellendus 
                  tempore, dolores deserunt aliquid veniam facere accusamus modi suscipit voluptatum natus 
                  blanditiis. Ex nulla aliquam, asperiores ea maxime dolorem!
                </p>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl p-8 text-white">
                  <i className="fas fa-quote-left text-4xl mb-4 opacity-50"></i>
                  <p className="text-xl italic mb-4">
                    "Fashion is not something that exists in dresses only. Fashion is in the sky, in the street, 
                    fashion has to do with ideas, the way we live, what is happening."
                  </p>
                  <p className="font-semibold">- Coco Chanel</p>
                </div>
              </div>
            </div>
          </div>

          {/* The Brand */}
          <div className="mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <i className="fas fa-palette text-lg text-yellow-600"></i>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Creative Design</h4>
                      <p className="text-sm text-gray-600">Unique and innovative fashion concepts</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <i className="fas fa-heart text-lg text-red-600"></i>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Quality Craft</h4>
                      <p className="text-sm text-gray-600">Premium materials and expert craftsmanship</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <i className="fas fa-leaf text-lg text-green-600"></i>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Sustainable</h4>
                      <p className="text-sm text-gray-600">Eco-friendly and ethical practices</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <i className="fas fa-globe text-lg text-purple-600"></i>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Global Reach</h4>
                      <p className="text-sm text-gray-600">Serving customers worldwide</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="flex items-center mb-6">
                  <div className="bg-purple-100 p-3 rounded-lg mr-4">
                    <i className="fas fa-crown text-2xl text-purple-600"></i>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">The Brand</h2>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque dolore neque deserunt. 
                  Labore magnam ipsum, adipisci minima incidunt excepturi aspernatur eaque nesciunt a error 
                  deleniti dolorem reprehenderit deserunt repudiandae consequuntur.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Illo, blanditiis neque. Possimus, vero quasi commodi mollitia eligendi dolore. Dolorem 
                  eius aspernatur illum ducimus accusantium ipsam maxime officia deserunt id sint. Voluptate 
                  officiis odio fugit beatae provident eaque voluptatibus.
                </p>
              </div>
            </div>
          </div>

          {/* Our Vision */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-green-100 p-3 rounded-lg mr-4">
                  <i className="fas fa-eye text-2xl text-green-600"></i>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
              </div>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                To become the leading fashion destination that empowers individuals to express their unique 
                style while promoting sustainable and ethical fashion practices.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-rocket text-2xl text-blue-600"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Innovation</h3>
                <p className="text-gray-600">
                  Pushing boundaries in fashion technology and design to create cutting-edge experiences 
                  for our customers.
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-handshake text-2xl text-green-600"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Community</h3>
                <p className="text-gray-600">
                  Building a global community of fashion enthusiasts who share our passion for style, 
                  creativity, and self-expression.
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-award text-2xl text-purple-600"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Excellence</h3>
                <p className="text-gray-600">
                  Maintaining the highest standards of quality, service, and customer satisfaction 
                  in everything we do.
                </p>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-12">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-gradient-to-br from-blue-400 to-purple-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-user text-3xl text-white"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sarah Johnson</h3>
                <p className="text-gray-600">Creative Director</p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-br from-green-400 to-blue-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-user text-3xl text-white"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Michael Chen</h3>
                <p className="text-gray-600">Fashion Designer</p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-br from-purple-400 to-pink-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-user text-3xl text-white"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Emma Davis</h3>
                <p className="text-gray-600">Marketing Manager</p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-user text-3xl text-white"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">David Wilson</h3>
                <p className="text-gray-600">Customer Success</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Discover Your Style?
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Join thousands of fashion enthusiasts who trust Fashionista for their style needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop">
            <button className="bg-[#305586] hover:bg-[#1d395e] text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300">
              <i className="fas fa-shopping-bag mr-2"></i>
              Shop Now
            </button>
            </Link>
             <Link to="/contactus">
            <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors duration-300">
              <i className="fas fa-envelope mr-2"></i>
              Contact Us
            </button>
            </Link>
          </div>
        </div>
     </div>
      </div>
  )
}

export default AboutUs