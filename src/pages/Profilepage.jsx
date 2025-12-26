import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { axiosInstance } from "../../api/axiosinstance";

export default function ProfilePage() {
  const [name, setName] = useState(
    sessionStorage.getItem("name") !== "undefined"
      ? sessionStorage.getItem("name")
      : ""
  );

  const [profilePic, setProfilePic] = useState(
    sessionStorage.getItem("profilePic") !== "undefined"
      ? sessionStorage.getItem("profilePic")
      : null
  );

  const [showModal, setShowModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleProfilePicChange = async (e) => {
    const formData = new FormData();
    formData.append("pfp", e.target.files[0]);

    try {
      const res = await axiosInstance.put("/update-profile-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      sessionStorage.setItem("profilePic", res.data.user.avatar);
      setProfilePic(URL.createObjectURL(e.target.files[0]));
      toast.success("Profile image updated");
    } catch {
      toast.error("Image update failed");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const res = await axiosInstance.put("/update-details", { name });
    sessionStorage.setItem("name", name);

    res.status === 200
      ? toast.success("Profile updated")
      : toast.error("Update failed");
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const res = await axiosInstance.put("/change-password", {
      email: sessionStorage.getItem("email"),
      new_password: newPassword,
      confirm_password: confirmPassword,
    });

    res.status === 200
      ? toast.success("Password updated")
      : toast.error("Password update failed");

    setShowModal(false);
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-white px-6 py-16 font-kaisei">
      {/* Page Header */}
      <div className="max-w-5xl mx-auto mb-14">
        <h1 className="text-4xl font-bold text-blue-300 mb-2">
          Account Settings
        </h1>
        <p className="text-blue-200/70">
          Manage your personal information and security preferences
        </p>
      </div>

      {/* Main Layout */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* LEFT: Avatar Column */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col items-center gap-6"
        >
          <div
            onClick={() => document.getElementById("profilePicInput").click()}
            className="w-40 h-40 rounded-2xl overflow-hidden cursor-pointer border border-blue-400/30 hover:border-blue-400 transition"
          >
            {profilePic ? (
              <img src={profilePic} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl text-blue-300 bg-white/5">
                +
              </div>
            )}
          </div>

          <p className="text-sm text-blue-200/60 text-center">
            Click to update profile picture
          </p>

          <input
            type="file"
            accept="image/*"
            id="profilePicInput"
            onChange={handleProfilePicChange}
            className="hidden"
          />
        </motion.div>

        {/* RIGHT: Settings Panels */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 space-y-10"
        >
          {/* Profile Info */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-blue-300 mb-6">
              Personal Information
            </h2>

            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="text-sm text-blue-200">Full Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-[#0F172A] border border-white/10 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-blue-200">Email Address</label>
                <input
                  readOnly
                  value={sessionStorage.getItem("email")}
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-[#0F172A]/50 text-blue-200/60 cursor-not-allowed"
                />
              </div>

              <button
                type="submit"
                className="mt-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 transition font-semibold"
              >
                Save Profile
              </button>
            </form>
          </section>

          {/* Security */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-blue-300 mb-4">
              Security
            </h2>

            <p className="text-sm text-blue-200/70 mb-4">
              Update your password to keep your account secure.
            </p>

            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-2 rounded-lg border border-blue-400/40 text-blue-300 hover:bg-blue-400/10 transition"
            >
              Change Password
            </button>
          </section>
        </motion.div>
      </div>

      {/* Password Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#0B1220] border border-white/10 rounded-2xl p-6 w-full max-w-sm"
          >
            <h3 className="text-lg font-semibold text-blue-300 mb-4">
              Update Password
            </h3>

            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mb-3 px-4 py-3 rounded-xl bg-[#0F172A] border border-white/10"
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mb-5 px-4 py-3 rounded-xl bg-[#0F172A] border border-white/10"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleResetPassword}
                className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600"
              >
                Update
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
