import React from "react";
import { Link, useLocation } from "react-router-dom";

import { MdOutlineDashboard } from "react-icons/md";
import { IoBagOutline, IoBriefcaseOutline } from "react-icons/io5";
import { FaRegFilePdf } from "react-icons/fa";
import { MdOutlineDataSaverOff, MdReport } from "react-icons/md";
import { FiHeadphones } from "react-icons/fi";


const navigationLinks = [
  {
    name: "Dashboard",
    path: "/",
    icon: MdOutlineDashboard,
  },
  {
    name: "Find Jobs",
    path: "/jobs",
    icon: IoBriefcaseOutline,
  },
  {
    name: "Applied Jobs",
    path: "/applied-jobs",
    icon: IoBagOutline,
  },
  {
    name: "Saved Jobs",
    path: "/saved-jobs",
    icon: MdOutlineDataSaverOff,
  },
  {
    name: "Resume/CV",
    path: "/resume",
    icon: FaRegFilePdf,
  },
  {
    name: "Reports",
    path: "/reports",
    icon: MdReport,
  },
];



const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname === path ||
      location.pathname.startsWith(`${path}/`);
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

          {navigationLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <li key={item.name}>

                <Link
                  to={item.path}
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
                          text-white
                          shadow-lg
                          shadow-violet-500/20
                        `
                        : `
                          text-slate-300
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
              Need Help?
            </h3>



            <p className="
              mt-2
              text-xs
              leading-5
              text-slate-300
            ">
              Our support team is here to assist
              with your career journey.
            </p>



            <button
              type="button"
              className="
                mt-4
                w-full
                rounded-xl
                bg-[#F0ECFF]
                px-4
                py-2.5
                text-sm
                font-semibold
                text-[#6C4DFF]
                transition-all duration-200
                hover:bg-[#6C4DFF]
                hover:text-white
                hover:shadow-lg
                hover:shadow-violet-500/20
              "
            >
              Contact Us
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;