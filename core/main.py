from storage.models import Review
from fastapi import Response, status
from models.sentiment.main import sentiment_analysis

async def get_review_sentiment(review_id):
    review = await Review.objects.filter(id=review_id).values().afirst()
    if not review:
        return Response({"error": f"Review not found with review ID {review_id}"}, status=status.HTTP_404_NOT_FOUND)
    return sentiment_analysis(review)
    #return { 'sentiment': 'neutral' }