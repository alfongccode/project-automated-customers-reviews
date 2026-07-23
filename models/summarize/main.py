import json
from openai import OpenAI
from django.conf import settings

SYSTEM_PROMPT = (
    "You are a product-review editor. You will receive a JSON object with two keys: "
    "'product' (facts about the product) and 'reviews' (a list of individual customer "
    "reviews). Each review already includes a 'sentiment' field with one of: "
    "'positive', 'negative', 'neutral' — this classification is already done and trusted; "
    "do NOT reclassify or second-guess it, just use it as given.\n\n"
    "Your task, using the facts ONLY (do not invent products, numbers, specs, or "
    "complaints not present in the input):\n"
    "1. Write a short summary (2-3 sentences, plain text, no line breaks, no Markdown "
    "formatting of any kind).\n"
    "2. Extract 'highlights': a list of short plain-text points describing what "
    "customers value most, grounded in reviews whose sentiment is 'positive'. Each "
    "point must be a single plain-text sentence or short phrase, with no Markdown "
    "syntax (no '#', '*', '-', or line breaks inside a single point). Use an empty "
    "list if there are no positive reviews.\n"
    "3. Extract 'areas_to_improve': a list of short plain-text points describing "
    "recurring complaints, grounded in reviews whose sentiment is 'negative'. Same "
    "plain-text rules as above. Use an empty list if there are no negative reviews.\n\n"
    "Respond ONLY with a single JSON object (no markdown fences, no preamble, no extra "
    "text) matching EXACTLY this shape:\n"
    "{\n"
    '  "product_name": string,\n'
    '  "summary": string,\n'
    '  "highlights": [string, ...],\n'
    '  "areas_to_improve": [string, ...]\n'
    "}\n"
    "All string values must be plain text only: no Markdown headers, bullets, bold, "
    "or escaped newlines. Do not include sentiment counts or any other key — those "
    "are computed separately."
)

client = OpenAI()

def get_sentiments_counts(reviews):
    counts = {'positive': 0, 'negative': 0, 'neutral': 0}
    for review in reviews:
        if 'sentiment' in review:
            sentiment = review['sentiment']
            counts[sentiment] += 1

    return counts

def summarize_via_openai(payload):    
    response = client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        temperature=0.4,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT },
            {"role": "user", "content": json.dumps(payload, ensure_ascii=False)}
        ])
    return json.loads(response.choices[0].message.content)

def summarize_reviews(product, reviews):
    sentiments_counts = get_sentiments_counts(reviews)
    result = summarize_via_openai({ 'product':product, 'reviews': reviews })
    return {
        "product_name": result.get("product_name", product.get("name", "Unknown product")),
        "summary": result.get("summary", ""),
        "positive": result.get("highlights", ""),
        "negative": result.get("areas_to_improve", ""),
        "sentiment_counts": sentiments_counts,
        "total_reviews": len(reviews),
    }