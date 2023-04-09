import { Container } from "@/components/container";
import { MetaTags } from "@/components/meta";
import { NotLoggedIn } from "@/components/not_logged_in";
import { Renderer } from "@/components/renderer";
import { supabase } from "@/utils/supabase";
import { useUser } from "@supabase/auth-helpers-react";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { useMemo } from "react";

export default function Portfolio(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { push, asPath } = useRouter();
  const user = useUser();
  const portfolio = useMemo(() => props.portfolio, [props.portfolio])!;
  if (!user)
    return (
      <Container className="flex flex-col items-center justify-center">
        <NotLoggedIn />
      </Container>
    );
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
    </Container>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const d = await supabase.from("portfolios").select("username");
  return {
    paths: (d.data || []).map((p) => ({
      params: {
        username: p.username,
      },
    })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<{
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
      notFound: true,
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
