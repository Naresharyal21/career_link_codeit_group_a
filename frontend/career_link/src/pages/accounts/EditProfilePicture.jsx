import EditProfilePictureForm from "../../components/accounts/EditProfilePictureForm";
import Button from "../../components/commonuiPart/Button";

const EditProfilePicture = ({ onClose }) => (
  <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/50 px-4 py-6">
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-image-title"
      className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
    >
      <Button
        type="button"
        onClick={onClose}
        aria-label="Close profile image dialog"
        variant="closeButton"
      >
        <span aria-hidden="true">×</span>
      </Button>
      <h2 id="profile-image-title" className="mb-5 pr-8 text-xl font-semibold text-slate-900">
        Update profile image
      </h2>
      <EditProfilePictureForm onClose={onClose} />
    </section>
  </div>
);

export default EditProfilePicture;
