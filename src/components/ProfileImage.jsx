import React from 'react'

function ProfileImage({className = 'w-8 h-8', user}) {
  return (
    user.image
    ? <img className={`${className} rounded-full`} src={user.image} alt="user photo" /> /* https://flowbite.com/docs/images/people/profile-picture-5.jpg */
    : (
      <div className={`${className} rounded-full bg-[#00a8b3] flex items-center justify-center font-semibold text-white gap-[0.5px] pb-[1px] uppercase`}>
        <span>{user.firstName[0]}</span>
        <span>{user.lastName[0]}</span>
      </div>
    )
  )
}

export default ProfileImage