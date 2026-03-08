import { useContext, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faKey,
  faEye,
  faEyeSlash,
  faShieldHalved,
  faXmark,
  faLock,
  faEnvelope,
  faUserGroup,
  faClipboardList,
  faBookmark,
  faCalendarDays,
  faLocationDot,
  faLink,
  faPen,
  faImages,
  faHeart,
  faComment,
  faChevronRight,
  faEllipsisVertical,
  faTrashCan,
  faExpand,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/AuthContext";
import defaultAvatar from "../../assets/user.png";
import usePassword from "../../hooks/usePassword";
import {
  uploadProfilePhoto,
  getMyProfile,
  getUserBookmarks,
  uploadCoverPhoto,
  deleteProfilePhoto,
  deleteCoverPhoto,
} from "../../api/usersApi";
import { getUserPosts } from "../../api/postsApi";
import { toast } from "react-toastify";
import NavBar from "../../components/NavBar/NavBar";
import PostDetails from "../../components/PostDetails/PostDetails";
import PostSkeleton from "../../components/PostSkeleton/PostSkeleton";

/* ── helpers ────────────────────────────────────────────────────────────── */

function formatJoined(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function abbreviate(n) {
  if (!n && n !== 0) return "0";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

/* ── main component ─────────────────────────────────────────────────────── */

export default function Profile() {
  const { user, token, setUser } = useContext(AuthContext);
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showCoverMenu, setShowCoverMenu] = useState(false);
  const [showCoverView, setShowCoverView] = useState(false);
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);
  const { formik } = usePassword({ setShowPasswordModal });

  /* ── data fetching ── */

  useEffect(() => {
    async function fetchSaved() {
      try {
        setLoadingSaved(true);
        const response = await getUserBookmarks(1, 50);
        if (response.message === "success" || response.success === true) {
          setSavedPosts(response.data?.bookmarks || response.bookmarks || []);
        }
      } catch (error) {
        console.error("Failed to load bookmarks:", error);
      } finally {
        setLoadingSaved(false);
      }
    }

    async function fetchProfile() {
      try {
        const response = await getMyProfile();
        if (response.success === true || response.message === "success") {
          const userData = response.data?.user || response.user;
          setProfileData(userData);
          if (userData) {
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
          }
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoadingProfile(false);
      }
    }
    if (token) {
      fetchProfile();
      fetchSaved();
    }
  }, [token]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const userId = user?._id || user?.id;
        if (!userId) return;
        const response = await getUserPosts(userId, 1, 50);
        if (response.message === "success") {
          setUserPosts(response.data?.posts || []);
        }
      } catch (error) {
        console.error("Failed to load posts:", error);
      } finally {
        setLoadingPosts(false);
      }
    }
    if (user) fetchPosts();
  }, [user?._id]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [imagePreview, coverPreview]);

  /* ── uploads ── */

  async function updatePhoto(file) {
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image exceeds 4MB limit");
      return;
    }
    const formData = new FormData();
    formData.append("photo", file);
    try {
      const response = await uploadProfilePhoto(formData);
      if (response.message === "success" || response.success === true) {
        const updatedUser = response.data?.user || response.user;
        if (updatedUser) {
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
        toast.success("Profile photo updated!");
      }
    } catch {
      toast.error("Failed to upload photo");
    }
  }

  async function updateCover(file) {
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image exceeds 4MB limit");
      return;
    }
    const formData = new FormData();
    formData.append("cover", file);
    try {
      const response = await uploadCoverPhoto(formData);
      if (response.message === "success" || response.success === true) {
        const updatedUser = response.data?.user || response.user;
        if (updatedUser) {
          setUser(updatedUser);
          setProfileData(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
        toast.success("Cover photo updated!");
      }
    } catch {
      toast.error("Failed to upload cover");
    }
  }

  async function removePhoto() {
    try {
      const response = await deleteProfilePhoto();
      if (response.message === "success" || response.success === true) {
        const updatedUser = response.data?.user || response.user || { ...user, photo: null };
        setUser(updatedUser);
        setProfileData(updatedUser);
        setImagePreview(null);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Profile photo removed!");
        setShowPhotoMenu(false);
      }
    } catch {
      toast.error("Failed to remove photo");
    }
  }

  async function removeCover() {
    try {
      const response = await deleteCoverPhoto();
      if (response.message === "success" || response.success === true) {
        const updatedUser = response.data?.user || response.user || { ...user, cover: null };
        setUser(updatedUser);
        setProfileData(updatedUser);
        setCoverPreview(null);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Cover photo removed!");
        setShowCoverMenu(false);
        setShowCoverView(false);
      }
    } catch {
      toast.error("Failed to remove cover");
    }
  }

  if (!user) return null;

  const p = profileData || user;
  const followersCount = p.followersCount ?? p.followers?.length ?? 0;
  const followingCount = p.followingCount ?? p.following?.length ?? 0;
  const postsCount = userPosts.length;
  const joined = formatJoined(p.createdAt);

  const tabs = [
    { key: "posts", label: "Posts", icon: faClipboardList, count: postsCount },
    { key: "saved", label: "Saved", icon: faBookmark, count: savedPosts.length },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      {/* ═══════ HERO ═══════ */}
      <div className="relative">
        {/* Cover */}
        <div className="h-56 sm:h-72 lg:h-80 relative group overflow-hidden">
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setCoverPreview(URL.createObjectURL(file));
              updateCover(file);
            }}
          />
          {coverPreview || p.cover ? (
            <img
              src={coverPreview || p.cover}
              alt="Cover"
              className="absolute inset-0 w-full h-full object-cover cursor-pointer"
              onClick={() => setShowCoverView(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700" />
          )}
          {/* Vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
          
          {/* Cover menu button */}
          {(coverPreview || p.cover) && (
            <button
              onClick={() => setShowCoverMenu(!showCoverMenu)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all z-20"
            >
              <FontAwesomeIcon icon={faEllipsisVertical} className="text-gray-700" />
            </button>
          )}

          {/* Cover dropdown menu */}
          {showCoverMenu && (
            <div className="absolute top-16 right-4 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-30 min-w-[180px]">
              <button
                onClick={() => {
                  setShowCoverView(true);
                  setShowCoverMenu(false);
                }}
                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition"
              >
                <FontAwesomeIcon icon={faExpand} className="text-gray-400 text-xs" />
                View cover
              </button>
              <button
                onClick={() => {
                  coverInputRef.current?.click();
                  setShowCoverMenu(false);
                }}
                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition"
              >
                <FontAwesomeIcon icon={faCamera} className="text-gray-400 text-xs" />
                Change cover
              </button>
              <button
                onClick={removeCover}
                className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition border-t border-gray-100"
              >
                <FontAwesomeIcon icon={faTrashCan} className="text-red-500 text-xs" />
                Remove
              </button>
            </div>
          )}

          {/* Fallback hover overlay when no cover */}
          {!coverPreview && !p.cover && (
            <div
              onClick={() => coverInputRef.current?.click()}
              className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <FontAwesomeIcon icon={faCamera} className="text-white text-xl" />
              <span className="text-white text-sm font-semibold">Add Cover Photo</span>
            </div>
          )}
        </div>

        {/* Profile card overlay */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="relative -mt-20 sm:-mt-24">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 items-center sm:items-start">
                {/* Avatar */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setImagePreview(URL.createObjectURL(file));
                    updatePhoto(file);
                  }}
                />
                <div className="relative shrink-0 -mt-20 sm:-mt-24">
                  <div
                    className="p-1 bg-white rounded-full shadow-lg cursor-pointer group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <img
                      src={imagePreview || p.photo || defaultAvatar}
                      alt="Profile"
                      className="w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover"
                    />
                  </div>
                  <div
                    className="absolute inset-1 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none"
                  >
                    <FontAwesomeIcon icon={faCamera} className="text-white text-xl" />
                  </div>
                  {/* Online dot */}
                  <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-[3px] border-white rounded-full" />
                  
                  {/* Delete button (only show if custom photo exists) */}
                  {(imagePreview || p.photo) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowPhotoMenu(!showPhotoMenu);
                      }}
                      className="absolute top-0 right-0 w-8 h-8 bg-white hover:bg-red-50 rounded-full flex items-center justify-center shadow-lg transition-all border-2 border-white"
                    >
                      <FontAwesomeIcon icon={faTrashCan} className="text-red-500 text-xs" />
                    </button>
                  )}

                  {/* Photo delete confirmation dropdown */}
                  {showPhotoMenu && (
                    <div className="absolute top-10 right-0 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-30 min-w-[160px]">
                      <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                        <p className="text-xs text-gray-600 font-semibold">Remove photo?</p>
                      </div>
                      <button
                        onClick={removePhoto}
                        className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
                      >
                        <FontAwesomeIcon icon={faTrashCan} className="text-xs" />
                        Remove
                      </button>
                      <button
                        onClick={() => setShowPhotoMenu(false)}
                        className="w-full px-4 py-2.5 text-left text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2 transition border-t border-gray-100"
                      >
                        <FontAwesomeIcon icon={faXmark} className="text-xs" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left pt-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                    {p.name}
                  </h1>
                  <p className="text-gray-500 text-sm mt-0.5">
                    @{p.username || p.email?.split("@")[0]}
                  </p>

                  {/* Bio if exists */}
                  {p.bio && (
                    <p className="text-gray-600 text-sm mt-2 max-w-md leading-relaxed">
                      {p.bio}
                    </p>
                  )}

                  {/* Meta row */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-5 gap-y-1.5 mt-3">
                    {p.email && (
                      <span className="flex items-center gap-1.5 text-xs text-gray-500">
                        <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
                        {p.email}
                      </span>
                    )}
                    {joined && (
                      <span className="flex items-center gap-1.5 text-xs text-gray-500">
                        <FontAwesomeIcon icon={faCalendarDays} className="text-gray-400" />
                        Joined {joined}
                      </span>
                    )}
                    {p.location && (
                      <span className="flex items-center gap-1.5 text-xs text-gray-500">
                        <FontAwesomeIcon icon={faLocationDot} className="text-gray-400" />
                        {p.location}
                      </span>
                    )}
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center justify-center sm:justify-start gap-6 mt-4">
                    <div className="text-center">
                      <p className="text-xl font-extrabold text-gray-900">{abbreviate(postsCount)}</p>
                      <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">Posts</p>
                    </div>
                    <div className="w-px h-9 bg-gray-200" />
                    <div className="text-center">
                      <p className="text-xl font-extrabold text-gray-900">{abbreviate(followersCount)}</p>
                      <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">Followers</p>
                    </div>
                    <div className="w-px h-9 bg-gray-200" />
                    <div className="text-center">
                      <p className="text-xl font-extrabold text-gray-900">{abbreviate(followingCount)}</p>
                      <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">Following</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
                  >
                    <FontAwesomeIcon icon={faKey} className="text-xs" />
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ CONTENT ═══════ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ── Left Sidebar ── */}
          <div className="lg:col-span-4 space-y-5">
            {/* About */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 text-sm">About</h3>
              </div>
              <div className="p-5 space-y-3.5">
                {p.email && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                      <FontAwesomeIcon icon={faEnvelope} className="text-blue-500 text-xs" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] text-gray-400 font-medium">Email</p>
                      <p className="text-sm text-gray-700 truncate">{p.email}</p>
                    </div>
                  </div>
                )}
                {p.gender && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-pink-50 rounded-lg flex items-center justify-center shrink-0">
                      <FontAwesomeIcon icon={faUserGroup} className="text-pink-500 text-xs" />
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-400 font-medium">Gender</p>
                      <p className="text-sm text-gray-700 capitalize">{p.gender}</p>
                    </div>
                  </div>
                )}
                {p.dateOfBirth && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
                      <FontAwesomeIcon icon={faCalendarDays} className="text-amber-500 text-xs" />
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-400 font-medium">Birthday</p>
                      <p className="text-sm text-gray-700">
                        {new Date(p.dateOfBirth).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                )}
                {joined && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
                      <FontAwesomeIcon icon={faCalendarDays} className="text-green-500 text-xs" />
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-400 font-medium">Joined</p>
                      <p className="text-sm text-gray-700">{joined}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white shadow-sm">
                <FontAwesomeIcon icon={faImages} className="text-blue-200 text-lg mb-2" />
                <p className="text-2xl font-extrabold">{postsCount}</p>
                <p className="text-blue-200 text-xs font-medium">Total Posts</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 text-white shadow-sm">
                <FontAwesomeIcon icon={faBookmark} className="text-purple-200 text-lg mb-2" />
                <p className="text-2xl font-extrabold">{savedPosts.length}</p>
                <p className="text-purple-200 text-xs font-medium">Saved Posts</p>
              </div>
              <div className="bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl p-4 text-white shadow-sm">
                <FontAwesomeIcon icon={faHeart} className="text-rose-200 text-lg mb-2" />
                <p className="text-2xl font-extrabold">{abbreviate(followersCount)}</p>
                <p className="text-rose-200 text-xs font-medium">Followers</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-4 text-white shadow-sm">
                <FontAwesomeIcon icon={faComment} className="text-emerald-200 text-lg mb-2" />
                <p className="text-2xl font-extrabold">{abbreviate(followingCount)}</p>
                <p className="text-emerald-200 text-xs font-medium">Following</p>
              </div>
            </div>

            {/* Following preview */}
            {p.following && p.following.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 text-sm">Following</h3>
                  <span className="text-xs text-gray-400">{p.following.length}</span>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {p.following.slice(0, 8).map((f) => (
                      <a
                        key={f._id}
                        href={`/user/${f._id}`}
                        className="group relative"
                        title={f.name}
                      >
                        <img
                          src={f.photo || defaultAvatar}
                          alt={f.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-white group-hover:ring-blue-300 transition-all"
                        />
                      </a>
                    ))}
                    {p.following.length > 8 && (
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-500">+{p.following.length - 8}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Right Content ── */}
          <div className="lg:col-span-8">
            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-5 overflow-hidden">
              <div className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-all border-b-2 ${
                      activeTab === tab.key
                        ? "text-blue-600 border-blue-600 bg-blue-50/50"
                        : "text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <FontAwesomeIcon icon={tab.icon} className="text-xs" />
                    {tab.label}
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                        activeTab === tab.key
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Posts / Saved */}
            <div className="space-y-4">
              {activeTab === "posts" ? (
                loadingPosts ? (
                  <>
                    <PostSkeleton />
                    <PostSkeleton />
                  </>
                ) : userPosts.length > 0 ? (
                  userPosts.map((post) => (
                    <PostDetails
                      key={post._id}
                      body={post.body}
                      image={post.image}
                      name={p.name}
                      username={p.username}
                      photo={p.photo}
                      date={post.createdAt}
                      id={post._id}
                      userId={p._id || p.id}
                      likes={post.likes || []}
                      likesCount={post.likesCount ?? (post.likes?.length || 0)}
                      commentsCount={post.commentsCount ?? 0}
                      sharesCount={post.sharesCount ?? 0}
                      topComment={post.topComment || null}
                      isShare={post.isShare || false}
                      sharedPost={post.sharedPost || null}
                      privacy={post.privacy || "public"}
                      isLiked={
                        post.likes?.some(
                          (like) =>
                            (typeof like === "string" ? like : like._id) ===
                            (user?._id || user?.id),
                        ) || false
                      }
                      isBookmarked={post.bookmarked || false}
                    />
                  ))
                ) : (
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-16 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FontAwesomeIcon icon={faClipboardList} className="text-2xl text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">No posts yet</h3>
                    <p className="text-sm text-gray-400">Share something with the world!</p>
                  </div>
                )
              ) : loadingSaved ? (
                <>
                  <PostSkeleton />
                  <PostSkeleton />
                </>
              ) : savedPosts.length > 0 ? (
                savedPosts.map((post) => (
                  <PostDetails
                    key={post._id}
                    body={post.body}
                    image={post.image}
                    name={post.user?.name}
                    username={post.user?.username}
                    photo={post.user?.photo}
                    date={post.createdAt}
                    id={post._id}
                    userId={post.user?._id || post.user?.id}
                    likes={post.likes || []}
                    likesCount={post.likesCount ?? (post.likes?.length || 0)}
                    commentsCount={post.commentsCount ?? 0}
                    sharesCount={post.sharesCount ?? 0}
                    topComment={post.topComment || null}
                    isShare={post.isShare || false}
                    sharedPost={post.sharedPost || null}
                    privacy={post.privacy || "public"}
                    isLiked={
                      post.likes?.some(
                        (like) =>
                          (typeof like === "string" ? like : like._id) ===
                          (user?._id || user?.id),
                      ) || false
                    }
                    isBookmarked={true}
                  />
                ))
              ) : (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-16 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FontAwesomeIcon icon={faBookmark} className="text-2xl text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">No saved posts</h3>
                  <p className="text-sm text-gray-400">Posts you bookmark will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ PASSWORD MODAL ═══════ */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <FontAwesomeIcon icon={faKey} className="text-sm" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Change Password</h2>
                    <p className="text-xs text-gray-400">Create a strong password</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>
            </div>

            <form onSubmit={formik.handleSubmit}>
              <div className="p-6 space-y-4">
                <PasswordField
                  label="Current Password"
                  placeholder="Enter current password"
                  name="password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  show={showCurrentPassword}
                  onToggle={() => setShowCurrentPassword(!showCurrentPassword)}
                  error={formik.touched.password && formik.errors.password}
                />
                <PasswordField
                  label="New Password"
                  placeholder="Enter new password"
                  name="newPassword"
                  onChange={formik.handleChange}
                  value={formik.values.newPassword}
                  show={showNewPassword}
                  onToggle={() => setShowNewPassword(!showNewPassword)}
                  error={formik.touched.newPassword && formik.errors.newPassword}
                />

                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-xs text-blue-800 font-semibold mb-2 flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faShieldHalved} className="text-[10px]" />
                    Password Requirements
                  </p>
                  <ul className="space-y-1 text-xs text-blue-700">
                    <li>&#10003; At least 8 characters</li>
                    <li>&#10003; Uppercase and lowercase letters</li>
                    <li>&#10003; At least one number</li>
                    <li>&#10003; At least one special character</li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-end gap-2 px-6 pb-6">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-5 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-100 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold transition shadow-sm"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════ COVER VIEW MODAL ═══════ */}
      {showCoverView && (coverPreview || p.cover) && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setShowCoverView(false)}
        >
          <button
            onClick={() => setShowCoverView(false)}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all z-10"
          >
            <FontAwesomeIcon icon={faXmark} className="text-white text-xl" />
          </button>

          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={coverPreview || p.cover}
              alt="Cover preview"
              className="w-full h-auto rounded-2xl shadow-2xl"
            />

            {/* Action buttons */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => {
                  coverInputRef.current?.click();
                  setShowCoverView(false);
                }}
                className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-900 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all shadow-lg"
              >
                <FontAwesomeIcon icon={faCamera} className="text-xs" />
                Change Cover
              </button>
              <button
                onClick={removeCover}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-sm flex items-center gap-2 transition-all shadow-lg"
              >
                <FontAwesomeIcon icon={faTrashCan} className="text-xs" />
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Password Field ─────────────────────────────────────────────────────── */

function PasswordField({ label, placeholder, show, onToggle, name, value, onChange, error }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <FontAwesomeIcon
          icon={faLock}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
        />
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full pl-10 pr-10 py-2.5 rounded-xl border ${
            error ? "border-red-300" : "border-gray-200"
          } focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-sm outline-none transition`}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
        >
          <FontAwesomeIcon icon={show ? faEyeSlash : faEye} className="text-sm" />
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
