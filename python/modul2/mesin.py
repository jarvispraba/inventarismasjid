def hitung_pajak(harga_barang):
    pajak = harga_barang * 0.11
    return pajak

laptop = 5000000
pajak_laptop = hitung_pajak(laptop)

print()
print(f"Harga Laptop: Rp {laptop}")
print(f"Pajak PPN (11%): Rp {pajak_laptop}")
print(f"Total Bayar: Rp {laptop + pajak_laptop}")

def hitung_diskon (harga,persen):
    potongan = harga * (persen/100)
    return potongan

harga = 100000
persen = 20
potongan_harga = hitung_diskon (harga,persen)
    
print()
print (f"Harga : {harga}")
print (f"Diskon : {persen}%")
print (f"Potongan Harganya adalah : {potongan_harga}")

print()

potongan = hitung_diskon (harga,persen)
harga_diskon = harga - potongan
pajakan = hitung_pajak (harga_diskon)
total = harga_diskon + pajakan
print (f"Total harga adalah : {total}" )
