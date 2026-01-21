// import { Children, createContext, useContext, useState } from "react";
// import { AuthContext } from "./AuthContext";
// import axios from "axios";

// export const UserContext = createContext(null);

// export default function UserProvider() {
//   const { token } = useContext(AuthContext);

//    const [user , setUser] = useState();
//   async function getUserInfo() {
//     try {
//       const options = {
//         url: `https://linked-posts.routemisr.com/users/profile-data`,
//         method: "GET",
//         headers: { token },
//       };
//       const { data } = await axios(options);
//       console.log("user info ",data);

//       if(data.message==="success"){

//         setUser(data.user)

//       }
      
//     } catch (error) {}
//   }

//   return (
//     <>
//       <UserContext.Provider value={user}>{Children}</UserContext.Provider>
//     </>
//   );
// }
