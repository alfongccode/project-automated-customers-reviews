![logo_ironhack_blue](https://user-images.githubusercontent.com/23629340/40541063-a07a0a8a-601a-11e8-91b5-2f13e4e6b441.png)

# Automated Customer Reviews — NLP Pipeline

An end-to-end NLP system that turns thousands of raw Amazon product reviews into actionable insight. It runs three stages back to back: it **classifies** each review's sentiment, **clusters** products into meta-categories on its own, and uses **generative AI** to write short, grounded recommendation articles for each category.

Built on ~61k Amazon consumer reviews (Datafiniti dataset). Everything runs from a single notebook, with a companion Django + Vite web app for deployment.

---

## What's in this folder

| File / folder | Description |
|---|---|
| `FINAL_MODEL.ipynb` | The full pipeline notebook — all three stages, with training, evaluation, and charts. |
| `FINAL_MODEL_min.ipynb` | Minimal / clean version of the same pipeline (fewer intermediate cells). |
| `FINAL_MODEL_clean.ipynb` | Cleaned intermediate version. |
| `FINAL_MODEL_presentation.pptx` | Slide deck (technical + non-technical audience). |
| `FINAL_MODEL_speaker_notes.txt` | Speaker notes for the deck (~5 min). |
| `automated_customer_reviews.ipynb` | Original exploration notebook. |
| `sentiment_classification.ipynb` | Standalone sentiment experiments. |
| `artifacts/` | All generated outputs: trained models, figures (`fig_*.png`), confusion matrices, cleaned/clustered CSVs, result tables, and the generated articles in `artifacts/articles/`. |

> The deployable web app lives in the sibling folder `project-automated-customers-reviews/` (Django API + Vite front end).

---

## The three stages

### 1. Sentiment classification
Star ratings are mapped to three sentiment classes:

| Star rating | Sentiment |
|---|---|
| 1–2 | Negative |
| 3 | Neutral |
| 4–5 | Positive |

**The core challenge is severe class imbalance** — positive reviews outnumber negative ones roughly 23:1. A model that always predicts "positive" already scores ~92% accuracy while being useless at finding complaints, so **macro-F1** (which weights all three classes equally) is the metric that actually matters.

Approach: fine-tune a pretrained transformer (`cardiffnlp/twitter-roberta-base-sentiment`, trained on short informal text) using **LoRA** (only ~1% of weights trained) with a **class-weighted loss** so rare negatives/neutrals are penalized more heavily. Early stopping prevents overfitting, and a post-hoc decision-threshold tuning step squeezes out the final gains.

### 2. Product category clustering
Products are grouped into meta-categories **without hand-labeling** — the model clusters products from their category tags (bag-of-words features), and `k` is chosen as the sweet spot between cluster quality and human readability. The resulting groups (e.g. Tablets, E-readers, Smart Speakers & Home, Accessories & Power, Streaming) give meaningful buckets to summarize within.

### 3. Review summarization (generative AI)
For each category, the pipeline first aggregates **hard facts** from reviews — average ratings, top products, and main complaint themes (KeyBERT with a TF-IDF fallback). Those structured facts are passed as JSON to an LLM (OpenAI) that writes a short recommendation article: top picks, key differences, main complaints, and the product to skip.

**Grounding is the critical design choice** — the model only sees real numbers and is explicitly forbidden from inventing products, specs, or complaints. If the API is unavailable, a template fallback keeps the pipeline from breaking. Generated articles are saved to `artifacts/articles/`.

---

## Results

Sentiment models evaluated on the same held-out test set (~9,300 reviews), judged on **macro-F1**:

| Model | Accuracy | Macro-F1 |
|---|---|---|
| Baseline (always predict positive) | 0.918 | 0.319 |
| Zero-shot `twitter-roberta` | 0.893 | 0.578 |
| Fine-tuned `distilbert` | 0.838 | 0.604 |
| Fine-tuned `bert-base` | 0.857 | 0.626 |
| Zero-shot `nlptown-multilingual` | 0.901 | 0.640 |
| Fine-tuned `roberta-base` (full) | 0.859 | 0.653 |
| **Fine-tuned `twitter-roberta` (LoRA)** | **0.884** | **0.655** |
| **Optimized LoRA (+ post-hoc tuning)** | — | **~0.70** |

The optimized LoRA model reaches **~0.70 macro-F1** — a large relative jump over the naive baseline, and it **beats a full fine-tune of `roberta-base`** at a fraction of the compute. Gains are concentrated exactly where they're needed: the rare negative and neutral classes.

Full per-class metrics are in `artifacts/classification_results.csv`; confusion matrices and training curves are in `artifacts/fig_*.png` and `cm_*.png`.

---

## Setup & how to run

### Requirements
Python 3.10+ and Jupyter. Key libraries:

```
transformers  datasets  peft  accelerate  torch
scikit-learn  pandas  numpy  matplotlib
keybert  sentence-transformers  openai
```

Install:

```bash
pip install transformers datasets peft accelerate torch \
            scikit-learn pandas numpy matplotlib \
            keybert sentence-transformers openai
```

### Data
Download the primary dataset — [Amazon Product Reviews (Datafiniti)](https://www.kaggle.com/datasets/datafiniti/consumer-reviews-of-amazon-products/data) — and point the notebook's data-load path at the CSV(s). (In this workspace the raw CSVs live in the `archive/` folder.)

### API key (stage 3 only)
Summarization calls the OpenAI API. Set your key before running stage 3:

```bash
export OPENAI_API_KEY="sk-..."
```

If no key is set, the summarizer falls back to a template so the rest of the pipeline still runs.

### Run
Open **`FINAL_MODEL.ipynb`** (or `FINAL_MODEL_min.ipynb` for the lean version) and run the cells top to bottom. The notebook is organized into clear sections:

1. Setup → Load & clean → Exploratory graphs
2. Split & class weights → Tokenize → LoRA model → Weighted-loss training
3. Evaluation, error analysis, and model comparison
4. **Part 2** — Product category clustering
5. **Part 3** — Review summarization (generative AI)

Trained models, figures, CSVs, and articles are written to `artifacts/`.

---

## Deployment (web app)

The `project-automated-customers-reviews/` folder contains a Django (ASGI) API with a Vite front end that surfaces all three components. To run the API:

```bash
cd ../project-automated-customers-reviews
pip install -r requirements.txt
python -m uvicorn config.asgi:application --reload
```

Front end lives in `web/` (`npm install` then `npm run dev`).

---

## Key takeaways

- **Match the metric to the problem.** Accuracy hid the imbalance; macro-F1 exposed it and drove every decision.
- **Efficient beat expensive.** LoRA + weighted loss outperformed a full fine-tune at a fraction of the compute.
- **The value is the full pipeline** — classify → cluster → summarize — turning a mountain of reviews into something actionable.
- **Ground generative AI in real data** and forbid it from inventing facts, so output is both fluent and trustworthy.

---

## Datasets

- **Primary:** [Amazon Product Reviews (Datafiniti)](https://www.kaggle.com/datasets/datafiniti/consumer-reviews-of-amazon-products/data)
- **Larger:** [Amazon Reviews Dataset (UCSD)](https://cseweb.ucsd.edu/~jmcauley/datasets.html#amazon_reviews)
