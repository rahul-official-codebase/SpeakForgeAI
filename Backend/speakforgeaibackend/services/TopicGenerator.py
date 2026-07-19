from langchain_ollama import ChatOllama
from langchain_core.prompts import PromptTemplate
import re

class TopicGenerator:

    def __init__(self, model_name="gemma3:4b"):

        self.llm = ChatOllama(
            model=model_name,
            temperature=0.8  # Slightly higher for more varied topics
        )

        self.prompt = PromptTemplate(
            input_variables=[],
            template="""
You are an expert public speaking coach.

Generate ONE random speaking topic suitable for a 2-minute speech.

Requirements:
- The topic should be unique and engaging.
- It should be appropriate for students and professionals.
- Avoid controversial, political, religious, or offensive topics.
- The topic should encourage critical thinking or storytelling.
- Try everytime give different topic.

Return the response in exactly this format:

TOPIC:
<topic name>

DESCRIPTION:
<2-3 sentence explanation of the topic so that the user can understand it even if they have never heard of it.>

TIPS:
- Mention 3 points the user can cover while speaking.

DIFFICULTY:
Easy / Medium / Hard

Do not add any extra text before or after the response.
"""
        )

    def generate_topic(self):

        prompt = self.prompt.format()
        response = self.llm.invoke(prompt)

        content = response.content.strip()

        topic = ""
        description = ""
        tips = []
        difficulty = ""

        # Topic
        topic_match = re.search(
            r"TOPIC:\s*(.*?)\s*DESCRIPTION:",
            content,
            re.DOTALL
        )

        # Description
        description_match = re.search(
            r"DESCRIPTION:\s*(.*?)\s*TIPS:",
            content,
            re.DOTALL
        )

        # Tips
        tips_match = re.search(
            r"TIPS:\s*(.*?)\s*DIFFICULTY:",
            content,
            re.DOTALL
        )

        # Difficulty
        difficulty_match = re.search(
            r"DIFFICULTY:\s*(.*)",
            content,
            re.DOTALL
        )

        if topic_match:
            topic = topic_match.group(1).strip()

        if description_match:
            description = description_match.group(1).strip()

        if tips_match:
            tips_text = tips_match.group(1)

            tips = [
                tip.strip("-•1234567890. ").strip()
                for tip in tips_text.split("\n")
                if tip.strip()
            ]

        if difficulty_match:
            difficulty = difficulty_match.group(1).strip()

        return {
            "topic": topic,
            "description": description,
            "tips": tips,
            "difficulty": difficulty
        }