import { TeamsActivityHandler } from "botbuilder";
import { ChatOpenAI } from "langchain/chat_models/openai";
import config from "./config";
import { HumanMessage, SystemMessage } from "langchain/schema";

// create Chat Completions wrapper for OpenAI API
const chat = new ChatOpenAI({
  openAIApiKey: config.openAIApiKey,
  temperature: 0.9,
});

export class TeamsBot extends TeamsActivityHandler {
  constructor() {
    super();

    this.onMessage(async (context, next) => {
      // get message from user
      const { text } = context.activity;

      // send typing indicator
      await context.sendActivities([{ type: "typing" }]);

      // send message to openAI
      const result = await chat.predictMessages([
        new SystemMessage(`You are an AI assistant that helps people find information.`),
        new HumanMessage(text),
      ]);

      // send result to user
      await context.sendActivity(result.content);
      await next();
    });
  }
}
