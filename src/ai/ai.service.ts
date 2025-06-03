import { Inject, Injectable } from '@nestjs/common';
import { generateText } from 'ai';
import {
  SEPARATOR,
  TOKEN_QUESTION_MODEL,
  TOKEN_RESPONSE_MODEL,
} from './constants';
import type { LanguageModelV1 } from '@ai-sdk/provider';

@Injectable()
export class AiService {
  constructor(
    @Inject(TOKEN_QUESTION_MODEL)
    private readonly openaiQuestionModel: LanguageModelV1,
    @Inject(TOKEN_RESPONSE_MODEL)
    private readonly openaiResponseModel: LanguageModelV1,
  ) {}

  public async createQuestion(topic: string, template: string) {
    const { text } = await generateText({
      model: this.openaiQuestionModel,
      prompt: template,
      temperature: 0.7,
      system: `
You're a senior expert "${topic}".
Your task is to generate a list of responses to a given question, separated by "${SEPARATOR}".

- Format in a way that the questions are easy to read.
- Use introduction.
- No enumeration.
- Don't include answers.
- They should be short and concise.
- They should should be at least 15 items.
- Use markdown formatting.
- No HTML.
- No response.
- No conclusion.
- No explanation.
- No introductory or concluding remarks from you.
- Your first generated token should be a question.

Your output should be a series of questions, with each response clearly separated by the string \`${SEPARATOR}\`. Do not include any other text, explanations, or introductory/concluding remarks outside the responses themselves.

**Example of output**
**Topic:** "Java Concurrency, synchronization good practices"
**Output:**
What is the primary purpose of the \`synchronized\` keyword in Java?
${SEPARATOR}
Explain the difference between \`volatile\` and \`synchronized\` keywords.
${SEPARATOR}
Describe the concept of "liveness" in the context of concurrent programming.
  `.trim(),
    });

    return text
      .split(SEPARATOR)
      .filter(Boolean)
      .map((i) => i.replace(/^\n+|\n+$/g, ''));
  }

  public async createResponse(
    topic: string,
    template: string,
    isGood: boolean,
  ) {
    const { text } = await generateText({
      model: this.openaiResponseModel,
      prompt: template,
      temperature: 0.7,
      system: `
You're a senior expert "${topic}".
Your task is to generate a list of responses to a given question, separated by "${SEPARATOR}".
${
  isGood &&
  `
Generate responses that are:
- Factually accurate and correct.
- Directly answer the question.
- Relevant and provide insightful, helpful, and complete information.
- Clearly written and easy to understand.
`.trim()
}

${
  !isGood &&
  `
Generate responses that are:
- Factually incorrect or misleading.
- Irrelevant or do not directly answer the question.
- Vague, incomplete, or lack necessary detail.
- Subtly flawed or contain common misconceptions related to the topic.
- Aim for plausible-sounding but incorrect/misleading answers where appropriate, rather than outright nonsensical ones.
`.trim()
}

Note:
- Format in a way that the response are easy to read.
- Create short responses.
- No introduction.
- No enumeration.
- Use markdown formatting.
- No HTML.
- No conclusion.
- No explanation.
- Your first token should be a response already.

---

Your output should be a series of responses, with each response clearly separated by the string \`${SEPARATOR}\`. Do not include any other text, explanations, or introductory/concluding remarks outside the responses themselves.

**Example for good response**
**Question:** "What is the capital of France?"
**Output:**
Paris is the capital and most populous city of France.
${SEPARATOR}
The capital of France is Paris, a major European city and global center for art, fashion, gastronomy, and culture.
${SEPARATOR}
Paris.

**Example for Bad response**
**Question:** "What is the capital of France?"
**Output:**
The capital of France is London.
${SEPARATOR}
France does not have a single capital city; it uses several administrative centers for different functions.
${SEPARATOR}
The Eiffel Tower is located in the capital of France, which is Berlin.
          `.trim(),
    });

    return text
      .split(SEPARATOR)
      .filter(Boolean)
      .map((i) => i.replace(/^\n+|\n+$/g, ''));
  }
}
