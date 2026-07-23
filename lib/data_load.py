import os
import zipfile
import pandas as pd
import urllib.request
from . import config

async def download_data(url, file_dir):
    os.makedirs(os.path.dirname(file_dir), exist_ok=True)
    return urllib.request.urlretrieve(url, file_dir)

async def unzip_data(file_dir, output_dir):
    with zipfile.ZipFile(file_dir, 'r') as zip_ref:
        zip_ref.extractall(output_dir)
        
def concat_files(files_dir):
    files_path = [f for f in os.listdir(files_dir)]
    frames = []

    for file_path in files_path:
        data = pd.read_csv(os.path.join(files_dir, file_path), low_memory=False)
        data["source_file"] = file_path
        frames.append(data)
        print(f"{file_path:<62} {data.shape[0]:>6,} rows")

    return pd.concat(frames, ignore_index=True)
    
async def load_data():
    await download_data(config.DOWNLOAD_URL, config.DOWNLOAD_FILE_DIR)
    await unzip_data(config.DOWNLOAD_FILE_DIR, config.EXTRACT_FILES_DIR)
    os.remove(config.DOWNLOAD_FILE_DIR)
    return concat_files(config.EXTRACT_FILES_DIR)