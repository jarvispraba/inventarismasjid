import pandas as pd
import matplotlib.pyplot as plt

# 1. Load Data
df = pd.read_csv('data_misi_mars.csv')

# 2. Cleaning Data
# Hapus baris dengan bahan_bakar > 10000
df_bersih = df[df['bahan_bakar'] <= 10000]

# 3. Membuat Grafik
plt.figure(figsize=(12,6))
plt.plot(df_bersih['hari'], 
         df_bersih['bahan_bakar'], 
         color='orange', 
         marker='o', 
         linestyle=':',
         label='Kadar Bahan Bakar')

# 4. Kustomisasi
plt.title('Laporan Bahan Bakar - Misi Mars (Data Bersih)', fontsize=14)
plt.xlabel('Hari Ke-', fontsize=12)
plt.ylabel('Jumlah Bahan Bakar', fontsize=12)
plt.grid(True, linestyle='--', alpha=0.7)
plt.legend()

# 5. Tampilkan
plt.show()


