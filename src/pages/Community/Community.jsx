import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faSearch,
  faUserPlus,
  faCheck,
  faSpinner,
  faUserGroup,
  faArrowTrendUp,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import NavBar from "../../components/NavBar/NavBar";
import { getFollowSuggestions, toggleFollowUser } from "../../api/usersApi";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

import userPhoto from "../../assets/user.png";

function CommunityCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
      <div className="h-20 bg-gray-200" />
      <div className="px-4 pb-5 -mt-8 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-gray-300 border-4 border-white" />
        <div className="h-4 bg-gray-200 rounded w-24 mt-3" />
        <div className="h-3 bg-gray-100 rounded w-16 mt-2" />
        <div className="h-8 bg-gray-200 rounded-lg w-full mt-4" />
      </div>
    </div>
  );
}

export default function Community() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followingState, setFollowingState] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchPeople() {
      try {
        const response = await getFollowSuggestions(50);
        const list =
          response.data?.users ||
          response.users ||
          response.data?.suggestions ||
          response.suggestions ||
          [];
        setPeople(list);
      } catch {
        toast.error("Failed to load community");
      } finally {
        setLoading(false);
      }
    }
    fetchPeople();
  }, []);

  async function handleFollow(userId) {
    setFollowingState((prev) => ({ ...prev, [userId]: "loading" }));
    try {
      await toggleFollowUser(userId);
      setFollowingState((prev) => ({ ...prev, [userId]: "followed" }));
      toast.success("Following!");
    } catch {
      setFollowingState((prev) => ({ ...prev, [userId]: null }));
      toast.error("Failed to follow");
    }
  }

  const filtered = people.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.username?.toLowerCase().includes(q)
    );
  });

  const followedCount = Object.values(followingState).filter((v) => v === "followed").length;

  const COLORS = [
    "from-blue-400 to-blue-600",
    "from-purple-400 to-purple-600",
    "from-pink-400 to-pink-600",
    "from-emerald-400 to-emerald-600",
    "from-amber-400 to-orange-500",
    "from-cyan-400 to-teal-500",
    "from-rose-400 to-red-500",
    "from-indigo-400 to-indigo-600",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div className="flex items-start gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-all shadow-sm shrink-0 mt-1"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-sm" />
            </button>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200/50">
                  <FontAwesomeIcon icon={faUsers} className="text-white text-lg" />
                </div>
                Community
              </h1>
              <p className="text-gray-400 mt-1.5 text-sm">
                Discover people, grow your network
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-80">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search people..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition shadow-sm"
            />
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faUserGroup} className="text-blue-600" />
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Suggestions</p>
              <p className="text-xl font-extrabold text-gray-900">{people.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faCheck} className="text-green-600" />
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Followed</p>
              <p className="text-xl font-extrabold text-gray-900">{followedCount}</p>
            </div>
          </div>
          <div className="hidden sm:flex bg-white rounded-2xl border border-gray-200 p-4 items-center gap-3 shadow-sm">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faArrowTrendUp} className="text-purple-600" />
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Showing</p>
              <p className="text-xl font-extrabold text-gray-900">{filtered.length}</p>
            </div>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <CommunityCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center mb-5">
              <FontAwesomeIcon icon={faUsers} className="text-3xl text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1.5">
              {searchQuery ? "No matches found" : "No suggestions"}
            </h3>
            <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
              {searchQuery
                ? "Try a different search term."
                : "Check back later for new people to connect with."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((p, idx) => {
              const state = followingState[p._id];
              const isFollowed = state === "followed";
              const isLoading = state === "loading";
              const color = COLORS[idx % COLORS.length];

              return (
                <div
                  key={p._id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group shadow-sm"
                >
                  {/* Color banner */}
                  <div className={`h-20 bg-gradient-to-br ${color} relative`}>
                    <div className="absolute inset-0 bg-black/5" />
                  </div>

                  {/* Content */}
                  <div className="px-4 pb-5 -mt-8 flex flex-col items-center relative z-10">
                    <Link to={`/user/${p._id}`}>
                      <img
                        src={p.photo || userPhoto}
                        alt={p.name}
                        onError={(e) => { e.target.src = userPhoto; }}
                        className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md group-hover:scale-105 transition-transform"
                      />
                    </Link>

                    <Link
                      to={`/user/${p._id}`}
                      className="mt-2.5 text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors text-center truncate max-w-full"
                    >
                      {p.name}
                    </Link>

                    <p className="text-xs text-gray-400 truncate max-w-full">
                      @{p.username || p.name?.toLowerCase().replace(/\s+/g, "")}
                    </p>

                    {(p.followersCount > 0 || p.followers?.length > 0) && (
                      <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                        <FontAwesomeIcon icon={faUserGroup} className="text-[9px]" />
                        {p.followersCount ?? p.followers?.length} followers
                      </p>
                    )}

                    {p.mutualFollowersCount > 0 && (
                      <p className="text-[10px] text-blue-500 font-medium mt-0.5">
                        {p.mutualFollowersCount} mutual
                      </p>
                    )}

                    {/* Follow btn */}
                    <button
                      onClick={() => handleFollow(p._id)}
                      disabled={isFollowed || isLoading}
                      className={`mt-3 w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isFollowed
                          ? "bg-gray-100 text-gray-500 cursor-default"
                          : isLoading
                            ? "bg-blue-50 text-blue-400 cursor-wait"
                            : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md active:scale-95"
                      }`}
                    >
                      {isFollowed ? (
                        <>
                          <FontAwesomeIcon icon={faCheck} className="mr-1" />
                          Following
                        </>
                      ) : isLoading ? (
                        <FontAwesomeIcon icon={faSpinner} spin />
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faUserPlus} className="mr-1" />
                          Follow
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
