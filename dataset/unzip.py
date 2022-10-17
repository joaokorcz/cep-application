import zipfile
import os

with zipfile.ZipFile('ceps.zip','r') as zip_ref:
    zip_ref.extractall('./')
    
os.remove('ceps.zip')