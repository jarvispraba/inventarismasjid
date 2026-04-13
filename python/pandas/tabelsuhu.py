import pandas as pd
import matplotlib.pyplot as plt

# 1. Load Data
df = pd.read_csv('data_misi_mars.csv')



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

