import axiosInstance from "../api/axiosInstance";

async function getUserInfo() {
    try {
      const { data } = await axiosInstance.get(
        "/users/profile-data"
      );

      if (data.message === "success") {
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user)
      }
    } catch (error) {
      console.error(error);
    }
    
  }