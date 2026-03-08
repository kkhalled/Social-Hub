import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faUserPlus,
  faCheck,
  faUserMinus,
  faEnvelope,
  faVenusMars,
  faCakeCandles,
  faCalendarDays,
  faUsers,
  faClipboardList,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import NavBar from "../../components/NavBar/NavBar";
import PostDetails from "../../components/PostDetails/PostDetails";
import { getUserProfile, toggleFollowUser } from "../../api/usersApi";
import { getUserPosts } from "../../api/postsApi";
import PostSkeleton from "../../components/PostSkeleton/PostSkeleton";
import defaultAvatar from "../../assets/user.png";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";

function StatBox({ label, value }) {
  return (
    <div className="text-center px-5 py-3">
      <p className="text-xl font-bold text-gray-900">{value ?? 0}</p>
      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">{label}</p>
    </div>
  );
}

function AboutRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 text-sm text-gray-600">
      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
        <FontAwesomeIcon icon={icon} className="text-blue-500 text-xs" />
      </div>
      <div>
        <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">{label}</p>
        <p className="text-sm text-gray-800">{value}</p>
      </div>
    </div>
  );
}

export default function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setLoadingPosts(true);
    setUserProfile(null);
    setUserPosts([]);
    loadUserProfile();
    loadUserPosts();
  }, [userId]);

  async function loadUserProfile() {
    try {
      const response = await getUserProfile(userId);
      if (response.message === "success" || response.success === true) {
        const fetchedUser = response.data?.user || response.user;
        setUserProfile(fetchedUser);
        // isFollowing is at response.data.isFollowing, not inside user object
        setIsFollowing(response.data?.isFollowing ?? false);
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadUserPosts() {
    try {
      const response = await getUserPosts(userId, 1, 50);
      if (response.message === "success" || response.success === true) {
        setUserPosts(response.data?.posts || []);
      }
    } catch (error) {
      console.error("Error loading user posts:", error);
    } finally {
      setLoadingPosts(false);
    }
  }

  async function handleFollowToggle() {
    try {
      setFollowLoading(true);
      const response = await toggleFollowUser(userId);
      if (response.message === "success" || response.success === true) {
        const nowFollowing = !isFollowing;
        setIsFollowing(nowFollowing);
        toast.success(nowFollowing ? "Following!" : "Unfollowed");
        // update local follower count
        setUserProfile((prev) => prev ? {
          ...prev,
          followersCount: (prev.followersCount ?? 0) + (nowFollowing ? 1 : -1),
        } : prev);
      }
    } catch (error) {
      toast.error("Failed to update follow status");
    } finally {
      setFollowLoading(false);
    }
  }

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-5xl mx-auto px-4 pt-4">
          <div className="animate-pulse">
            <div className="h-52 bg-gray-200 rounded-xl mb-0" />
            <div className="bg-white rounded-b-xl px-8 pb-6 border border-gray-200 border-t-0">
              <div className="flex items-end gap-4 -mt-12 mb-4">
                <div className="w-28 h-28 rounded-full bg-gray-300 border-4 border-white shrink-0" />
                <div className="flex-1 pb-2 space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-36" />
                  <div className="h-3.5 bg-gray-200 rounded w-24" />
                </div>
              </div>
              <div className="flex gap-6 mt-2">
                {[1,2,3].map(i => <div key={i} className="h-10 bg-gray-100 rounded-lg flex-1" />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-4xl mx-auto px-4 pt-24 text-center">
          <p className="text-3xl mb-2">👤</p>
          <h2 className="text-xl font-bold text-gray-800 mb-1">User not found</h2>
          <p className="text-gray-500 text-sm mb-6">This profile doesn't exist or was removed.</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const p = userProfile;
  const isOwnProfile = currentUser && (userId === currentUser._id || userId === currentUser.id);
  const displayName = p.username || p.email?.split("@")[0];

  const formatDate = (str) => {
    if (!str) return null;
    return new Date(str).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  const coverStyle = p.cover
    ? { backgroundImage: `url(${p.cover})`, backgroundSize: "cover", backgroundPosition: "center" }
    : {};

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-5xl mx-auto px-4 pt-4 pb-10">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium mb-3 bg-white px-4 py-2 rounded-xl border border-gray-200 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
          Back
        </button>

        {/* Cover + Profile header card */}
        <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200">
          {/* Cover */}
          <div
            className="h-52 sm:h-60 relative"
            style={p.cover ? coverStyle : {}}
          >
            {!p.cover && (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>

          {/* White card below cover */}
          <div className="bg-white px-6 sm:px-10 pb-6">
            {/* Avatar row */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-14 sm:-mt-12">
              {/* Avatar + name */}
              <div className="flex items-end gap-4">
                <div className="relative shrink-0">
                  <img
                    src={p.photo || defaultAvatar}
                    alt={p.name}
                    onError={(e) => { e.target.src = defaultAvatar; }}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-xl"
                  />
                  {/* Online dot or gender badge */}
                </div>
                <div className="pb-1">
                  <h1 className="text-2xl font-bold text-gray-900 leading-tight">{p.name}</h1>
                  <p className="text-gray-500 text-sm">@{displayName}</p>
                </div>
              </div>

              {/* Follow / Own profile actions */}
              {!isOwnProfile ? (
                <div className="flex items-center gap-2 sm:pb-1">
                  <button
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 shadow-sm ${
                      isFollowing
                        ? "bg-white text-gray-700 border border-gray-300 hover:border-red-300 hover:text-red-600"
                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200"
                    }`}
                  >
                    <FontAwesomeIcon icon={isFollowing ? faUserMinus : faUserPlus} className="text-xs" />
                    {followLoading ? "..." : isFollowing ? "Unfollow" : "Follow"}
                  </button>
                </div>
              ) : (
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors sm:pb-1 shadow-sm"
                >
                  Edit Profile
                </Link>
              )}
            </div>

            {/* Stats row */}
            <div className="mt-5 flex items-center divide-x divide-gray-100 border border-gray-100 rounded-xl overflow-hidden bg-gray-50">
              <StatBox label="Posts" value={userPosts.length} />
              <StatBox label="Followers" value={p.followersCount} />
              <StatBox label="Following" value={p.followingCount} />
            </div>
          </div>
        </div>

        {/* Content grid */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left — About */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faUsers} className="text-blue-500 text-sm" />
                About
              </h3>
              <div className="space-y-4">
                <AboutRow icon={faEnvelope} label="Email" value={p.email} />
                <AboutRow icon={faVenusMars} label="Gender" value={p.gender ? p.gender.charAt(0).toUpperCase() + p.gender.slice(1) : null} />
                <AboutRow icon={faCakeCandles} label="Birthday" value={formatDate(p.dateOfBirth)} />
                <AboutRow icon={faCalendarDays} label="Joined" value={formatDate(p.createdAt)} />
              </div>
            </div>

            {/* Following list preview */}
            {Array.isArray(p.following) && p.following.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faUserGroup} className="text-blue-500 text-sm" />
                  Following
                  <span className="ml-auto text-xs text-gray-400">{p.followingCount}</span>
                </h3>
                <div className="space-y-2.5">
                  {p.following.slice(0, 5).map((f) => (
                    <Link
                      key={f._id}
                      to={`/user/${f._id}`}
                      className="flex items-center gap-2.5 group"
                    >
                      <img
                        src={f.photo || defaultAvatar}
                        alt={f.name}
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors truncate">
                        {f.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — Posts */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 px-1">
              <FontAwesomeIcon icon={faClipboardList} className="text-blue-500 text-sm" />
              <h3 className="font-semibold text-gray-900">
                {isOwnProfile ? "My Posts" : `${p.name}'s Posts`}
              </h3>
              {!loadingPosts && (
                <span className="ml-auto text-xs text-gray-400">{userPosts.length} post{userPosts.length !== 1 ? "s" : ""}</span>
              )}
            </div>

            {loadingPosts ? (
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
                  userId={userId}
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
                        (currentUser?._id || currentUser?.id)
                    ) || false
                  }
                  isBookmarked={post.bookmarked || false}
                />
              ))
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-14 text-center shadow-sm">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-gray-500 font-medium">No posts yet</p>
                <p className="text-gray-400 text-sm mt-1">
                  {isOwnProfile ? "Share something with your network!" : "This user hasn't posted anything yet."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
