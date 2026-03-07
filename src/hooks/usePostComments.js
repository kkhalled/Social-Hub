import axiosInstance from "../api/axiosInstance";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

export  function usePostComments() {
  const token = useContext(AuthContext);

  async function getPost(postId) {
    try {
      const options = {
        url: `/posts/${postId}/comments`,
        method: "GET",
      };
      const { data } = await axiosInstance.request(options);
      if (data.message === "success") {
        console.log("hook data",data);
      }
    } catch (error) {
      console.log("hook erorr y3m",error);
    }
  }

  return { getPost };
}
