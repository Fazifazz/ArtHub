import React, { useEffect } from 'react';
import MyButton from '../../components/MyButton';
import { useNavigate } from 'react-router-dom';
import { ServerVariables } from '../../util/ServerVariables';
import ArtistNavbar from '../../components/ArtistNav';
import { motion } from 'framer-motion';


const PaymentSuccessPage = () => {
  const navigate = useNavigate()
  
  return (
    <>
      <ArtistNavbar />
      <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
       className="min-h-screen flex items-center justify-center bg-green-100">
        <div className="bg-white p-8 rounded-md shadow-md text-center">
        <div className="myDivBg  p-6 m-4">
              <svg
                viewBox="0 0 24 24"
                className="text-green-600 w-16 h-16 mx-auto my-6"
              >
                <path
                  fill="currentColor"
                  d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
                ></path>
              </svg>
              <div className="text-center">
                <h3 className="myTextColor md:text-2xl text-base font-semibold text-center">
                  Payment Done!
                </h3>
                <p className="myPara my-2">
                  Thank you for completing your secure online payment.
                </p>
                <p className="myPara"> Have a great day! </p>

         <MyButton text='Back To Home'  onClick={()=>navigate(ServerVariables.plansAvailable)} />
        </div>
      </div>
      </div>
      </motion.div>
    </>
  );
};

export default PaymentSuccessPage;
