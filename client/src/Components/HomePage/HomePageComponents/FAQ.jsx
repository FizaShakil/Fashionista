import React from 'react'
import Heading from '../../Reusable-subComponents/Heading'
import FAQItem from './HomePageSubComponents/FAQItem'

const FAQ = () => {
  const faqData = [
    {
      question: "How can I track my order?",
      answer: "You can track your order through your account dashboard or by using the tracking number sent to your email.",
      icon: "fas fa-shipping-fast"
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for all unused items in their original packaging.",
      icon: "fas fa-undo"
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location.",
      icon: "fas fa-globe"
    },
    {
      question: "How can I contact customer support?",
      answer: "You can reach our customer support team via email, phone, or by filling out the contact form on our contact page.",
      icon: "fas fa-headset"
    },
    {
      question: "Are your products authentic?",
      answer: "Yes, all our products are 100% authentic and sourced directly from authorized manufacturers and distributors.",
      icon: "fas fa-certificate"
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and various digital payment methods for your convenience.",
      icon: "fas fa-credit-card"
    }
  ]

  return (
    <div className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Heading heading="Frequently Asked Questions" />
        
        <div className="text-center mb-12">
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Find quick answers to common questions about our services, shipping, returns, and more.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqData.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              icon={faq.icon}
            />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Still have questions? We're here to help!
          </p>
          <button className="bg-[#193246] hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300">
            <i className="fas fa-envelope mr-2"></i>
            Contact Us
          </button>
        </div>
      </div>
    </div>
  )
}

export default FAQ 