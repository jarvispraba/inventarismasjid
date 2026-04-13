handphone = {
    "merk": "Samsung",
    "model": "S23 Ultra",
    "ram": "12GB",
    "stok": 5,
    "warna" : "Phantom Black",

}

# Mengakses data
print(f"Smartphone: {handphone['merk']} {handphone['model']}")

# Mengupdate stok
handphone["stok"] = 4

print (f"Warna Hp :  {handphone['warna']} & Stok HP : {handphone['stok']}")
