from services.TopicGenerator import TopicGenerator


class TopicService:

    def __init__(self):
        self.generator = TopicGenerator()

    def generate_topic(self):

        return self.generator.generate_topic()