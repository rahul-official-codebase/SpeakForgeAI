from fastapi import APIRouter
from services.topic_service import TopicService

router = APIRouter()

topic_service = TopicService()


@router.get("/generate-topic")
def generate_topic():

    return topic_service.generate_topic()