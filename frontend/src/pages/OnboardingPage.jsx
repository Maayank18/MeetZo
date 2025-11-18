// import { useState } from "react";
// import useAuthUser from "../hooks/useAuthUser";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import toast from "react-hot-toast";
// import { completeOnboarding } from "../lib/api";
// import { LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon } from "lucide-react";
// import { LANGUAGES } from "../constants";

// const OnboardingPage = () => {
//   const { authUser } = useAuthUser();
//   const queryClient = useQueryClient();

//   const [formState, setFormState] = useState({
//     fullname: authUser?.fullname || "",
//     bio: authUser?.bio || "",
//     nativeLanguage: authUser?.nativeLanguage || "",
//     learningLanguage: authUser?.learningLanguage || "",
//     location: authUser?.location || "",
//     profilePic: authUser?.profilePic || "",
//   });

//   const { mutate: onboardingMutation, isPending } = useMutation({
//     mutationFn: completeOnboarding,
//     onSuccess: () => {
//       toast.success("Profile onboarded successfully");
//       queryClient.invalidateQueries({ queryKey: ["authUser"] });
//     },

//     onError: (error) => {
//       toast.error(error.response.data.message);
//     },
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     onboardingMutation(formState);
//   };

//   const handleRandomAvatar = () => {
//     const idx = Math.floor(Math.random() * 100) + 1; // 1-100 included
//     const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

//     setFormState({ ...formState, profilePic: randomAvatar });
//     toast.success("Random profile picture generated!");
//   };

//   return (
//     <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
//       <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
//         <div className="card-body p-6 sm:p-8">
//           <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Complete Your Profile</h1>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* PROFILE PIC CONTAINER */}
//             <div className="flex flex-col items-center justify-center space-y-4">
//               {/* IMAGE PREVIEW */}
//               <div className="size-32 rounded-full bg-base-300 overflow-hidden">
//                 {formState.profilePic ? (
//                   <img
//                     src={formState.profilePic}
//                     alt="Profile Preview"
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <div className="flex items-center justify-center h-full">
//                     <CameraIcon className="size-12 text-base-content opacity-40" />
//                   </div>
//                 )}
//               </div>

//               {/* Generate Random Avatar BTN */}
//               <div className="flex items-center gap-2">
//                 <button type="button" onClick={handleRandomAvatar} className="btn btn-accent">
//                   <ShuffleIcon className="size-4 mr-2" />
//                   Generate Random Avatar
//                 </button>
//               </div>
//             </div>

//             {/* FULL NAME */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Full Name</span>
//               </label>
//               <input
//                 type="text"
//                 name="fullname"
//                 value={formState.fullname}
//                 onChange={(e) => setFormState({ ...formState, fullname: e.target.value })}
//                 className="input input-bordered w-full"
//                 placeholder="Your full name"
//               />
//             </div>

//             {/* BIO */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Bio</span>
//               </label>
//               <textarea
//                 name="bio"
//                 value={formState.bio}
//                 onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
//                 className="textarea textarea-bordered h-24"
//                 placeholder="Tell others about yourself and your language learning goals"
//               />
//             </div>

//             {/* LANGUAGES */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* NATIVE LANGUAGE */}
//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text">Native Language</span>
//                 </label>
//                 <select
//                   name="nativeLanguage"
//                   value={formState.nativeLanguage}
//                   onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
//                   className="select select-bordered w-full"
//                 >
//                   <option value="">Select your native language</option>
//                   {LANGUAGES.map((lang) => (
//                     <option key={`native-${lang}`} value={lang.toLowerCase()}>
//                       {lang}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* LEARNING LANGUAGE */}
//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text">Learning Language</span>
//                 </label>
//                 <select
//                   name="learningLanguage"
//                   value={formState.learningLanguage}
//                   onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value })}
//                   className="select select-bordered w-full"
//                 >
//                   <option value="">Select language you're learning</option>
//                   {LANGUAGES.map((lang) => (
//                     <option key={`learning-${lang}`} value={lang.toLowerCase()}>
//                       {lang}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* LOCATION */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Location</span>
//               </label>
//               <div className="relative">
//                 <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
//                 <input
//                   type="text"
//                   name="location"
//                   value={formState.location}
//                   onChange={(e) => setFormState({ ...formState, location: e.target.value })}
//                   className="input input-bordered w-full pl-10"
//                   placeholder="City, Country"
//                 />
//               </div>
//             </div>

//             {/* SUBMIT BUTTON */}

//             <button className="btn btn-primary w-full" disabled={isPending} type="submit">
//               {!isPending ? (
//                 <>
//                   <ShipWheelIcon className="size-5 mr-2" />
//                   Complete Onboarding
//                 </>
//               ) : (
//                 <>
//                   <LoaderIcon className="animate-spin size-5 mr-2" />
//                   Onboarding...
//                 </>
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default OnboardingPage;

import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import {
  LoaderIcon,
  MapPinIcon,
  ShipWheelIcon,
  ShuffleIcon,
  CameraIcon,
} from "lucide-react";
import { LANGUAGES } from "../constants";
import { useNavigate } from "react-router-dom";

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    fullname: authUser?.fullname || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  // const { mutate: onboardingMutation, isLoading } = useMutation({
  //   mutationFn: completeOnboarding,

  //   onSuccess: (data) => {
  //     toast.success("Profile onboarded successfully!");

  //     // ✨ Immediately update cached user (so routing detects onboarding instantly)
  //     queryClient.setQueryData(["authUser"], data);

  //     // ✨ Navigate to homepage
  //     navigate("/");
  //   },

  //   onError: (error) => {
  //     toast.error(error?.response?.data?.message || "Something went wrong");
  //   },
  // });
  const { mutate: onboardingMutation, isLoading } = useMutation({
    mutationFn: completeOnboarding,
  
    onSuccess: (data) => {
      // Debug what's actually returned
      console.log("DATA RETURNED FROM ONBOARD:", data);
  
      toast.success("Profile onboarded successfully!");
  
      // If server returned { success: true, user: {...} } great.
      // But if it returned `user` directly, normalize it:
      const normalized = data?.user ? data : { success: true, user: data };
  
      // Update cache with correct shape expected by useAuthUser
      queryClient.setQueryData(["authUser"], normalized);
  
      // Optionally also invalidate to ensure server-state if needed
      // queryClient.invalidateQueries({ queryKey: ["authUser"] });
  
      // Navigate after cache update
      console.log("NAVIGATING TO /");
      navigate("/");
    },
  
    onError: (error) => {
      console.error("ONBOARD ERROR:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });
  

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random profile picture generated!");
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            Complete Your Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PROFILE PIC */}
            <div className="flex flex-col items-center space-y-4">
              <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                {formState.profilePic ? (
                  <img
                    src={formState.profilePic}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleRandomAvatar}
                className="btn btn-accent"
              >
                <ShuffleIcon className="size-4 mr-2" />
                Generate Random Avatar
              </button>
            </div>

            {/* FULL NAME */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                value={formState.fullname}
                onChange={(e) =>
                  setFormState({ ...formState, fullname: e.target.value })
                }
                className="input input-bordered w-full"
              />
            </div>

            {/* BIO */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                value={formState.bio}
                onChange={(e) =>
                  setFormState({ ...formState, bio: e.target.value })
                }
                className="textarea textarea-bordered h-24"
              />
            </div>

            {/* LANGUAGES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* NATIVE */}
              <div className="form-control">
                <label className="label">Native Language</label>
                <select
                  value={formState.nativeLanguage}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      nativeLanguage: e.target.value,
                    })
                  }
                  className="select select-bordered w-full"
                >
                  <option value="">Select</option>
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* LEARNING */}
              <div className="form-control">
                <label className="label">Learning Language</label>
                <select
                  value={formState.learningLanguage}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      learningLanguage: e.target.value,
                    })
                  }
                  className="select select-bordered w-full"
                >
                  <option value="">Select</option>
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* LOCATION */}
            <div className="form-control">
              <label className="label">Location</label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 opacity-70" />
                <input
                  type="text"
                  value={formState.location}
                  onChange={(e) =>
                    setFormState({ ...formState, location: e.target.value })
                  }
                  className="input input-bordered w-full pl-10"
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              className="btn btn-primary w-full"
              disabled={isLoading}
              type="submit"
            >
              {!isLoading ? (
                <>
                  <ShipWheelIcon className="size-5 mr-2" />
                  Complete Onboarding
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                  Onboarding...
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
