import json

from langchain_ollama import ChatOllama
from langchain_core.prompts import PromptTemplate


class Evaluator:

    def __init__(self, model_name="gemma3:4b"):

        self.llm = ChatOllama(
            model=model_name,
            temperature=0
        )

        self.prompt = PromptTemplate(
            input_variables=["topic", "transcript"],
            template="""
You are an expert communication coach.

The user was asked to speak for one minute on the following topic.

Topic:
{topic}

User Speech:
{transcript}

Evaluate the speech on the following criteria.

Scoring Rules:
- Relevance: 0-10
- Fluency: 0-10
- Grammar: 0-10
- Vocabulary: 0-10
- Confidence: 0-10

Overall Score = Sum of all five scores (0-50).

Return ONLY a valid JSON object.

Rules:
- No markdown.
- No ```json
- No explanation.
- All scores must be integers.
- overall_score must equal the sum of the five individual scores.
- strengths, weaknesses and suggestions must each contain exactly 3 strings.

Example:

{{
  "relevance": 8,
  "fluency": 7,
  "grammar": 8,
  "vocabulary": 9,
  "confidence": 7,
  "overall_score": 39,
  "strengths": [
    "...",
    "...",
    "..."
  ],
  "weaknesses": [
    "...",
    "...",
    "..."
  ],
  "suggestions": [
    "...",
    "...",
    "..."
  ]
}}
"""
        )

    def evaluate(self, topic: str, transcript: str):

        prompt = self.prompt.format(
            topic=topic,
            transcript=transcript
        )

        response = self.llm.invoke(prompt)

        content = response.content.strip()

        print("===== RAW RESPONSE =====")
        print(content)
        print("========================")

        try:
            return json.loads(content)

        except json.JSONDecodeError:

            # Remove markdown
            content = (
                content
                .replace("```json", "")
                .replace("```", "")
                .strip()
            )

            # Extract JSON object
            start = content.find("{")
            end = content.rfind("}")

            if start != -1 and end != -1:
                content = content[start:end+1]

            try:
                return json.loads(content)

            except json.JSONDecodeError as e:
                raise Exception(
                    f"Invalid JSON from LLM:\n{content}"
                ) from e