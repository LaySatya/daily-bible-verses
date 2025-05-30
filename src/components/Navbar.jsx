import { FaCross, FaGripLines, FaMale, FaPeopleArrows, FaUser, FaUserMd } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import React from 'react';
import { CiSettings } from "react-icons/ci";
import { FcSettings } from "react-icons/fc";
import { FiLogOut } from "react-icons/fi";
import { FaGear } from "react-icons/fa6";

export default function Navbar() { // No onMenuClick prop needed anymore
  const { logout, logoutMessage } = useAuth();
  const userName = localStorage.getItem("userName") || "User";
  const profileChar = userName.charAt(0).toUpperCase();

  return (
    <div className="navbar bg-slate-700 text-white shadow-md px-4">
      {/* Menu/Drawer Toggle Button (Visible on small screens, hidden on large) */}
      <div className="flex-none lg:hidden"> {/* DaisyUI: flex-none to not grow, hidden on large screens */}
        <label htmlFor="my-drawer" className="btn btn-ghost btn-circle"> {/* htmlFor connects to the drawer's input */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </label>
      </div>

      {/* App Title */}
      <div className="flex-1">
        <a className="btn btn-ghost text-xl normal-case"><FaUser/> {userName}</a>
      </div>
      <div className="flex-1">
    <FaCross className='text-3xl' />
      </div>

      {/* Profile Dropdown */}
      <div className="flex-none gap-2">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full hover:text-slate-500 flex items-center justify-center text-xl font-bold border-2 border-slate-500">
              {profileChar}
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-slate-700 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <span className="text-white-800 font-semibold"><FaUser/> {userName}</span>
            </li>
            <li>
              <a className="hover:bg-slate-600"><FaGear /> Settings</a>
            </li>
            <li>
              <button onClick={logout} className="hover:bg-red-400 text-red-300 hover:text-white"><FiLogOut/> Logout</button>
            </li>
            {logoutMessage && (
              <li>
                <span className="text-green-400 text-sm italic">{logoutMessage}</span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}