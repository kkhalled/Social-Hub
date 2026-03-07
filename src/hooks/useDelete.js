import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";

export function useDelete() {

  const { token } = useContext(AuthContext);
  async function deletePost(id) {
    try {
      const options = {
        url: `/posts/${id}`,
        method: "DELETE",
      };
        const { data } = await axiosInstance.request(options);
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
