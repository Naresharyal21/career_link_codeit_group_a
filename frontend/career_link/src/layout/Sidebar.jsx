import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";

import { MdOutlineDashboard, MdOutlineHome } from "react-icons/md";
import { IoBagOutline, IoBriefcaseOutline } from "react-icons/io5";
import { FaRegFilePdf } from "react-icons/fa";
import { MdOutlineDataSaverOff, MdReport } from "react-icons/md";
import { FiHeadphones, FiLogIn, FiUserPlus } from "react-icons/fi";
import { AuthenticationContext } from "../context/AuthContext";


const navigationLinks = [
  {
    name: "Home",
    path: "/",
    icon: MdOutlineHome,
    guestsOnly: true,
  },
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: MdOutlineDashboard,
  },
  {
    name: "Find Jobs",
    path: "/jobs",
    icon: IoBriefcaseOutline,
  },
  {
    name: "Sign in",
    path: "/login",
    icon: FiLogIn,
    guestsOnly: true,
  },
  {
    name: "Create account",
    path: "/signup",
    icon: FiUserPlus,
    guestsOnly: true,
  },
  {
    name: "Applied Jobs",
    path: "/dashboard/applications",
    icon: IoBagOutline,
    roles: ["js"],
  },
  {
    name: "Saved Jobs",
    path: "/dashboard/saved-jobs",
    icon: MdOutlineDataSaverOff,
    roles: ["js"],
  },
  {
    name: "Resume/CV",
    path: "/dashboard/resume",
    icon: FaRegFilePdf,
    roles: ["js"],
  },
  {
    name: "Reports",
    path: "/reports",
    icon: MdReport,
  },
];



const Sidebar = ({ onNavigate }) => {
  const location = useLocation();
  const { user, isAuthenticated } = useContext(AuthenticationContext);
  const links = navigationLinks.filter(
    (item) =>
      (!item.roles || item.roles.includes(user?.role)) &&
      (!item.guestsOnly || !isAuthenticated) &&
      (isAuthenticated || item.guestsOnly || item.path === "/jobs")
  );

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname === path ||
      (path !== "/dashboard" && location.pathname.startsWith(`${path}/`));
  };

  return (
    <div className="flex h-full flex-col">


      <nav className="flex-1 px-4 py-7">



        <p className="
          mb-4
          px-3
          text-[11px]
          font-semibold
          uppercase
          tracking-[0.16em]
          text-slate-500
        ">
          Main Menu
        </p>

        <ul className="space-y-1.5">

          {links.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <li key={item.name}>

                <Link
                  to={item.path}
                  onClick={onNavigate}
                  className={`
                    group
                    relative
                    flex items-center gap-3
                    rounded-xl
                    px-4 py-3
                    text-sm font-medium
                    transition-all duration-200

                    ${
                      active
                        ? `
                          bg-[#6C4DFF]
                          sidebar-nav-active
                          text-white
                          shadow-lg
                          shadow-violet-500/20
                        `
                        : `
                          text-slate-300
                          sidebar-nav-inactive
                          hover:bg-[#F0ECFF]
                          hover:text-[#6C4DFF]
                        `
                    }
                  `}
                >

                 

                  {active && (
                    <span className="
                      absolute
                      left-0
                      h-7
                      w-1
                      rounded-r-full
                      bg-white
                    " />
                  )}

               

                  <Icon
                    className={`
                      shrink-0
                      text-[21px]
                      transition-transform duration-200
                      ${
                        active
                          ? "text-white"
                          : "text-slate-400 group-hover:text-[#6C4DFF] group-hover:scale-110"
                      }
                    `}
                  />

             

                  <span>{item.name}</span>
                </Link>

              </li>
            );
          })}

        </ul>
      </nav>



      <div className="px-4 pb-5">

        <div className="
          relative
          overflow-hidden
          rounded-2xl
          bg-[#24334A]
          p-5
          shadow-lg
        ">


          <div className="
            absolute
            -right-8
            -top-8
            h-24
            w-24
            rounded-full
            bg-[#6C4DFF]/20
          " />

          <div className="
            relative
            z-10
          ">

        

            <div className="
              mb-4
              flex h-10 w-10
              items-center justify-center
              rounded-xl
              bg-[#6C4DFF]
              text-white
            ">
              <FiHeadphones className="text-xl" />
            </div>

      

            <h3 className="
              text-sm
              font-semibold
              text-white
            ">
              Contact Us
            </h3>



            <p className="
              mt-2
              text-xs
              leading-5
              text-slate-300
            ">
              Need help with your account or career journey? Our team is here to help.
            </p>

            <a
              href="mailto:careerlinkdjangogroup1@gmail.com"
              className="
                mt-4
                inline-flex
                w-full
                items-center
                justify-center
                rounded-xl
                bg-[#F0ECFF]
                px-4
                py-2.5
                text-sm
                font-semibold
                text-[#6C4DFF]
                transition-all duration-200
                sidebar-contact-link
                hover:bg-[#6C4DFF]
                hover:text-white
                hover:shadow-lg
                hover:shadow-violet-500/20
              "
            >
              Send us an email
            </a>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;