nama = input("Masukkan nama barang : ")
harga = float(input("Masukkan harga satuan : "))
jumlah = int(input("Masukkan jumlah beli : "))
diskon = 10 

subtotal = harga * jumlah
potonganharga = subtotal * (diskon / 100)
totalpajak = subtotal - potonganharga
ppn = totalpajak * 0.11
total = totalpajak + ppn

print()
print("========== STRUK BELANJA ==========")
print(f"Nama Barang        : {nama}")
print(f"Harga Satuan       : Rp {harga:}")
print(f"Jumlah Beli        : {jumlah}")
print("----------------------------------")
print(f"Subtotal           : Rp {subtotal:}")
print(f"Diskon ({diskon}%)       : -Rp {potonganharga:}")
print(f"Total Sebelum Pajak: Rp {totalpajak:}")
print(f"PPN 11%            : Rp {ppn:}")
print("----------------------------------")
print(f"TOTAL AKHIR        : Rp {total:}")
print("==================================")