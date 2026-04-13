import pandas as pd

df = pd.read_csv('data_misi_mars.csv')
print(df.head())

print(df.describe())

print()

kondisi_kritis = df[df['oksigen'] < 20]
print("--- HARI KRITIS OKSIGEN ---")
print(kondisi_kritis)

print()

a = df.sort_values(by = 'bahan_bakar', ascending  = False)
print(a)