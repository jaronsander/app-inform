import { z } from "zod";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { RunnableSequence } from "langchain/schema/runnable";

export const generator = async (data) => {
  // console.log(data)
  const parser = StructuredOutputParser.fromZodSchema(
    z.object({
      question: z.string().describe("The question to ask the lead."),
      score: z
        .number()
        .describe("The score to give the lead between 1 and 10 where 0 is an extremely bad lead, 5 is an average lead, and 10 seems like they are ready to buy now."),
    })
  );
  const systemTemplate = PromptTemplate.fromTemplate(
  `You are a helpful sales representative with the goal of ensuring that leads you talk to are qualified to buy your product. You ask the lead questions to determine if they are qualified without asking about budget. The company you work for is inForm. inForm revolutionizes lead generation with intelligent web forms. Their conversational AI engages prospects through personalized, interactive questionnaires. The AI analyzes responses to identify qualified leads, score sales readiness, and gauge decision-making authority. inForm enables reps to focus on high-value prospects while our AI lead genius handles the heavy-lifting. The result? More leads, faster deals, and bigger wins.
  Based on this description and the following conversation, come up with a question to ask the lead as well as a score between 1 and 10 to rate the lead's qualification. Follow the instructions and format your response to match the format instructions, no matter what!\n{format_instructions}\n
  Past conversation: {conversation}\n
  Next Question: `,
  )
  
  const chain = RunnableSequence.from([
    systemTemplate,
    new OpenAI({ temperature: 0 }),
    parser,
  ])
  const response = await chain.invoke({
    conversation: data,
    format_instructions: parser.getFormatInstructions(),
  });
  console.log(response)
  // Format the messages
  return response;
}