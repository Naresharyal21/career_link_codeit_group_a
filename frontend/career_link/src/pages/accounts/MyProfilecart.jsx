import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthenticationContext } from "../../context/AuthContext";
import ManageAccountCart from "./ManageAccountCart";
import AddResume from "./AddResume";
import EditProfilePicture from "./EditProfilePicture";

const MyProfilecart = () => {
  const [showManageAccount, setShowManageAccount] = useState(false);
  const [showAddResume, setShowAddResume] = useState(false);
  const [showEditPicture, setShowEditPicture] = useState(false);
  const { user, logoutUser } = useContext(AuthenticationContext);
  const navigate = useNavigate();

  const initials = user?.username
    ?.trim()
    .split(/\s+/)
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    logoutUser();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-xl shadow-slate-900/15 ring-1 ring-black/5">
        <div className="border-b border-slate-100 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Account
          </p>
          <div className="mt-3 flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700">
              {initials || "U"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {user?.username || "User"}
              </p>
              <p className="truncate text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="space-y-1 p-2">
          <button
            type="button"
            onClick={() => setShowManageAccount(true)}
            className="account-menu-item w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition hover:bg-slate-100"
          >
            Manage my account
          </button>
          <button
            type="button"
            onClick={() => setShowEditPicture(true)}
            className="account-menu-item w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition hover:bg-slate-100"
          >
            Edit profile picture
          </button>
          {user?.role === "js" && (
            <button
              type="button"
              onClick={() => setShowAddResume(true)}
              className="account-menu-item w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition hover:bg-slate-100"
            >
              Add resume
            </button>
          )}
        </div>

        <div className="border-t border-slate-100 p-2">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            Log out
          </button>
        </div>
      </div>

      {showAddResume && <AddResume onClose={() => setShowAddResume(false)} />}
      {showEditPicture && (
        <EditProfilePicture onClose={() => setShowEditPicture(false)} />
      )}
      {showManageAccount && (
        <ManageAccountCart onClose={() => setShowManageAccount(false)} />
      )}
    </>
  );
};

export default MyProfilecart;
