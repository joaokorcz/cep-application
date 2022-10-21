#!/bin/bash
curl -L -o "ceps.zip" "https://www.dropbox.com/s/g6o2j8hw4so6h41/CEPS.zip?dl=1"

echo "unzipping..."
python3 unzip.py
cd ceps/
echo "parsering..."
python3 ../parser.py
