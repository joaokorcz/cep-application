import csv
import os
import glob

files = glob.glob("*.csv")

for file in files:
    with open(file, "r") as source:
        lines = csv.reader(source)
        
        with open('all_ceps.csv', "a") as result:
            writer = csv.writer(result)
            for columns in lines:
                writer.writerow((columns[0], columns[1], columns[3], columns[4], columns[5]))

    os.remove(file)