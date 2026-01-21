 async function getUserInfo() {
    try {
      const { data } = await axios.get(
        "https://linked-posts.routemisr.com/users/profile-data",
        { headers: { token } },
      );

      if (data.message === "success") {
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user)
      }
    } catch (error) {
      console.error(error);
    }
    
  }