// import { useQuery } from "@tanstack/react-query";
// import { getAuthUser } from "../lib/api.js";

// const useAuthUser = () => {
//   const authUser = useQuery({
//     queryKey: ["authUser"],
//     queryFn: getAuthUser,
//     retry: false, // auth check
//   });

//   return { isLoading: authUser.isLoading, authUser: authUser.data?.user };
// };
// export default useAuthUser;

import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../lib/api.js";

const useAuthUser = () => {
  const authUserQuery = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false,
  });

  // expose raw query so you can check shape in console
  return {
    isLoading: authUserQuery.isLoading,
    authUser: authUserQuery.data?.user,
    raw: authUserQuery.data, // useful for debugging { success: true, user: {...} }
  };
};

export default useAuthUser;
