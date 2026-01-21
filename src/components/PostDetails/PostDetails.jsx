import React, { useContext, useEffect, useState, useRef } from "react";
import user from "../../assets/hero.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faThumbsUp,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
  faComment,
  faShareFromSquare,
  faHeart,
  faThumbsUp as likebtn,
} from "@fortawesome/free-regular-svg-icons";
import CommentCard from "../CommentCard/CommentCard";
import CreateComment from "../comments/CreateComment";
import axios from "axios";
import { AuthContext } from "./../../context/AuthContext";
import { Link, useNavigate } from "react-router";
import { PostsContext } from "../../context/PostProvider";



export default function PostDetails({
  body,
  image,
  name,
  photo,
  date,
  comments,
  commentsLimit,
  id,
  posts,
  onCommentCreated,
  userPhoto,
  userName,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const [commentsUpdated, setCommentsUpdated] = useState(comments);
    const postsContext = useContext(PostsContext);
  const deletePost = postsContext?.deletePost;
  // const [ updateComments , setUpdate ] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <article className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-300/50 transition-all duration-500 ">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-5 bg-linear-to-br from-gray-50/50 to-white">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src={photo}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md"
              alt="User avatar"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></span>
          </div>
          <div className="flex flex-col">
            <h4 className="font-bold text-gray-900 text-base leading-tight">
              {name}
            </h4>
            <Link
              to={`/post/${id}`}
              className="text-xs text-gray-500 mt-0.5 font-medium hover:text-gray-700 transition-colors"
            >
              {new Date(date).toLocaleString()}
            </Link>
          </div>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 "
            aria-label="Post options"
          >
            <FontAwesomeIcon icon={faEllipsisVertical} className="text-lg" />
          </button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Edit Option */}
              <button
                onClick={() => {
                  navigate(`/post/${id}?edit=true`);
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-3 flex items-center gap-3 text-gray-700 hover:bg-blue-50 transition-colors duration-200 border-b border-gray-100"
              >
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                <FontAwesomeIcon icon={faPen} className="text-blue-500" />
                <span className="font-medium text-sm">Edit Post</span>
              </button>

              {/* Delete Option */}
              <button
                onClick={() => {
                  if (deletePost) {
                    deletePost(id);
                  }
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-3 flex items-center gap-3 text-gray-700 hover:bg-red-50 transition-colors duration-200"
              >
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                <FontAwesomeIcon icon={faTrash} className="text-red-500" />
                <span className="font-medium text-sm">Delete Post</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Caption */}
      <div className="px-6 pb-4">
        <p className="text-gray-800 text-[15px] leading-relaxed font-medium">
          {body}
        </p>
      </div>

      {/* Image with linear overlay effect */}
      {image ? (
        <figure className="w-full bg-linear-to-br from-gray-100 to-gray-50 relative group">
          <img
            src={image}
            className="w-full max-h-125 object-cover  transition-transform duration-700"
            alt="Post content"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </figure>
      ) : (
        ""
      )}

      {/* Reactions summary with enhanced styling */}
      <div className="flex justify-between items-center px-6 py-4 bg-linear-to-r from-gray-50/30 to-transparent">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <span className="bg-linear-to-br from-blue-500 to-blue-600 w-6 h-6 rounded-full flex items-center justify-center shadow-lg border-2 border-white transform hover:scale-110 transition-transform cursor-pointer">
              <FontAwesomeIcon
                icon={faThumbsUp}
                className="text-white text-[10px]"
              />
            </span>
            <span className="bg-linear-to-br from-red-500 to-pink-600 w-6 h-6 rounded-full flex items-center justify-center shadow-lg border-2 border-white transform hover:scale-110 transition-transform cursor-pointer">
              <FontAwesomeIcon
                icon={faHeart}
                className="text-white text-[10px]"
              />
            </span>
          </div>
          <button className="text-sm text-gray-700 hover:text-gray-900 hover:underline font-semibold transition-colors">
            100
          </button>
        </div>
        <button className="text-sm text-gray-600 hover:text-gray-900 hover:underline font-semibold transition-colors">
          <span className="space-x-2">{commentsUpdated?.length} comments</span>
        </button>
      </div>

      {/* Action bar with modern linear hover */}
      <div className="border-t border-gray-100">
        <div className="grid grid-cols-3 text-gray-600 text-[15px] font-semibold">
          <button className="relative flex items-center justify-center gap-2.5 py-3.5 hover:bg-linear-to-br hover:from-blue-50 hover:to-transparent transition-all duration-300 group overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <FontAwesomeIcon
              icon={likebtn}
              className="text-lg group-hover:scale-125 group-hover:text-blue-600 transition-all duration-300 relative z-10"
            />
            <span className="group-hover:text-blue-600 relative z-10">
              Like
            </span>
          </button>

          <button className="relative flex items-center justify-center gap-2.5 py-3.5 hover:bg-linear-to-br hover:from-green-50 hover:to-transparent transition-all duration-300 group border-x border-gray-100 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-green-500/0 via-green-500/5 to-green-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <FontAwesomeIcon
              icon={faComment}
              className="text-lg group-hover:scale-125 group-hover:text-green-600 transition-all duration-300 relative z-10"
            />
            <span className="group-hover:text-green-600 relative z-10">
              Comment
            </span>
          </button>

          <button className="relative flex items-center justify-center gap-2.5 py-3.5 hover:bg-linear-to-br hover:from-purple-50 hover:to-transparent transition-all duration-300 group overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <FontAwesomeIcon
              icon={faShareFromSquare}
              className="text-lg group-hover:scale-125 group-hover:text-purple-600 transition-all duration-300 relative z-10"
            />
            <span className="group-hover:text-purple-600 relative z-10">
              Share
            </span>
          </button>
        </div>
      </div>

      {/* Comments section with subtle linear background */}
      <div className="px-6 py-5 space-y-4 bg-linear-to-br from-gray-50/50 via-blue-50/20 to-purple-50/20 border-t border-gray-100">
        {commentsUpdated?.length > 0 ? (
          <>
            {(commentsUpdated || []).slice(0, commentsLimit).map((comment) => (
              <CommentCard
                key={comment._id}
                commentCreatorName={comment.commentCreator.name}
                commentCreatorImg={comment.commentCreator.photo}
                content={comment.content}
                commentId={comment._id}
                date={comment.createdAt}
                setCommentsUpdated={setCommentsUpdated}
              />
            ))}

            {/* Show "View all comments" button if there are more comments than the limit */}
            {commentsUpdated.length > commentsLimit && (
              <Link
                to={`/post/${id}`}
                className="block text-center py-3 mt-2 text-sm font-semibold text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 group"
              >
                <span className="inline-flex items-center gap-2">
                  View all {commentsUpdated.length} comments
                  <FontAwesomeIcon
                    icon={faComment}
                    className="text-xs group-hover:scale-110 transition-transform duration-300"
                  />
                </span>
              </Link>
            )}
          </>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            No comments yet
          </p>
        )}
      </div>

      {/* Create Comment Form */}
      <CreateComment 
        postId={id} 
        onCommentCreated={onCommentCreated}
        userPhoto={userPhoto}
        userName={userName}
        setCommentsUpdated={setCommentsUpdated}
        comments={comments}

        
      />
    </article>
  );
}
