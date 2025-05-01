import React from "react";
import Heading from "../Reusable-subComponents/Heading";

const ContactUs = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 pb-10">
     
   <Heading heading={"Contact Us"}/>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        <form className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Your Email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Your Concern</label>
            <textarea
              className="w-full border px-3 py-2 rounded-md h-32 resize-none focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Write your message here..."
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-900 transition"
          >
            Submit
          </button>
        </form>

        {/* Contact Details */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
          <div className="flex items-start gap-4">
            <i className="fas fa-map-marker-alt text-black text-2xl"></i>
            <div>
              <h4 className="font-semibold">Location</h4>
              <p>123 Developer Street, Code City, 54321</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <i className="fas fa-phone text-black text-2xl"></i>
            <div>
              <h4 className="font-semibold">Phone</h4>
              <p>021 12345678</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <i className="fas fa-envelope text-black text-2xl"></i>
            <div>
              <h4 className="font-semibold">Email</h4>
              <p>fashionista@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
