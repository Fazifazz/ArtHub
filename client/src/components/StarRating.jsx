import React from "react";

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const renderStar = (type, key) => (
    <svg
      key={key}
      className={`w-5 h-5 inline-block ${type === "full" ? "text-yellow-500" : "text-gray-400"}`}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
    >
      <path d="M10 1l2.5 6.5h6L14 13l2.5 6.5L10 16l-6.5 3.5L5 13l-4.5-5h6L10 1zm0 2.22L8.65 7.5H3.5l4 3.22L6 15.78l4-2.1 4 2.1-1.5-5.56L16.5 7.5h-5.15L10 3.22z" />
    </svg>
  );

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, index) => renderStar("full", index))}
      {hasHalfStar && renderStar("half", "half")}
      {[...Array(emptyStars)].map((_, index) => renderStar("empty", index))}
    </div>
  );
};

export default StarRating;
