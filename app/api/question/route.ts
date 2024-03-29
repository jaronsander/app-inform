import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export const runtime = "edge";

const TEMPLATE = `You are a lead generation form question generator. Your task is to generate the most relevant, accurate, complete and specific question and the most likely responses to that question. You are given the previous answers and previous form questions. The purpose of this form is to gather relevant, contextual information from the contact answering your questions so that a productive sales conversation can be had in the future. The company description of the company you are asking questions for is as follows:
{company}

### Initial Lead Form Submission:
{lead_form_submission}

### Previous Questions and Responses:
{previous_responses}

### Example questions:
{questions}

Generate the next question and predict possible answers as it relates to the purpose of the form.
AVOID BASIC QUESTIONS! BE PSYCHOLOGICALLY INSIGHTFUL!
`;

export async function POST(req: NextRequest) {
  try {
    const {body} = await req.json();
    console.log(body);
    const leadFormSubmission = body.leadFormSubmission;
    const previousResponses = body.previousResponses;
    const companyDescription = body.companyDescription;
    const questions = body.questions;

    const prompt = PromptTemplate.fromTemplate(TEMPLATE);
    const model = new ChatOpenAI({ temperature: 0.5 });

    const schema = z.object({
      // analysis: z.string().describe("Analysis of the previous answers as it relates to the purpose of the form"),
      question: z.string().describe("The next form question"),
      suggestions: z.array(z.string()).describe("Predicted answers for the next question"),
    });

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

    const chain = prompt
      .pipe(functionCallingModel)
      .pipe(new JsonOutputFunctionsParser());

    const result = await chain.invoke({
      lead_form_submission: JSON.stringify(leadFormSubmission),
      previous_responses: previousResponses.map(response => JSON.stringify(response)).join("\n"),
      company: companyDescription,
      questions: previousResponses.map(response => JSON.stringify(questions)).join("\n"),
    });

    return NextResponse.json(result, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
