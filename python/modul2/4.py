
inventaris = []

def tambah_alat(nama, jumlah):
    data_alat = {
        "nama": nama,
        "jumlah": jumlah
    }
    inventaris.append(data_alat)

tambah_alat("Keyboard", 10)
tambah_alat("Mouse", 15)
tambah_alat("Monitor", 5)
tambah_alat("Gian", "AHmad")

print("Inventaris Lab RPL:")
for a in inventaris:
    print(f"Nama Alat: {a['nama']}, Jumlah: {a['jumlah']}")