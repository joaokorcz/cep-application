import csv
import os
import glob

files = glob.glob("*.csv")

for file in files:
    with open(file, "r") as source:
        lines = csv.reader(source)

        # splita o nome do arquivo e pega apenas as iniciais do estado
        # nomes possuem o padrao sp.cepaberto_parte1.csv
        state_initial = file.split('.')
        state_initial = state_initial[0]
        
        with open(f'{state_initial}.csv', "a") as result:
            writer = csv.writer(result)
            for columns in lines:
                writer.writerow((columns[0], columns[1], columns[3], columns[4], columns[5]))

    os.remove(file)