// ========================================
// KONFIGURASI API
// ========================================
// GANTI URL INI DENGAN WEB APP URL DARI GOOGLE APPS SCRIPT ANDA
const API_URL = "https://script.google.com/macros/s/AKfycbwDMna9Cc344_VFKBnKmvTX_GasM0C2R44IMOj0jrurRRyd9zfiw5usuzscsL2nCkSaIw/exec";

// GANTI DENGAN ID SPREADSHEET ANDA
const SPREADSHEET_ID = "1Qa9MiACzDGXpnor2JUlLNQk8-YtGvO8Xc3ssHlVbpDo";

// ========================================
// STATE MANAGEMENT
// ========================================
let allData = [];
let filteredData = [];

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // Load data saat halaman pertama kali dibuka
    loadData();
    
    // Setup event listeners
    setupEventListeners();
});

function setupEventListeners() {
    // Form tambah barang
    document.getElementById('formTambah').addEventListener('submit', handleTambahBarang);
    
    // Form edit barang
    document.getElementById('formEdit').addEventListener('submit', handleEditBarang);
    
    // Search dan filter
    document.getElementById('searchInput').addEventListener('input', applyFilters);
    document.getElementById('filterKondisi').addEventListener('change', applyFilters);
}

// ========================================
// NAVIGATION
// ========================================
function showSection(sectionName) {
    // Hide semua section
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show section yang dipilih
    document.getElementById(sectionName).classList.remove('hidden');
    
    // Update button style
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('bg-green-600', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-700');
    });
    
    // Highlight button yang aktif
    const activeBtn = document.querySelector(`button[onclick="showSection('${sectionName}')"]`);
    if (activeBtn) {
        activeBtn.classList.remove('bg-gray-200', 'text-gray-700');
        activeBtn.classList.add('bg-green-600', 'text-white');
    }
    
    // Load data jika membuka section data
    if (sectionName === 'data') {
        loadData();
    }
}

// ========================================
// LOAD DATA FROM GOOGLE SPREADSHEET
// ========================================
async function loadData() {
    try {
        console.log('=== LOADING DATA ===');
        console.log('API URL:', API_URL);
        
        showNotification('Memuat data dari Google Spreadsheet...', 'info');
        
        const response = await fetch(API_URL, {
            method: 'GET',
            redirect: 'follow'
        });
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (!response.ok) {
            throw new Error('Gagal mengambil data dari server');
        }
        
        const result = await response.json();
        console.log('Result:', result);
        console.log('Data count:', result.data ? result.data.length : 0);
        
        if (result.status === 'success') {
            allData = result.data || [];
            filteredData = [...allData];
            
            console.log('All data loaded:', allData.length, 'items');
            
            renderTable();
            updateDashboard();
            showNotification(`✅ Data dimuat: ${allData.length} barang`, 'success');
        } else {
            throw new Error(result.message || 'Gagal memuat data');
        }
    } catch (error) {
        console.error('ERROR loading data:', error);
        showNotification('❌ Gagal memuat data: ' + error.message, 'error');
        
        // Tampilkan pesan di tabel
        const tbody = document.getElementById('tableBody');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" class="px-4 py-8 text-center text-red-500 text-lg">
                        ❌ Gagal memuat data dari Google Spreadsheet<br>
                        <small class="text-gray-600">${error.message}</small>
                    </td>
                </tr>
            `;
        }
    }
}

// ========================================
// RENDER TABLE
// ========================================
function renderTable() {
    const tbody = document.getElementById('tableBody');
    
    if (filteredData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="px-4 py-8 text-center text-gray-500 text-lg">
                    Tidak ada data
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = filteredData.map(item => `
        <tr class="hover:bg-gray-50">
            <td class="px-4 py-3 text-base">${item.id_barang}</td>
            <td class="px-4 py-3 text-base font-semibold">${item.nama_barang}</td>
            <td class="px-4 py-3 text-base">${item.kategori}</td>
            <td class="px-4 py-3 text-base">${item.sub_kategori || '-'}</td>
            <td class="px-4 py-3 text-base font-bold">${item.jumlah}</td>
            <td class="px-4 py-3 text-base">${getKondisiBadge(item.kondisi)}</td>
            <td class="px-4 py-3 text-base">${getStatusBadge(item.status)}</td>
            <td class="px-4 py-3 text-base">${item.lokasi}</td>
            <td class="px-4 py-3 text-center">
                <button onclick='openEditModal(${JSON.stringify(item)})' 
                    class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mr-2 text-base font-semibold">
                    ✏️ Edit
                </button>
                <button onclick="deleteBarang('${item.id_barang}', ${item.rowIndex})" 
                    class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-base font-semibold">
                    🗑️ Hapus
                </button>
            </td>
        </tr>
    `).join('');
}

// ========================================
// BADGE HELPERS
// ========================================
function getKondisiBadge(kondisi) {
    const badges = {
        'Baik': '<span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">✅ Baik</span>',
        'Perlu Perbaikan': '<span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">⚠️ Perlu Perbaikan</span>',
        'Rusak': '<span class="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">❌ Rusak</span>'
    };
    return badges[kondisi] || kondisi;
}

function getStatusBadge(status) {
    const badges = {
        'Tersedia': '<span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">✔️ Tersedia</span>',
        'Perbaikan': '<span class="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">🔧 Perbaikan</span>',
        'Tidak Ada': '<span class="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">⛔ Tidak Ada</span>'
    };
    return badges[status] || status;
}

// ========================================
// UPDATE DASHBOARD
// ========================================
function updateDashboard() {
    const totalBarang = allData.length;
    const kondisiBaik = allData.filter(item => item.kondisi === 'Baik').length;
    const perluPerbaikan = allData.filter(item => item.kondisi === 'Perlu Perbaikan').length;
    const barangRusak = allData.filter(item => item.kondisi === 'Rusak').length;
    
    document.getElementById('totalBarang').textContent = totalBarang;
    document.getElementById('kondisiBaik').textContent = kondisiBaik;
    document.getElementById('perluPerbaikan').textContent = perluPerbaikan;
    document.getElementById('barangRusak').textContent = barangRusak;
}

// ========================================
// FILTER & SEARCH
// ========================================
function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const kondisiFilter = document.getElementById('filterKondisi').value;
    
    filteredData = allData.filter(item => {
        const matchSearch = item.nama_barang.toLowerCase().includes(searchTerm);
        const matchKondisi = !kondisiFilter || item.kondisi === kondisiFilter;
        
        return matchSearch && matchKondisi;
    });
    
    renderTable();
}

// ========================================
// TAMBAH BARANG
// ========================================
async function handleTambahBarang(e) {
    e.preventDefault();
    
    const formData = {
        id_barang: document.getElementById('idBarang').value.trim(),
        nama_barang: document.getElementById('namaBarang').value.trim(),
        kategori: document.getElementById('kategori').value,
        sub_kategori: document.getElementById('subKategori').value.trim(),
        jumlah: parseInt(document.getElementById('jumlah').value),
        kondisi: document.getElementById('kondisi').value,
        status: document.getElementById('status').value,
        lokasi: document.getElementById('lokasi').value
    };
    
    console.log('=== TAMBAH BARANG ===');
    console.log('Form Data:', formData);
    
    // Validasi
    if (!formData.id_barang || !formData.nama_barang || !formData.kategori || 
        !formData.kondisi || !formData.status || !formData.lokasi) {
        showNotification('Mohon lengkapi semua field yang wajib diisi', 'error');
        return;
    }
    
    // Check duplicate ID
    const isDuplicate = allData.some(item => item.id_barang === formData.id_barang);
    if (isDuplicate) {
        showNotification('ID Barang sudah ada! Gunakan ID yang berbeda.', 'error');
        return;
    }
    
    try {
        showNotification('Menyimpan data ke Google Spreadsheet...', 'info');
        
        // Buat URL dengan parameter
        const params = new URLSearchParams({
            action: 'add',
            data: JSON.stringify(formData)
        });
        
        const url = `${API_URL}?${params.toString()}`;
        console.log('Request URL:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            redirect: 'follow'
        });
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Result:', result);
        
        if (result.status === 'success') {
            showNotification('✅ Data berhasil disimpan ke Google Spreadsheet!', 'success');
            document.getElementById('formTambah').reset();
            
            // Tunggu 2 detik lalu reload data
            console.log('Waiting 2 seconds before reloading...');
            setTimeout(() => {
                console.log('Reloading data...');
                loadData();
            }, 2000);
        } else {
            throw new Error(result.message || 'Gagal menambahkan data');
        }
    } catch (error) {
        console.error('ERROR adding data:', error);
        showNotification('❌ Gagal menyimpan: ' + error.message, 'error');
    }
}

// ========================================
// EDIT BARANG
// ========================================
function openEditModal(item) {
    document.getElementById('editRowIndex').value = item.rowIndex;
    document.getElementById('editIdBarang').value = item.id_barang;
    document.getElementById('editNamaBarang').value = item.nama_barang;
    document.getElementById('editKategori').value = item.kategori;
    document.getElementById('editSubKategori').value = item.sub_kategori || '';
    document.getElementById('editJumlah').value = item.jumlah;
    document.getElementById('editKondisi').value = item.kondisi;
    document.getElementById('editStatus').value = item.status;
    document.getElementById('editLokasi').value = item.lokasi;
    
    document.getElementById('modalEdit').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modalEdit').classList.add('hidden');
}

async function handleEditBarang(e) {
    e.preventDefault();
    
    const rowIndex = parseInt(document.getElementById('editRowIndex').value);
    const formData = {
        id_barang: document.getElementById('editIdBarang').value.trim(),
        nama_barang: document.getElementById('editNamaBarang').value.trim(),
        kategori: document.getElementById('editKategori').value,
        sub_kategori: document.getElementById('editSubKategori').value.trim(),
        jumlah: parseInt(document.getElementById('editJumlah').value),
        kondisi: document.getElementById('editKondisi').value,
        status: document.getElementById('editStatus').value,
        lokasi: document.getElementById('editLokasi').value
    };
    
    try {
        showNotification('Mengupdate data...', 'info');
        
        const urlWithParams = `${API_URL}?action=update&rowIndex=${rowIndex}&data=${encodeURIComponent(JSON.stringify(formData))}`;
        
        const response = await fetch(urlWithParams, {
            method: 'GET',
            redirect: 'follow'
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            showNotification('Data berhasil diupdate!', 'success');
            closeModal();
            setTimeout(() => {
                loadData();
            }, 1000);
        } else {
            throw new Error(result.message || 'Gagal mengupdate data');
        }
    } catch (error) {
        console.error('Error updating data:', error);
        showNotification('Gagal mengupdate data: ' + error.message, 'error');
    }
}

// ========================================
// DELETE BARANG
// ========================================
async function deleteBarang(idBarang, rowIndex) {
    if (!confirm(`Apakah yakin ingin menghapus barang "${idBarang}"?`)) {
        return;
    }
    
    try {
        showNotification('Menghapus data...', 'info');
        
        const urlWithParams = `${API_URL}?action=delete&rowIndex=${rowIndex}&id_barang=${encodeURIComponent(idBarang)}`;
        
        const response = await fetch(urlWithParams, {
            method: 'GET',
            redirect: 'follow'
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            showNotification('Data berhasil dihapus!', 'success');
            setTimeout(() => {
                loadData();
            }, 1000);
        } else {
            throw new Error(result.message || 'Gagal menghapus data');
        }
    } catch (error) {
        console.error('Error deleting data:', error);
        showNotification('Gagal menghapus data: ' + error.message, 'error');
    }
}

// ========================================
// EXPORT CSV
// ========================================
function exportToCSV() {
    if (filteredData.length === 0) {
        showNotification('Tidak ada data untuk diexport', 'error');
        return;
    }
    
    const headers = ['ID Barang', 'Nama Barang', 'Kategori', 'Sub Kategori', 'Jumlah', 'Kondisi', 'Status', 'Lokasi'];
    const csvContent = [
        headers.join(','),
        ...filteredData.map(item => [
            item.id_barang,
            `"${item.nama_barang}"`,
            item.kategori,
            item.sub_kategori || '',
            item.jumlah,
            item.kondisi,
            item.status,
            item.lokasi
        ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `inventaris_masjid_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Data berhasil diexport ke CSV', 'success');
}

// ========================================
// OPEN SPREADSHEET
// ========================================
function openSpreadsheet() {
    const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`;
    window.open(spreadsheetUrl, '_blank');
    showNotification('Membuka Google Spreadsheet...', 'info');
}

// ========================================
// NOTIFICATION
// ========================================
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    
    // Set color based on type
    notification.classList.remove('bg-green-600', 'bg-red-600', 'bg-blue-600');
    if (type === 'error') {
        notification.classList.add('bg-red-600');
    } else if (type === 'info') {
        notification.classList.add('bg-blue-600');
    } else {
        notification.classList.add('bg-green-600');
    }
    
    notification.classList.remove('hidden');
    
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}
