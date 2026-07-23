import os

DATASETS_DIR = './sample_data'
DOWNLOAD_URL = 'https://www.kaggle.com/api/v1/datasets/download/datafiniti/consumer-reviews-of-amazon-products'
DOWNLOAD_FILE_NAME = 'consumer-reviews-of-amazon-products'
DOWNLOAD_FILE_EXTENSION = 'zip'
DOWNLOAD_FILE = '.'.join([DOWNLOAD_FILE_NAME, DOWNLOAD_FILE_EXTENSION])
EXTRACT_FILES_DIR = os.path.join(DATASETS_DIR, DOWNLOAD_FILE_NAME)
DOWNLOAD_FILE_DIR = os.path.join(DATASETS_DIR, DOWNLOAD_FILE)