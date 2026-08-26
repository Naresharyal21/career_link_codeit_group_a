import React from 'react'
import Button from '../../components/commonuiPart/Button'
import { useNavigate, useParams, } from 'react-router'
import useAccounts from '../../hooks/useAccounts';
import useOtpCooldown from "../../hooks/useOtpCooldown";

const ManageAccountCart = ({ onClose }) => {

  const { sendDeleteOTP } = useAccounts();

  

  const navigate = useNavigate();

  const {
    formattedTime,
    isCooldown,
    startCooldown,
  } = useOtpCooldown("dav", 180);


  const handleDeleteAccount = async () => {
    try {


      const response = await sendDeleteOTP();
startCooldown();


      navigate("/pr/verifyotp/dav");


    } catch (error) {
      console.log("Failed to send delete OTP:", error);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center ">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">

        <Button
          type='button'
          onClick={onClose}
          variant='closeButton'><h2 className='font-bold'>X</h2></Button>

        <h4 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white">
          Manage Account
        </h4>
        <Button className='w-full rounded-xl border p-3   '
          type='button'
          variant='gray'> <h3 className="font-semibold text-gray-800  dark:text-white">
            Change Current  Email
          </h3></Button>
        <Button className='w-full mt-6 rounded-xl border p-3'
          type='button'
          disabled={isCooldown}
          onClick={handleDeleteAccount}
          variant='danger' > <h3 className="font-semibold text-gray-800  dark:text-white">
            {isCooldown
              ? `Delete My Account
 (${formattedTime})`
              : "Delete My Account"}
          </h3></Button>




      </div>
    </div>
  )
}

export default ManageAccountCart


