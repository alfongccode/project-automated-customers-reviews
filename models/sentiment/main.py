import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from peft import PeftModel

BASE_MODEL = "cardiffnlp/twitter-roberta-base-sentiment-latest"
LORA_MODEL = "Bitnick42/roberta-base-review-sentiment-analysis"
LABEL2ID = {"negative": 0, "neutral": 1, "positive": 2}
ID2LABEL = {v: k for k, v in LABEL2ID.items()}

def sentiment_analysis(review):
    review_title = review['title']
    review_content = review['content']
    review_input = ' '.join([review_title, review_content])

    tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL)
    model = AutoModelForSequenceClassification.from_pretrained(BASE_MODEL)
    model = PeftModel.from_pretrained(
        model,
        LORA_MODEL
    )

    model.eval()
    
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model.to(device)

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
    }