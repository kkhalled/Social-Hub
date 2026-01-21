import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import  * as Yup  from 'yup';
import axios from "axios";
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
                url: `https://linked-posts.routemisr.com/comments/${commentId}`,
                method: "POST",
                headers: { token },
                data: { 
                    content: values.content,
                    post: postId
                },
            };
            const {data} = await axios(options);
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
