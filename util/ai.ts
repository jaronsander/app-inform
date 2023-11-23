import { z } from "zod";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { RunnableSequence } from "langchain/schema/runnable";

export const generator = async (data) => {
  console.log(data['lead'])
  console.log(data['messages'])
  const parser = StructuredOutputParser.fromZodSchema(
    z.object({
      question: z.string().describe("The unique and thoughtful response to the leads last message that will help the lead move forward in the sales process."),
      score: z
        .number()
        .describe("The score to give the lead between 1 and 10 whith 1 being not knowing anything about the lead or the lead being somewhat unqualiefied and a 10 having immediate need and are ready to spend money now."),
      reason: z.string().describe("The reason for the score given to the lead."),
    })
  );
  
  const systemTemplate = PromptTemplate.fromTemplate(
  `You are a tenured SDR for a growth agency called inForm.
  You are chatting with a lead who has filled out a form on your website.
  The lead has submitted the following form information:
  {form_information}
  Initial Agent Question:
  The first question to be asked by the chat agent should be a general probe into the purpose of the lead's form submission. Use a question like: "How can I help you today?" or "Why have you reached out today?"

  Response Handling:

  If the lead is just curious:

  Provide a brief overview of inForm, highlighting key services and the agency's expertise.
  Encourage further exploration and engagement with additional information on inForm's capabilities.
  If the lead has a specific problem:

  Express understanding of their challenge.
  Prompt the lead to share more details about the problem they are looking to solve.
  Tailor responses based on the specific issues mentioned by the lead.
  If the lead continues to chat:

  Inquire about their current technical architecture.
  Explore their conversion rates and any pain points they might be experiencing.
  Ask about their reporting processes and what metrics they prioritize.
  In all scenarios:

  Emphasize inForm's role as a technical growth agency.
  Highlight the agency's expertise in helping companies implement effective tools for scaling.
  Introduce inForm's internal tool, a dynamic web form utilizing AI for personalized questions and insights.
  Guidance for Subsequent Questions:
  Continue to ask follow-up questions based on the lead's responses. If they express specific problems, delve deeper into those areas. If they seek information, provide relevant details about inForm's capabilities. Always aim to add value to the conversation and tailor responses to the lead's needs.
  
  Follow these instructions very carefully and format your response to match the format instructions, no matter what!\n{format_instructions}\n
  Past conversation: {conversation}\n
  Next Question: `,
  )
  
  const chain = RunnableSequence.from([
    systemTemplate,
    new OpenAI({ temperature: 0 }),
    parser,
  ])

  const response = await chain.invoke({
    form_information: JSON.stringify(data['lead']),
    conversation: JSON.stringify(data['messages']),
    format_instructions: parser.getFormatInstructions(),
  });
  console.log(response)
  // Format the messages
  return response;
}