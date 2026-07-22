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


def clean_punctuation_stopwords(entries: pd.Series) -> pd.Series:
    return entries.apply(
        lambda sentence: " ".join(
            [
                word
                for word in word_tokenize(sentence)
                if word not in string.punctuation and word.lower() not in stopwords_en
            ]
        )
    )


def clean_blanks(entries: pd.Series) -> pd.Series:
    return entries.apply(
        lambda sentence: re.sub(r"\s(?=\s)", "", sentence.rstrip(",").strip())
    )


def data_frame_preprocessing(df: pd.DataFrame, columns_names: list) -> pd.DataFrame:
    df[columns_names] = df[columns_names].apply(
        lambda value: pipe([clean_blanks, clean_punctuation_stopwords], value)
    )
    return df


def rating_to_sentiment(rating: float) -> str:
    if rating == 3:
        return "neutral"
    elif rating < 3:
        return "negative"
    return "positive"
