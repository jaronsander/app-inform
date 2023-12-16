import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";

export const runtime = "edge";

const TEMPLATE = `You are an assistant for sales reps at inForm, a data agency. Your role is to help sales reps qualify users and book meetings with qualified users. It's crucial to be thorough in qualification to optimize the sales team's time. The ideal client for inForm is a company looking to enhance its data strategy and willing to invest in data services.

Your task is to assess the lead's qualification status based on the provided information and chat history.

### IMPORTANT NOTES:
- If the lead mentions that they are not interested at any time, they are Unqualified.
- The more information the lead provides on their internal services the better. If they are not forthcoming with information, they are Unqualified.
- No lead can be Sales Qualified without being a decision-maker or having the ability to influence the decision-making process.
- No lead can be Sales Qualified without giving information on their technical infrastructure.

### Form Information:
{form_information}

### Chat History:
{chat_history}

Disregard the example response and provide your own assessment of the lead's qualification status, reason, and objection (if applicable) based on the form information and chat history.`;

/**
 * This handler initializes and calls an OpenAI Functions powered
 * structured output chain. See the docs for more information:
 *
 * https://js.langchain.com/docs/modules/chains/popular/structured_output
 */
export async function POST(req: NextRequest) {
  try {
    const {body} = await req.json();
    // console.log(body);
    const messages = body.messages ?? [];
    // const currentMessageContent = messages[messages.length - 1].content;
    const lead = body.lead;

    const prompt = PromptTemplate.fromTemplate(TEMPLATE);
    /**
     * Function calling is currently only supported with ChatOpenAI models
     */
    const model = new ChatOpenAI({
      temperature: 0.2,
    });

    /**
     * We use Zod (https://zod.dev) to define our schema for convenience,
     * but you can pass JSON Schema directly if desired.
     */
    const schema = z.object({
      stage: z
        .enum(["Unqualified", "Marketing Qualified", "Sales Qualified"])
        .describe("The lead stage of human being interacted with"),
      reason: z.string().describe("The reason for the lead stage"),
      objection: z
        .optional(z.string())
        .describe("If the lead has voiced any objections, what are they?"),
    });

    /**
     * Bind the function and schema to the OpenAI model.
     * Future invocations of the returned model will always use these arguments.
     *
     * Specifying "function_call" ensures that the provided function will always
     * be called by the model.
     */
    const functionCallingModel = model.bind({
      functions: [
        {
          name: "output_formatter",
          description: "Should always be used to properly format output",
          parameters: zodToJsonSchema(schema),
        },
      ],
      function_call: { name: "output_formatter" },
    });

    /**
     * Returns a chain with the function calling model.
     */
    const chain = prompt
      .pipe(functionCallingModel)
      .pipe(new JsonOutputFunctionsParser());
    // const formattedPrompt = await prompt.format({
    //     form_information: JSON.stringify(lead),
    //     chat_history: messages.map((message) => JSON.stringify(message)).join("\n"),
    // });
    // console.log(formattedPrompt);
    const result = await chain.invoke({
      form_information: JSON.stringify(lead),
      chat_history: messages.map((message) => JSON.stringify(message)).join("\n"),
    });

    return NextResponse.json(result, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}