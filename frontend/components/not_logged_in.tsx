import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { FC } from "react";
import { VscGithub } from "react-icons/vsc";

export const NotLoggedIn: FC<{ message?: string }> = ({ message }) => {
  const { auth } = useSupabaseClient();
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-center mt-20">
        {message || "You are not logged in"}
      </h1>
      <div className="mt-16 flex flex-wrap justify-center gap-y-4 gap-x-6">
        <button
          className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
          onClick={() => {
            auth.signInWithOAuth({
              provider: "github",
            });
          }}
        >
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white flex items-center dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 text-base">
            Login with Github <VscGithub className="ml-2" size={20} />
          </span>
        </button>
      </div>
    </div>
  );
};
