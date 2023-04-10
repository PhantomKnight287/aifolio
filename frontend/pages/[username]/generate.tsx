import { Container } from "@/components/container";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import axios from "axios";
import { MetaTags } from "@/components/meta";
import clsx from "clsx";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { NotLoggedIn } from "@/components/not_logged_in";
export default function GeneratePortfolio() {
  const [state, setState] = useState<
    "loading" | "error" | "none" | "generated"
  >("loading");
  const [repos, setRepos] = useState<
    {
      name: string;
      description: string;
      stargazers_count: number;
      id: string;
      html_url: string;
    }[]
  >([]);
  const { isReady, query, push } = useRouter();
  const [error, setError] = useState("");
  const [selectedRepos, setSelectedRepo] = useState<
    { name: string; description: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const supabase = useSupabaseClient();
  const user = useUser();
  useEffect(() => {
    if (isReady) {
      axios
        .get(`/api/${query.username}/repos`)
        .then((res) => {
          setRepos(res.data);
          setState("none");
        })
        .catch((err) => {
          setState("error");
          setError(err?.response?.data?.message || "Something went wrong");
        });
    }
  }, [isReady, query.username]);

  const generate = async () => {
    setLoading(true);
    const { data: previousPortfolio } = await supabase
      .from("portfolios")
      .select("*")
      .eq("username", query.username)
      .single();
    if (previousPortfolio) {
      if (previousPortfolio.tries >= 3) {
        setLoading(false);
        setState("error");
        setError("You have reached the maximum number of tries");
        return;
      }
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/${query.username}/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repos: selectedRepos,
        }),
      }
    );
    setLoading(false);

    if (!response.ok) {
      setState("error");
      setError("Something went wrong");
      return;
    }

    const data = await response.json();
    if (data.choices?.[0]?.message) {
      setState("generated");

      if (previousPortfolio) {
        await supabase
          .from("portfolios")
          .update({
            portfolio: data.choices[0].message.content,
            username: query.username,
            avatarUrl: user!.user_metadata.avatar_url,
            tries: previousPortfolio.tries + 1,
          })
          .eq("username", query.username);
      } else {
        const d = await supabase.from("portfolios").insert([
          {
            portfolio: data.choices[0].message.content,
            username: query.username,
            avatarUrl: user!.user_metadata.avatar_url,
          },
        ]);
      }
      push(`/${query.username}`);
    }
  };
  if (!user) {
    return (
      <Container className="flex flex-col items-center justify-center">
        <NotLoggedIn />
      </Container>
    );
  }
  return (
    <Container className="flex flex-col items-center justify-center">
      <MetaTags
        title={
          query.username
            ? `Generate Portfolio for @${query.username}`
            : "Generate Portfolio"
        }
        description="Generate your portfolio"
      />
      {state != "generated" ? (
        <h1 className="text-4xl font-bold text-center mt-20">
          Generate Your Portfolio
        </h1>
      ) : null}
      {state == "loading" ? (
        <div className="animate-pulse bg-gray-200 h-4 w-96 mt-4 rounded-sm"></div>
      ) : (
        <>
          {state == "error" ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              {state === "generated" ? (
                <>
                  <h1 className="text-white text-4xl font-bold text-center mt-20">
                    Portfolio generated successfully.
                  </h1>
                  <p className="text-gray-500 my-4 text-xl">
                    Redirecting to your portfolio.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-gray-500 my-4 text-xl">
                    Select top 3 repositories you want to use to generate your
                    portfolio.
                  </p>
                  <div className="my-8 flex flex-wrap justify-center gap-y-4 gap-x-6">
                    <button
                      className={clsx(
                        "relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white  focus:outline-none",
                        {
                          hidden: !selectedRepos.length,
                        }
                      )}
                      onClick={loading ? undefined : generate}
                    >
                      <span
                        className={clsx(
                          "relative px-5 py-2.5 transition-all ease-in duration-75 bg-white flex items-center dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 text-base",
                          {
                            "cursor-not-allowed": loading,
                          }
                        )}
                      >
                        {loading ? (
                          <svg
                            aria-hidden="true"
                            role="status"
                            className="inline w-4 h-4 mr-3 text-white animate-spin"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="#E5E7EB"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentColor"
                            />
                          </svg>
                        ) : null}
                        Generate Portfolio
                      </span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {repos.map((repo) => (
                      <div
                        key={repo.id}
                        className={clsx(
                          "bg-gray-800 rounded-lg shadow-md p-4 flex flex-col justify-between text-white",
                          {
                            "border-2 border-indigo-600": selectedRepos.find(
                              (r) => r.name == repo.name
                            ),
                            "cursor-not-allowed":
                              selectedRepos.length >= 3 &&
                              !selectedRepos.find((r) => r.name == repo.name),
                          }
                        )}
                        onClick={() => {
                          if (selectedRepos.find((r) => r.name == repo.name)) {
                            setSelectedRepo(
                              selectedRepos.filter((r) => r.name != repo.name)
                            );
                          } else {
                            if (selectedRepos.length < 3) {
                              setSelectedRepo((d) => [
                                ...d,
                                {
                                  name: repo.name,
                                  description: repo.description,
                                },
                              ]);
                            }
                          }
                        }}
                      >
                        <h3 className="font-semibold text-lg">{repo.name}</h3>
                        <p className="text-gray-400">{repo.description}</p>
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-gray-500">
                            {repo.stargazers_count}{" "}
                            <AiFillStar className="inline-block text-yellow-400" />
                          </span>
                          <a
                            href={repo.html_url}
                            className="text-indigo-600 hover:text-indigo-500"
                            rel="noreferrer"
                            target="_blank"
                          >
                            View on GitHub
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}
    </Container>
  );
}
