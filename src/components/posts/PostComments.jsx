import React, { useContext } from "react";
import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import CommentCard from "../comments/CommentCard";
import CreateComment from "../comments/CreateComment";
import defaultAvatar from "../../assets/user.png";
import { AuthContext } from "../../context/AuthContext";

/**
 * PostComments Component
 * Displays comments in collapsed (top comment) or expanded (all comments) view
 */
export default function PostComments({
  postId,
  commentsExpanded,
  topCommentState,
  commentsCount,
  fullComments,
  loadingComments,
  onExpandComments,
  onCommentCreated,
  updateComments,
}) {
  const { user } = useContext(AuthContext);

  // Collapsed view - show only top comment
  if (!commentsExpanded && topCommentState && commentsCount > 0) {
    return (
      <div className="border-t border-gray-100 px-5 pt-3 pb-3">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Top Comment
            </span>
            <span className="bg-blue-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {commentsCount}
            </span>
          </div>
          <button
            onClick={onExpandComments}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
          >
            View all
          </button>
        </div>
        
        <div className="flex gap-2.5 items-start">
          <img
            src={topCommentState.commentCreator?.photo || defaultAvatar}
            alt={topCommentState.commentCreator?.name}
            onError={(e) => {
              e.target.src = defaultAvatar;
            }}
            className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-gray-100"
          />
          <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-3.5 py-2.5 max-w-[85%] border border-gray-100">
            <span className="text-xs font-bold text-gray-900 mr-1.5">
              {topCommentState.commentCreator?.name}
            </span>
            <span className="text-[13px] text-gray-600 leading-relaxed">
              {topCommentState.content}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Expanded view - show all comments
  if (commentsExpanded) {
    return (
      <div className="border-t border-gray-100">
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-800">Comments</span>
            <span className="bg-blue-600 text-white text-[11px] font-bold rounded-full min-w-[22px] h-[22px] px-1.5 flex items-center justify-center">
              {commentsCount}
            </span>
          </div>
          <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 font-medium transition-colors">
            Most relevant
            <FontAwesomeIcon icon={faChevronDown} className="text-[9px]" />
          </button>
        </div>

        <div className="px-5 space-y-3 pb-3">
          {loadingComments ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse flex gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-24" />
                    <div className="h-3 bg-gray-100 rounded w-48" />
                  </div>
                </div>
              ))}
            </div>
          ) : fullComments.length > 0 ? (
            <>
              {fullComments.map((comment) => (
                <CommentCard
                  key={comment._id}
                  commentCreatorName={comment.commentCreator?.name || "User"}
                  commentCreatorImg={comment.commentCreator?.photo || ""}
                  commentCreatorId={
                    comment.commentCreator?._id || comment.commentCreator?.id || ""
                  }
                  content={comment.content}
                  commentId={comment._id}
                  postId={postId}
                  date={comment.createdAt}
                  setCommentsUpdated={(updater) => {
                    updateComments((prev) => {
                      const next =
                        typeof updater === "function" ? updater(prev) : updater;
                      return next;
                    });
                  }}
                  likes={comment.likes || []}
                  replies={comment.replies || []}
                  repliesCount={
                    comment.repliesCount ?? comment.replies?.length ?? 0
                  }
                  isLiked={
                    comment.likes?.some((like) =>
                      (typeof like === "string" ? like : like._id) ===
                      (user?._id || user?.id)
                    ) || false
                  }
                />
              ))}
              {commentsCount > fullComments.length && (
                <Link
                  to={`/post/${postId}`}
                  className="block text-sm font-semibold text-blue-600 hover:underline pt-1"
                >
                  View all {commentsCount} comments
                </Link>
              )}
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-gray-400">
                No comments yet. Be the first!
              </p>
            </div>
          )}
        </div>

        <CreateComment
          postId={postId}
          onCommentCreated={onCommentCreated}
          setCommentsUpdated={updateComments}
        />
      </div>
    );
  }

  return null;
}
