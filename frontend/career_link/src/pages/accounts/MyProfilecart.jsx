import React, { useState } from 'react'
import { useContext } from 'react';

import { AuthenticationContext } from '../../context/AuthContext';
import Button from '../../components/commonuiPart/Button';
import ManageAccountCart from './ManageAccountCart';
import AddResume from './AddResume';
import EditProfilePicture from './EditProfilePicture';



const MyProfilecart = () => {
  const [showManageAccount , setShowManageAccount]=useState();

  const [showAddResume, setShowAddResume]=useState(false);
  const [showEditPicture, setShowEditPicture] = useState(false);

  const { user, logoutUser } = useContext(AuthenticationContext);
  
  const initials = user?.username
    ?.split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();

 



  const handleLogout = () => {
    logoutUser();
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-800 dark:text-white  shadow-lg shadow-black-800/50 mt-16 pb-4 pt-5  w-65 -ml-45 position absolute rounded-b-2xl flex flex-col h-fit">
      <ul className="pl-4  font-bold" >Settings</ul>
      <ul>
        <h2 className="pl-4  mt-3 mb-5 font-medium">Account</h2>
        <li className="pl-4 flex">
          <div className="  flex rounded-full h-9 w-9 text-white justify-center items-center p-2 bg-gray-600">


            {initials}
          </div>
          <div className="ml-1 -mt-2">
            <div className="">  {user?.username}</div>
            <div className="-mt-1"> {user?.email}</div>

          </div>
        </li>

<li>
       
          <Button className='m-1 mt-5  ' onClick={()=>setShowManageAccount(true)} variant='logout' > Manage My Account</Button>
        </li>
<li>
       
          <Button className='m-1' variant='logout' onClick={() => setShowEditPicture(true)}>
            Edit Profile Picture
          </Button>
        </li>

{user?.role=="js" && (
<li>
       
          <Button className='m-1  'variant='logout' onClick={()=>{setShowAddResume(true)}} > Add Resume</Button>
          </li>
      
      )}

        {showAddResume&&(
          <AddResume onClose={()=> setShowAddResume(false)}/>
        )}

        {showEditPicture && (
          <EditProfilePicture onClose={() => setShowEditPicture(false)} />
        )}

        {showManageAccount &&(
          <ManageAccountCart onClose={()=>setShowManageAccount(false)}/>
        )}


        <hr className='m-2'></hr>
        <li>
          <Button onClick={handleLogout}
            variant='logout'>Logout</Button>
        </li>
      </ul>
    </div>
  )
}

export default MyProfilecart
