import React from 'react';
import ArtistNavbar from '../../components/ArtistNav';
import { MdDelete, MdDeleteSweep } from 'react-icons/md';

const staticData = [
  {
    _id: '1',
    notificationMessage: 'New message from user123',
    date: new Date(),
  },
  {
    _id: '2',
    notificationMessage: 'You have a new follower',
    date: new Date(),
  },
  {
    _id: '3',
    notificationMessage: 'Your artwork has been liked',
    date: new Date(),
  },
];

const ArtistNotification = () => {
  const formatTime = (date) => {
    // You can use your preferred method to format the date here
    return date.toLocaleTimeString();
  };

  const clearAllNotifications = () => {
    // Implement your logic to clear all notifications
    console.log('Clear All Notifications');
  };

  const clearMessage = (notificationId) => {
    // Implement your logic to clear a specific notification
    console.log(`Clear Notification with ID: ${notificationId}`);
  };

  return (
    <div>
      <ArtistNavbar />
      <div className="bg-white min-h-screen">
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center ">
            <h1 className="text-3xl font-extrabol text-slate-500 mb-11">Notifications</h1>
            <div className="clear-all-button">
              {staticData.length > 1 && (
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-full"
                  onClick={() => clearAllNotifications()}
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
          <div className="space-y-4">
            {staticData.length > 0 ? (
              staticData.map((item) => (
                <div
                  key={item?._id}
                  className="bg-white p-4 w-full rounded-lg shadow-md flex items-center justify-between space-x-4"
                >
                  <div className="flex-grow">
                    <p className="text-gray-800 font-extrabold">{item?.notificationMessage}</p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-gray-800 mr-4 font-bold">{formatTime(item?.date)}</p>
                    <button
                      onClick={() => clearMessage(item?._id)}
                    >
                     <MdDelete fill='red'/>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-800 font-extrabold">No notifications</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistNotification;
