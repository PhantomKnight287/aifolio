import { Container } from "@/components/container";
import { MetaTags } from "@/components/meta";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { VscGithub } from "react-icons/vsc";
import { BsArrowRight } from "react-icons/bs";
import { useRouter } from "next/router";

export default function Home() {
  const { auth } = useSupabaseClient();
  const user = useUser();
  const { push } = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <MetaTags
        title="AiFolio | Your Portfolio in Seconds"
        description="Generate Your Portfolio in Seconds using Github and AI."
      />
      <div className="relative" id="home">
        <div
          aria-hidden="true"
          className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20"
        >
          <div className="blur-[106px] h-80 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700" />
          <div className="blur-[106px] h-80 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600" />
        </div>
        <Container>
          <div className="relative pt-24 ml-auto">
            <div className="lg:w-2/3 text-center mx-auto">
              <h1 className="text-gray-900 dark:text-white font-bold text-5xl md:text-6xl xl:text-7xl">
                AiFolio{" "}
              </h1>
              <p className="mt-8 text-gray-700 dark:text-gray-300 text-xl ">
                Generate Your Portfolio in Seconds using Github and AI.
              </p>
              <div className="mt-16 flex flex-wrap justify-center gap-y-4 gap-x-6">
                <button
                  className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                  onClick={() => {
                    if (!user) {
                      auth.signInWithOAuth({
                        provider: "github",
                      });
                    } else {
                      push(`/${user.user_metadata.user_name}`);
                    }
                  }}
                >
                  <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white flex items-center dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 text-base">
                    {!user ? (
                      <>
                        Login with Github{" "}
                        <VscGithub className="ml-2" size={20} />
                      </>
                    ) : (
                      <>
                        Take me to my portfolio
                        <BsArrowRight className="ml-2" size={20} />
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </main>
  );
}
