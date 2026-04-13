import pandas as pd
import matplotlib.pyplot as plt

# 1. Load Data
df = pd.read_csv('data_misi_mars.csv')

# 2. Membuat Grafik
plt.figure(figsize=(12, 6))
plt.plot(df['hari'], df['oksigen'], color='blue', marker='o', linestyle='-', label='Kadar Oksigen')

# 3. Kustomisasi (PENTING!)
plt.title('Laporan Kadar Oksigen - Misi Mars (30 Hari)', fontsize=14)
plt.xlabel('Hari Ke-', fontsize=12)
plt.ylabel('Persentase Oksigen (%)', fontsize=12)
plt.grid(True, linestyle='--', alpha=0.7)
plt.legend()

# 4. Tampilkan
plt.show()

# 1. Menghitung statistik suhu
suhu_rata = df['suhu'].mean()
suhu_max = df['suhu'].max()

# 2. Menyiapkan Data Grafik
label_grafik = ['Rata-rata Suhu', 'Suhu Maksimum']
nilai_grafik = [suhu_rata, suhu_max]

# 3. Membuat Bar Chart
plt.bar(label_grafik, nilai_grafik, color=['green', 'red'])
plt.title('Analisis Perbandingan Suhu Kabin')
plt.ylabel('Suhu (Celcius)')
plt.show()

