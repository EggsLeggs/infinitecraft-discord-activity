// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

import { defaultSystemMessage, defaultChips, defaultExamples } from "./consts";
import { ChatCompletionCreateParamsNonStreaming, ChatCompletionMessageParam } from "openai/resources/chat/completions";

dotenv.config({path: "../.env"})

const app: Express = express();
const port = process.env.PORT || 3001;

// Generate formatted examples for chatGPT: format = [{role: "user", content: `${first} + ${second}`}, {role: "system", content: result}]
var examples: ChatCompletionMessageParam[] = []
defaultExamples.forEach((example) => {
  examples.push({role: "user", content: `${example.first} + ${example.second}`})
  examples.push({role: "system", content: example.result})
})

const openAI = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
})

const completionParams: ChatCompletionCreateParamsNonStreaming = {
  model: "gpt-3.5-turbo",
  max_tokens: 15,
  temperature: 0,
  top_p: 1,
  n: 1,
  messages: []
}

app.post("/api/token", async (req: Request, res: Response) => {

  // Exchange the code for an access_token
  const response = await fetch(`https://discord.com/api/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.VITE_DISCORD_CLIENT_ID!,
      client_secret: process.env.DISCORD_CLIENT_SECRET!,
      grant_type: "authorization_code",
      code: req.body.code,
    }),
  });

  // Retrieve the access_token from the response
  const { access_token } = await response.json();

  // Return the access_token to our client as { access_token: "..."}
  res.send({access_token});
});

app.get("/pair", (req: Request, res: Response) => {
  // TODO: check in mongoDB if the pair is already in the database
  const first = req.query.first as string | undefined;
  const second = req.query.second as string | undefined;
  if (!first || !second) {
      res.status(400).json({ error: "Missing query parameters" });
      return;
  }
  const newPair = `${first} + ${second}`;
  const messages: ChatCompletionMessageParam[] = [
      {role: "system", content: defaultSystemMessage},
  ]
  messages.push(...examples)
  messages.push({role: "user", content: newPair})

  openAI.chat.completions.create({
      ...completionParams,
      messages,
  })
  .then((response) => {
      res.json({ response: response.choices[0].message.content });
  })
  .catch((error) => {
      res.status(500).json({ error });
  });
});

app.get("/chips", (req: Request, res: Response) => {
  // const guild = req.query.guild as string | undefined;
  // if (!guild) {
  //     res.status(400).json({ error: "Missing query parameters" });
  //     return;
  // }
  res.json(defaultChips);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});