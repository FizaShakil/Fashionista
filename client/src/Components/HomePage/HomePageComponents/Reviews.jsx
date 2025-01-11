import React from 'react';
import Heading from '../../Reusable-subComponents/Heading';
import ReviewsDataList from './HomePageSubComponents/ReviewsDataList';
import ViewAllButton from './HomePageSubComponents/ViewAllButton';

const Reviews = () => {
  return (
    <>
      <Heading heading={"What our customers say"} />
      <div className="flex justify-center items-center gap-4 flex-wrap lg:flex-nowrap p-4">
        {ReviewsDataList.map((review, index) => (
          <div
            key={index}
            className="w-[300px] h-[160px] bg-slate-100 rounded-3xl p-4 border-4 border-black
                     hover:bg-black hover:text-white hover:border-white duration-500 hover:bg-opacity-90"
          >
            <h1 className="font-bold text-lg">{review.name}</h1>
            <p className="text-sm">{review.customerReview}</p>
          </div>
        ))}
      </div>
      <ViewAllButton/>
    </>
  );
};

export default Reviews;

