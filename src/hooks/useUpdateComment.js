import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import  * as Yup  from 'yup';
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { useFormik } from "formik";


export function useUpdateComment(commentId, updatedContent) {
  const { token } = useContext(AuthContext);


      const validationSchema = Yup.object({
        content: Yup.string()
            .min(1, "Comment cannot be empty")
            .max(500, "Comment is too long")
            .required("Comment cannot be empty"),
    });

    async function handleSubmit(values) {
        try {
            const options = {
                url: `/comments/${commentId}`,
                method: "POST",
                data: { 
                    content: values.content,
                    post: postId
                },
            };
            const {data} = await axiosInstance(options);
            console.log("Comment created successfully:", data);
            if (data.message === "success") {
                setCommentsUpdated(data.comments);
                toast.success("Comment added successfully");
                formik.resetForm();
                
            }
        } catch (error) {
            console.log("Error creating comment:", error);
            toast.error("Failed to add comment");
        }
    }

    const formik = useFormik({
        initialValues: {
            content: "",
        },
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });
  

 return {formik  }
}
