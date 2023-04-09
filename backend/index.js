import e from "express";
import cors from "cors";
import 'dotenv/config'
import axios from "axios";
const app = e();
app.use(e.json())
app.use(
  cors({
    origin: process.env.ORIGIN || "*",
  })
);

/**
 * @param {e.Request} req
 * @param {e.Response} res
 */
app.post(`/:username/generate`, async (req, res) => {
  if (req.method != "POST")
    return res.status(405).json({ message: "Method not allowed" });
  const body = req.body;
  const username = req.params.username;

  const repos = body.repos;
  if (!repos || !repos.length)
    return res.status(400).json({ message: "No repos provided" });
  if (repos.length > 3)
    return res.status(400).json({ message: "Too many repos" });

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

  const payload = {
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

  try {
    const response = await axios.post("https://api.openai.com/v1/chat/completions", payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_KEY ?? ""}`,
      }
    });
  
    return res.json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});
