import { useContext, useState } from "react";
import apiClient from "../../apis/apiClient";
import accountsApi from "../../apis/accountsApi";
import { AuthenticationContext } from "../../context/AuthContext";

const EditProfilePictureForm = ({ onClose }) => {
  const { user, setUser } = useContext(AuthenticationContext);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fieldName = user?.role === "ep" ? "logo" : "profile_pictur";

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!image || loading) return;
    if (!image.type.startsWith("image/")) {
      setError("Choose a valid image file.");
      return;
    }
    if (image.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5 MB.");
      return;
    }

    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append(fieldName, image);
    try {
      await apiClient.put("/accounts/me/", formData);
      setUser(await accountsApi.getMe());
      onClose?.();
    } catch (requestError) {
      setError(requestError.message || "Could not update your profile image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-slate-600">
        Choose a JPG, PNG, or other image file (up to 5 MB).
      </p>
      {error && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={(event) => setImage(event.currentTarget.files?.[0] || null)}
        className="block w-full rounded-xl border border-slate-300 p-2 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:font-semibold file:text-blue-700"
      />
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!image || loading}
          className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Saving…" : "Save image"}
        </button>
        {onClose && (
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default EditProfilePictureForm;
