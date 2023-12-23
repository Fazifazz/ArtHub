import React, { useEffect } from 'react';
import MyButton from '../../components/MyButton';
import { useNavigate } from 'react-router-dom';
import { ServerVariables } from '../../util/ServerVariables';
import ArtistNavbar from '../../components/ArtistNav';

const PaymentSuccessPage = () => {
  const navigate = useNavigate()
  
  return (
    <>
      <ArtistNavbar />
      <div className="min-h-screen flex items-center justify-center bg-green-100">
        <div className="bg-white p-8 rounded-md shadow-md text-center">
          <h1 className="text-3xl font-semibold text-green-600 mb-4">Payment Successful!</h1>
          <p className="text-gray-700">Thank you for your purchase.</p>
         <MyButton text='Back To Home'  onClick={()=>navigate(ServerVariables.plansAvailable)} />
        </div>
      </div>
    </>
  );
};

export default PaymentSuccessPage;
