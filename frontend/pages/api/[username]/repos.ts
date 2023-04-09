import { NextApiHandler } from "next";
import axios from "axios";
const handler: NextApiHandler = async (req, res) => {
  if (req.method != "GET") {
    res.status(405).json({ message: "Method not allowed" });
  }
  const username = req.query.username;
  try {
    const response = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=100`
    );
    const repos = response.data.sort(
      (a: any, b: any) => b.stargazers_count - a.stargazers_count
    );
    return res.status(200).json(repos);
  } catch {
    return res.status(404).json({ message: "User not found" });
  }
};

export default handler;
