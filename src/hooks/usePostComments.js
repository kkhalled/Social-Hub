import axios from "axios";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

export  function usePostComments() {
  const token = useContext(AuthContext);

  async function getPost(postId) {
    try {
      const options = {
        url: `https://linked-posts.routemisr.com/${postId}/comments`,
        method: "GET",
        headers: { token },
      };
      const { data } = await axios.request(options);
      if (data.message === "success") {
        console.log("hook data",data);
      }
    } catch (error) {
      console.log("hook erorr y3m",error);
    }
  }

  return { getPost };
}
