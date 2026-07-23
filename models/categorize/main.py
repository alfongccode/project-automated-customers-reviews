import os
import joblib
from scipy.sparse import hstack
from django.conf import settings
from lib.data_preprocessing import clean_sentence_preprocessing

ARTIFACT_PATH = os.path.join(settings.BASE_DIR, 'models', 'product_category_classifier.joblib')
artifact = joblib.load(ARTIFACT_PATH)

def get_product_classification(product):
    x_name = artifact['vec_name'].transform([clean_sentence_preprocessing(product['name'])])
    x_tags = artifact['vec_tags'].transform([clean_sentence_preprocessing(product['tags'])])
    x_new = hstack([x_name * 2.0, x_tags * 1.0])
    cluster = artifact['kmeans'].predict(x_new)[0]

    return artifact['CLUSTERS_LABELS'][str(cluster)]
