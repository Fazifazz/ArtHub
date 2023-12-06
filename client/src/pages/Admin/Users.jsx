// Dashboard.jsx
import React, { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNav";
import { adminRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../util/api";
import Swal from 'sweetalert2'
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/AlertSlice";
import toast from "react-hot-toast";

const Users = () => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    getUsers()
  }, []);

  const getUsers = async()=>{
    dispatch(showLoading());
    adminRequest({
      url: apiEndPoints.showUsers,
      method: "get",
    }).then((res) => {
      dispatch(hideLoading());
      if (res.data.success) {
        setUsers(res.data.users);
      }
    }).catch((error)=>{
        console.log(error.message)
        toast.error('something went wrong')
    })
  }
  const blockUser = async(id)=>{
    const isBlocked = users.find((user)=>user._id===id)?.isBlocked;
    const result = await Swal.fire({
        title: isBlocked ? 'Unblock Confirmation' : 'Block Confirmation',
        text: isBlocked
          ? 'Are you sure you want to Unblock this User?'
          : 'Are you sure you want to Block this User?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: isBlocked ? 'Unblock' : 'Block',
        cancelButtonText: 'Cancel',
      });
      if(result.isConfirmed){
        dispatch(showLoading())

        adminRequest({
            url:apiEndPoints.blockUser,
            method:'post',
            data:{id:id}
        }).then((res)=>{
            dispatch(hideLoading())
            if(res.data.success){
                toast.success(res.data.success)
                getUsers()
            }else{
                toast.error(res.data.error)
            }
        })
      }
  }

  return (
    <>
      <AdminNavbar />
      <div className="min-h-full">
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Users
            </h1>
          </div>
        </header>
        <main>
          <div className="mt-8 mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            {/* Your content */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-100 border border-gray-300">
                <thead className="bg-gray-400">
                  <tr>
                    <th className="border-b p-4">Sl No:</th>
                    <th className="border-b p-4">profile</th>
                    <th className="border-b p-4">Name</th>
                    <th className="border-b p-4">Mobile</th>
                    <th className="border-b p-4">Email</th>
                    <th className="border-b p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => {
                    return (
                      <tr key={user._id}>
                        <td className="border-b p-4 text-left">{index + 1}</td>
                        <td className="border-b p-4 text-left">
                          <img
                            className="h-10 w-10 rounded-full"
                            src='/images/avatar.png'
                            alt="image"
                          />
                        </td>
                        <td className="border-b p-4 text-left">{user.name}</td>
                        <td className="border-b p-4 text-left">
                          {user.mobile}
                        </td>
                        <td className="border-b p-4 text-left">{user.email}</td>
                        <td>
                        <button
                        className={`${user.isBlocked ? 'bg-green-500' : 'bg-red-500'
                          } text-white px-2 py-1 rounded-full w-20 md:w-24 h-8 md:h-10`}
                        onClick={() => {
                          blockUser(user._id);
                        }}
                      >
                        {user.isBlocked ? 'Blocked' : 'Block'}
                      </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Users;
