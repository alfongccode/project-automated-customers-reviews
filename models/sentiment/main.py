BASE_MODEL = "cardiffnlp/twitter-roberta-base-sentiment-latest"
LORA_MODEL = "Bitnick42/roberta-base-review-sentiment-analysis"
LABEL2ID = {"negative": 0, "neutral": 1, "positive": 2}
ID2LABEL = {v: k for k, v in LABEL2ID.items()}

"""def sentiment_analysis(review):
    import torch
    from transformers import AutoTokenizer, AutoModelForSequenceClassification
    from peft import PeftModel
    
    tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL)
    model = AutoModelForSequenceClassification.from_pretrained(BASE_MODEL)
    model = PeftModel.from_pretrained(
        model,
        LORA_MODEL
    )

    model.eval()

    device = "cuda" if torch.cuda.is_available() else "cpu"
    model.to(device)

    review_title = review['title']
    review_content = review['content']
    review_input = ' '.join([review_title, review_content])

    enc = tokenizer(review_input, truncation=True, max_length=128, padding=True, return_tensors="pt").to(device)

    with torch.no_grad():
        probs = model(**enc).logits.softmax(-1)

    pred_id = probs.argmax(-1).item()
    label = model.config.id2label[pred_id]
    confidence = probs[0][pred_id].item()

    return {
        "review": review,
        "sentiment": label,
        "confidence": round(confidence, 4)
    }"""
    
import os
import httpx
from dotenv import load_dotenv, find_dotenv

_ = load_dotenv(find_dotenv(), override=True)

HF_TOKEN = os.environ["HF_TOKEN"]
HF_URL = "https://router.huggingface.co/hf-inference/models/cardiffnlp/twitter-roberta-base-sentiment-latest"

import os
import httpx
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv(), override=True)

HF_TOKEN = os.environ["HF_TOKEN"]
HF_URL = "https://router.huggingface.co/hf-inference/models/cardiffnlp/twitter-roberta-base-sentiment-latest"

def sentiment_analysis(review):
    review_input = " ".join([
        (review.get("title") or "").strip(),
        (review.get("content") or "").strip(),
    ]).strip()

    if not review_input:
        return {"review": review, "sentiment": "neutral", "confidence": 0.0}

    with httpx.Client(timeout=60.0) as client:
        resp = client.post(
            HF_URL,
            headers={"Authorization": f"Bearer {HF_TOKEN}"},
            json={"inputs": review_input[:1000],
                  "options": {"wait_for_model": True}},
        )

    if resp.status_code != 200:
        return {"review": review, "sentiment": "neutral", "confidence": 0.0}

    data = resp.json()
    preds = data[0] if isinstance(data[0], list) else data
    best = max(preds, key=lambda p: p["score"])

    return {
        "review": review,
        "sentiment": best["label"].lower(),
        "confidence": round(best["score"], 4),
    }