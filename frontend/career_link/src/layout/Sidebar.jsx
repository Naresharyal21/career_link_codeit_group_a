import React from 'react'
import { NavLink } from "react-router";

import { MdOutlineDashboard, MdOutlineDataSaverOff } from "react-icons/md";
import { IoBagOutline } from "react-icons/io5";
import { FaRegFilePdf } from "react-icons/fa";
import { MdReport, MdSpaceDashboard } from "react-icons/md";

import { decodeToken } from "../utils/DecodeToken.js";

// Temporaroy JWT auth

const useCurrentUser = () => {
    const token = localStorage.getItem("accessToken");
    const payload = decodeToken(token);

    return { isModerator: Boolean(payload?.is_staff) };
};

const jobSeekerLinks = [
    { name: "Dashboard", path: "/", icon: MdOutlineDashboard },
    { name: "Applied Jobs", path: "/applied-jobs", icon: IoBagOutline },
    { name: "Saved Jobs", path: "/saved-jobs", icon: MdOutlineDataSaverOff },
    { name: "Resume/CV", path: "/resume", icon: FaRegFilePdf },
];

const moderatorLinks = [
    { name: "Moderator Dashboard", path: "/moderator", icon: MdSpaceDashboard },
    { name: "Reports", path: "/moderator/reports", icon: MdReport },
];

const Sidebar = () => {
    const { isModerator } = useCurrentUser();

    const links = isModerator
        ? [...jobSeekerLinks, ...moderatorLinks]
        : jobSeekerLinks;

    return (
        <div className="wrapper">
            <ul className="pl-4">
                {links.map((item) => (
                    <li
                        key={item.path}
                        className="rounded-md"
                    >
                        <NavLink
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-2 pl-4 pr-2 mb-1 h-13 w-55 rounded-md transition-colors ${
                                    isActive
                                        ? "bg-purple-900 text-white"
                                        : "text-black hover:text-white hover:bg-purple-900"
                                }`
                            }
                        >
                            <item.icon className="text-xl" />
                            <span>{item.name}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>

            <div className="h-45 mt-8 ml-3 pl-4 pt-3 w-55 flex flex-col bg-gray-50 shadow shadow-black/12 rounded">
                <span>
                    Need Help?
                    <br />
                    Our Support team is here to assist your career Journey.
                </span>
                <span>
                    <button className="mt-7 rounded bg-amber-200 w-45 h-10">
                        Contact Us
                    </button>
                </span>
            </div>
        </div>
    );
};

export default Sidebar;