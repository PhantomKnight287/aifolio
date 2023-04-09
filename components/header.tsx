import { FC } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { sen } from "@/fonts";
import { useUser } from "@supabase/auth-helpers-react";

export const Header: FC<{}> = () => {
  const user = useUser();

  return (
    <nav className="w-full z-20 top-0 left-0 ">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center  ">
          <span
            className={clsx(
              "self-center text-2xl font-semibold whitespace-nowrap dark:text-white",
              sen.className
            )}
          >
            AiFolio
          </span>
        </Link>
        <div className="flex md:order-2">
          {user?.user_metadata?.name ? (
            <div
              className={clsx(
                "flex items-center",
                "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-2 transition duration-200 ease-in-out dark:text-gray-300 text-gray-700 dark:hover:text-white hover:text-gray-900 dark:bg-gray-900 bg-gray-100 bg-opacity-50"
              )}
            >
              <img
                src={user.user_metadata.avatar_url}
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
              <span
                className={clsx(
                  "text-gray-700 dark:text-gray-300 text-base ml-2",
                  sen.className
                )}
              >
                {user.user_metadata.name}
              </span>
            </div>
          ) : (
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Get started
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
