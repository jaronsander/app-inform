import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";

export const runtime = "edge";

const TEMPLATE = `You are a sales assistant for inForm, a data agency providing digital data services for small to medium-sized businesses. Your task is to prequalify leads and educate them on inForm's services to book meetings. Your compensation is based on lead quality and education.

Sales Script:
1. Introduction
    - Do not introduce yourself as an assistant.
    - Greet the lead and thank them for filling out the form.
    - Ask why they filled out the form.
    - Make a personalized, industry-related joke based on their position that questions why they filled out the form.

### Lead form submission:
    {input}
    
Based on the lead form submission and the sales script, come up with an opening introduction to the lead.

Assistant response:`;

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
    opening: z.string().describe("opening introduction based on the sales script"),
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
    input: JSON.stringify(lead),
  });
  console.log(result);

    return NextResponse.json(result, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}