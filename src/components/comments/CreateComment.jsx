import React, { useContext } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/AuthContext";
import { PostsContext } from "../../context/PostProvider";
import { useFormik } from "formik";
import * as Yup from "yup";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

import defaultAvatar from "../../assets/user.png";



export default function CreateComment({ postId, setCommentsUpdated, onCommentCreated, userPhoto, userName }) {
  
 const { token ,user } = useContext(AuthContext);
    const postsContext = useContext(PostsContext);
    const updatePostComments = postsContext?.updatePostComments;
   
    const validationSchema = Yup.object({
        content: Yup.string()
            .min(1, "Comment cannot be empty")
            .max(500, "Comment is too long")
            .required("Comment cannot be empty"),
    });

    async function handleSubmit(values) {
        try {
            const {data} = await axiosInstance.post(`/posts/${postId}/comments`, { 
                content: values.content
            });
            console.log("Comment created successfully:", data);
            
            if (data.success === true || data.message === "success") {
                // Handle different response structures
                const newComment = data.data?.comment || data.comment;
                const allComments = data.data?.comments || data.comments;
                
                if (allComments) {
                    setCommentsUpdated(allComments);
                }
                
                toast.success(data.message || "Comment added successfully");
                formik.resetForm();

                // Update feed if PostsContext is available
                if (updatePostComments && newComment) {
                    updatePostComments(postId, newComment);
                }
                
                // Call callback for Post page update
                if (onCommentCreated && newComment) {
                    onCommentCreated(newComment);
                }
            }
        } catch (error) {
            console.error("Error creating comment:", error);
            toast.error(error.response?.data?.message || "Failed to add comment");
        }
    }

    const formik = useFormik({
        initialValues: {
            content: "",
        },
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });
    return (
        <div className="px-6 py-4 border-t border-gray-100 bg-white">
            <form onSubmit={formik.handleSubmit}>
                <div className="flex gap-3">
                    <img
                        src={user.photo || defaultAvatar}
                        alt={userName || "User"}
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                    <div className="flex-1 flex gap-2">
                        <textarea
                            value={formik.values.content}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            name="content"
                            rows={2}
                            placeholder="Write a comment..."
                            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl
                                focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10
                                resize-none outline-none text-sm placeholder:text-gray-400"
                        />
                        <button
                            type="submit"
                            disabled={!formik.values.content.trim()}
                            className={`flex items-center justify-center w-10 h-10 rounded-xl font-semibold text-white
                                transition shrink-0 ${
                                formik.values.content.trim()
                                    ? "bg-blue-600 hover:bg-blue-700 active:scale-95"
                                    : "bg-gray-300 cursor-not-allowed"
                            }`}
                        >
                            <FontAwesomeIcon icon={faPaperPlane} className="text-sm" />
                        </button>
                    </div>
                </div>
                {formik.errors.content && (
                    <span className="text-red-500 text-xs mt-1 ml-14 block">
                        {formik.errors.content}
                    </span>
                )}
            </form>


            
        </div>
    );
}
