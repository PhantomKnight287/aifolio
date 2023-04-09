import { OpenAIStream, OpenAIStreamPayload } from "../../../utils/openai";

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method != "POST")
    return new Response(
      JSON.stringify({ message: "Only POST requests allowed" }),
      {
        status: 405,
        headers: {
          "content-type": "application/json",
        },
      }
    );
  const body = await req.json();
  const url = new URL(req.url);
  const username = url.searchParams.get("username");

  const repos = body.repos as {
    name: string;
    description: string;
  }[];
  if (!repos || !repos.length)
    return new Response(JSON.stringify({ message: "No repos provided" }), {
      status: 400,
      headers: {
        "content-type": "application/json",
      },
    });
  if (repos.length > 3)
    return new Response(JSON.stringify({ message: "Only 3 repos allowed" }), {
      status: 400,
      headers: {
        "content-type": "application/json",
      },
    });

  const prompt = `I want to build my portfolio which will only contain an intro paragraph and a projects section, here are my project:
  generate me an intro and paragraph section after seeing my github repos:
  ${repos.map((repo) => `- ${repo.name}: ${repo.description}`).join("\n")}
  Rules:
  - You will replace all "your" and "you" with I
  - You will not refer to github repos in my intro para
  - Give content in raw markdown format with link to repos, github username is ${username}
  - Remember to add a link to my github profile
  - Use words like "Intresting", "Cool", "Awesome" etc
  - Create Proper headings and subheadings
  `;

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 3700,
    stream: false,
    n: 1,
  };

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_KEY ?? ""}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    return new Response(JSON.stringify(await res.json()), {
      status: res.status,
      headers: {
        "content-type": "application/json",
      },
    });
  }
  return new Response(JSON.stringify(await res.json()), {
    headers: {
      "content-type": "application/json",
    },
    status: 200,
  });
};

export default handler;
