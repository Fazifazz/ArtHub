import React, { useEffect } from "react";
import { API_BASE_URL } from "../config/api";

const ShowReplies = ({ Reply, Post }) => {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <footer className="flex justify-between items-center mb-2 ml-2">
      <div className="flex items-center mx-2 px-2 rounded-md my-1 py-0.5">
        <div className="flex items-center mr-3 text-sm text-gray-950">
          <img
            className="mr-2 w-6 h-6 rounded-full"
            src={`${API_BASE_URL}/artistProfile/${Post?.postedBy?.profile}`}
            alt="Michael Gough"
          />
          <p className="font-semibold">{Post?.postedBy?.name}</p>
        </div>
        <div className="flex-grow text-sm text-gray-700 dark:text-gray-750 ml-2">
          <small>{Reply?.reply}</small>
        </div>
        <small className="text-gray-500 ml-5">
          {formatDate(Reply?.createdAt)}
        </small>{" "}
        <div className="text-sm text-gray-600 dark:text-gray-400"></div>
      </div>
    </footer>
  );
};

export default ShowReplies;
