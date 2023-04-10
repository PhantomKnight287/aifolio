import { Container } from "@/components/container";
import { MetaTags } from "@/components/meta";
import { NotLoggedIn } from "@/components/not_logged_in";
import { Renderer } from "@/components/renderer";
import { supabase } from "@/utils/supabase";
import { useUser } from "@supabase/auth-helpers-react";
import clsx from "clsx";
import {
  GetServerSideProps,
  GetStaticPaths,
  GetStaticProps,
  InferGetServerSidePropsType,
  InferGetStaticPropsType,
} from "next";
import { useRouter } from "next/router";
import { useMemo } from "react";

export default function Portfolio(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { push, asPath } = useRouter();
  const user = useUser();
  const portfolio = useMemo(() => props.portfolio, [props.portfolio])!;

  if (props.notGenerated) {
    return (
      <Container className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-center mt-20">
          Portfolio not generated
        </h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
          onClick={() => {
            push(`${asPath}/generate`);
          }}
        >
          Generate Portfolio
        </button>
      </Container>
    );
  }
  return (
    <Container className="flex flex-col items-center pt-20 justify-center mb-20">
      <MetaTags
        title={`${portfolio.username}'s Portfolio`}
        description={`${portfolio.username}'s Portfolio`}
        ogImage={
          portfolio.avatarUrl ||
          `https://avatars.dicebear.com/api/initials/${portfolio.username}.png`
        }
      />
      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20"
        >
          <div className="blur-[106px] h-80 bg-gradient-to-r from-primary to-purple-400 dark:from-blue-700" />
          <div className="blur-[106px] h-80 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600" />
        </div>
      </div>
      <img
        src={
          portfolio.avatarUrl ||
          `https://avatars.dicebear.com/api/initials/${portfolio.username}.png`
        }
        alt="avatar"
        className="w-32 h-32 rounded-full"
      />
      <Renderer>{portfolio.portfolio}</Renderer>

      <div className="mt-20">
        {user?.user_metadata?.user_name === portfolio.username && (
          <>
            Want to regenerate your portfolio?{" "}
            <button
              className={clsx(
                "relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white  focus:outline-none"
              )}
              onClick={() => {
                push(`${asPath}/generate`);
              }}
            >
              <span
                className={clsx(
                  "relative px-5 py-2.5 transition-all ease-in duration-75 bg-white flex items-center dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 text-base"
                )}
              >
                Click Here
              </span>
            </button>
          </>
        )}
      </div>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps<{
  portfolio?: {
    avatarUrl: string | null;
    created_at: string | null;
    id: number;
    portfolio: string | null;
    username: string;
  };
  notGenerated?: boolean;
}> = async ({ params }) => {
  const { username } = params as { username: string };
  const { data, error } = await supabase
    .from("portfolios")
    .select()
    .eq("username", username)
    .single();

  if (error) {
    return {
      props: {
        notGenerated: true,
      },
    };
  }
  if (data === undefined) {
    return {
      props: {
        notGenerated: true,
      },
    };
  }
  return {
    props: {
      portfolio: data,
    },
  };
};
