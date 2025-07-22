import React from 'react'

const FAQItem = ({ question, answer, icon = "fas fa-question-circle" }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-6 hover:bg-blue-50 transition-colors duration-300">
      <h4 className="font-semibold text-gray-900 mb-2">
        <i className={`${icon} text-[#296393] mr-2`}></i>
        {question}
      </h4>
      <p className="text-gray-600 text-sm leading-relaxed">
        {answer}
      </p>
    </div>
  )
}

export default FAQItem 