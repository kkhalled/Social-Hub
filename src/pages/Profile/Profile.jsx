import { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList, faBookmark } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/AuthContext";
import usePassword from "../../hooks/usePassword";
import { useProfileData } from "../../hooks/useProfileData";
import { useProfilePhotos } from "../../hooks/useProfilePhotos";
import { formatJoined } from "../../utils/formatters";
import NavBar from "../../components/NavBar/NavBar";
import CoverSection from "../../components/profile/CoverSection";
import ProfileCard from "../../components/profile/ProfileCard";
import AboutSection from "../../components/profile/AboutSection";
import QuickStatsCards from "../../components/profile/QuickStatsCards";
import FollowersPreview from "../../components/profile/FollowersPreview";
import FollowingPreview from "../../components/profile/FollowingPreview";
import ProfileTabs from "../../components/profile/ProfileTabs";
import PostsGrid from "../../components/profile/PostsGrid";
import PasswordModal from "../../components/profile/PasswordModal";
import CoverViewModal from "../../components/profile/CoverViewModal";

/**
 * Profile Component
 * User profile page with posts, bookmarks, and account management
 */
export default function Profile() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("posts");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showCoverMenu, setShowCoverMenu] = useState(false);
  const [showCoverView, setShowCoverView] = useState(false);
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);

  // Custom hooks
  const { formik } = usePassword({ setShowPasswordModal });
  const {
    profileData,
    userPosts,
    savedPosts,
    loadingProfile,
    loadingPosts,
    loadingSaved,
    setProfileData,
  } = useProfileData();

  const {
    fileInputRef,
    coverInputRef,
    imagePreview,
    coverPreview,
    setImagePreview,
    setCoverPreview,
    updatePhoto,
    updateCover,
    removePhoto,
    removeCover,
  } = useProfilePhotos(setProfileData);

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

      {/* Cover & Profile Card */}
      <div className="relative">
        <CoverSection
          cover={p.cover}
          coverPreview={coverPreview}
          coverInputRef={coverInputRef}
          onCoverChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setCoverPreview(URL.createObjectURL(file));
            updateCover(file);
          }}
          onViewCover={() => setShowCoverView(true)}
          showCoverMenu={showCoverMenu}
          setShowCoverMenu={setShowCoverMenu}
          onRemoveCover={() => {
            removeCover(() => {
              setShowCoverMenu(false);
              setShowCoverView(false);
            });
          }}
        />

        <ProfileCard
          profile={p}
          imagePreview={imagePreview}
          fileInputRef={fileInputRef}
          onPhotoChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setImagePreview(URL.createObjectURL(file));
            updatePhoto(file);
          }}
          showPhotoMenu={showPhotoMenu}
          setShowPhotoMenu={setShowPhotoMenu}
          onRemovePhoto={() => removePhoto(() => setShowPhotoMenu(false))}
          joined={joined}
          postsCount={postsCount}
          followersCount={followersCount}
          followingCount={followingCount}
          onChangePassword={() => setShowPasswordModal(true)}
        />
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-4 space-y-5">
            <AboutSection profile={p} joined={joined} />
            <QuickStatsCards
              postsCount={postsCount}
              savedCount={savedPosts.length}
              followersCount={followersCount}
              followingCount={followingCount}
            />
            <FollowersPreview followers={p.followers} />
            <FollowingPreview following={p.following} />
          </div>

          {/* Right Content */}
          <div className="lg:col-span-8">
            <ProfileTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="space-y-4">
              <PostsGrid
                activeTab={activeTab}
                userPosts={userPosts}
                savedPosts={savedPosts}
                loadingPosts={loadingPosts}
                loadingSaved={loadingSaved}
                user={user}
                profile={p}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PasswordModal
        show={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        formik={formik}
        showCurrentPassword={showCurrentPassword}
        showNewPassword={showNewPassword}
        onToggleCurrentPassword={() => setShowCurrentPassword(!showCurrentPassword)}
        onToggleNewPassword={() => setShowNewPassword(!showNewPassword)}
      />

      <CoverViewModal
        show={showCoverView}
        cover={p.cover}
        coverPreview={coverPreview}
        onClose={() => setShowCoverView(false)}
        onChangeCover={() => {
          coverInputRef.current?.click();
          setShowCoverView(false);
        }}
        onRemoveCover={() => removeCover(() => setShowCoverView(false))}
      />
    </div>
  );
}
