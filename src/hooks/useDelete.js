import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

export function useDelete() {

  const { token } = useContext(AuthContext);
  async function deletePost(id) {
    try {
      const options = {
        url: `https://linked-posts.routemisr.com/posts/${id}`,
        method: "DELETE",
        headers: { token },
      };
        const { data } = await axios.request(options);
        console.log(data);
        if (data.message === "success") {
          console.log("Post deleted successfully");
          toast.success("Post deleted successfully");
        }
    } catch (error) {
        console.log(error);
    }
  }
    return { deletePost };
}
