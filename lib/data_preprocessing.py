import re
import string
import nltk
import pandas as pd
from nltk import word_tokenize
from nltk.corpus import stopwords
from functools import reduce

nltk.download("punkt")
nltk.download("punkt_tab")
nltk.download("stopwords")

stopwords_en = set(stopwords.words("english"))


def pipe(fns, initial_value):
    return reduce(lambda input, fn: fn(input), fns, initial_value)

def clean_punctuation_stopwords_sentence(sentence: str) -> str:
    return " ".join(
        [
            word
            for word in word_tokenize(sentence)
            if word not in string.punctuation and word.lower() not in stopwords_en
        ]
    )

def clean_punctuation_stopwords(entries: pd.Series) -> pd.Series:
    return entries.apply(clean_punctuation_stopwords_sentence)

def clean_blanks_sentence(sentence: str) -> str:
    return re.sub(r"\s(?=\s)", "", sentence.rstrip(",").strip())

def clean_blanks(entries: pd.Series) -> pd.Series:
    return entries.apply(clean_blanks_sentence)
    
def clean_pipe_preprocessing(value):
    return pipe([clean_blanks, clean_punctuation_stopwords], value)

def clean_sentence_preprocessing(value):
    return pipe([clean_blanks_sentence, clean_punctuation_stopwords_sentence], value)

def data_frame_preprocessing(df: pd.DataFrame, columns_names: list) -> pd.DataFrame:
    df[columns_names] = df[columns_names].apply(clean_pipe_preprocessing)
    return df


def rating_to_sentiment(rating: float) -> str:
    if rating == 3:
        return "neutral"
    elif rating < 3:
        return "negative"
    return "positive"
