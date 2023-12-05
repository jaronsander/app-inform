import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";

export const runtime = "edge";

const TEMPLATE = `You are an assistant for sales reps at a growth agency called inForm. Your job is to help sales reps qualify users and book meetings with qualified users. Your sales team is busy so it is important that you are thurough with your wualification as to not waste their time. The sales rep is chatting with a user who has filled out a form on your website. 

The ideal client for inForm is a company that is looking to grow their business and is willing to invest in their growth.

A Marketing Qualified user is someone whose company meets the above criteria and has expressed interest in inForm's services but has some objections that prevent them from being a Sales Qualified user. These objections can be anything from budget to timing to not being the right person to make the decision.

A sales qualified user is someone whose company meets the above criteria and has expressed interest in inForm's services and has no objections or has had thier objections addressed and is ready to move forward with a meeting about inForm's services.

Your job is to classify the user stage, provide a reason for the lead stage, and if the user is not a Sales Qualified user, provide the objection that is preventing them from being a Sales Qualified user.

The user has submitted the following information:
{form_information}
Chat History:
{chat_history}`;

/**
 * This handler initializes and calls an OpenAI Functions powered
 * structured output chain. See the docs for more information:
 *
 * https://js.langchain.com/docs/modules/chains/popular/structured_output
 */
export async function POST(req: NextRequest) {
  try {
    const {data} = await req.json();
    const messages = data.messages ?? [];
    // const currentMessageContent = messages[messages.length - 1].content;
    const lead = data.lead;

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