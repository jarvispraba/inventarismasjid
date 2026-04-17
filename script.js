// ── CONFIG ──────────────────────────────────────────────────
const API_URL = "https://script.google.com/macros/s/AKfycbwDMna9Cc344_VFKBnKmvTX_GasM0C2R44IMOj0jrurRRyd9zfiw5usuzscsL2nCkSaIw/exec";
const SPREADSHEET_ID = "1Qa9MiACzDGXpnor2JUlLNQk8-YtGvO8Xc3ssHlVbpDo";

// ── STATE ────────────────────────────────────────────────────
let allData = [], filteredData = [], activeFilter = '';

// ── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    document.getElementById('formTambah').addEventListener('submit', handleTambah);
    document.getElementById('formEdit').addEventListener('submit', handleEdit);
    document.getElementById('searchInput').addEventListener('input', applyFilter);
    // Desktop search
    const ds = document.getElementById('searchInputDesktop');
    if (ds) ds.addEventListener('input', () => {
        document.getElementById('searchInput').value = ds.value;
        applyFilter();
    });
});

// ── NAVIGASI ─────────────────────────────────────────────────
function goTo(page) {
    closeAllSheets();
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + page).classList.add('active');

    // Mobile nav labels
    const nh = document.getElementById('nav-home');
    const nd = document.getElementById('nav-data');
    if (nh) nh.querySelector('span:last-child').style.color = page === 'home' ? '#16a34a' : '#9ca3af';
    if (nd) nd.querySelector('span:last-child').style.color = page === 'data' ? '#16a34a' : '#9ca3af';

    // Sidebar links
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const sl = document.getElementById('sl-' + page);
    if (sl) sl.classList.add('active');

    window.scrollTo(0, 0);
    if (page === 'data') loadData();
}

// ── SHEET ────────────────────────────────────────────────────
function openSheet(name) {
    closeAllSheets();
    document.getElementById('overlay').style.display = 'block';
    setTimeout(() => document.getElementById('sheet-' + name).classList.add('open'), 10);
}

function closeAllSheets() {
    document.querySelectorAll('.sheet').forEach(s => s.classList.remove('open'));
    document.getElementById('overlay').style.display = 'none';
}

// ── OPTION PICKER ────────────────────────────────────────────
function pickOpt(fieldId, btn, value) {
    document.getElementById(fieldId).value = value;
    btn.parentElement.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
}

// ── LOAD DATA ────────────────────────────────────────────────
async function loadData() {
    try {
        const res = await fetch(API_URL, { method: 'GET', redirect: 'follow' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const result = await res.json();
        if (result.status === 'success') {
            allData = result.data || [];
            filteredData = [...allData];
            renderAll();
        } else throw new Error(result.message || 'Gagal memuat');
    } catch (err) {
        showToast('Gagal memuat data: ' + err.message, 'error');
        document.getElementById('dataList').innerHTML = errCard(err.message);
        const tb = document.getElementById('tableBody');
        if (tb) tb.innerHTML = `<tr><td colspan="9" class="px-4 py-8 text-center text-red-400 text-sm">${err.message}</td></tr>`;
    }
}

function renderAll() {
    renderCards();
    renderTable();
    renderRecent();
    updateStats();
    document.getElementById('itemCount').textContent = filteredData.length + ' barang ditemukan';
}

// ── RENDER CARDS (Mobile) ────────────────────────────────────
function renderCards() {
    const list = document.getElementById('dataList');
    if (!list) return;
    if (filteredData.length === 0) {
        list.innerHTML = `<div class="bg-white rounded-2xl p-10 text-center shadow-sm"><div class="text-4xl mb-3">📭</div><p class="text-gray-500 font-semibold">Tidak ada data</p></div>`;
        return;
    }
    list.innerHTML = filteredData.map(item => `
        <div class="bg-white rounded-2xl p-4 shadow-sm">
            <div class="flex items-start justify-between mb-2">
                <div class="flex-1 min-w-0 mr-3">
                    <p class="font-bold text-gray-800 truncate">${item.nama_barang}</p>
                    <p class="text-xs text-gray-400 mt-0.5">${item.id_barang} · ${item.kategori}</p>
                </div>
                ${bKondisi(item.kondisi)}
            </div>
            <div class="flex flex-wrap gap-2 mb-3">
                <span class="bg-gray-100 px-2.5 py-1 rounded-lg text-xs font-semibold text-gray-600">Jml: ${item.jumlah}</span>
                <span class="bg-gray-100 px-2.5 py-1 rounded-lg text-xs font-semibold text-gray-600">📍 ${item.lokasi}</span>
                ${bStatus(item.status)}
            </div>
            <div class="flex gap-2 pt-2 border-t border-gray-50">
                <button onclick='openEditModal(${JSON.stringify(item)})' class="flex-1 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold">✏️ Edit</button>
                <button onclick="hapus('${item.id_barang}',${item.rowIndex})" class="flex-1 py-2 bg-red-50 text-red-500 rounded-xl text-sm font-bold">🗑️ Hapus</button>
            </div>
        </div>`).join('');
}

// ── RENDER TABLE (Desktop) ───────────────────────────────────
function renderTable() {
    const tb = document.getElementById('tableBody');
    if (!tb) return;
    if (filteredData.length === 0) {
        tb.innerHTML = `<tr><td colspan="9" class="px-4 py-10 text-center text-gray-400">Tidak ada data</td></tr>`;
        return;
    }
    tb.innerHTML = filteredData.map(item => `
        <tr class="hover:bg-gray-50 transition">
            <td class="px-4 py-3 text-sm font-mono text-gray-600">${item.id_barang}</td>
            <td class="px-4 py-3 text-sm font-semibold text-gray-800">${item.nama_barang}</td>
            <td class="px-4 py-3 text-sm text-gray-600">${item.kategori}</td>
            <td class="px-4 py-3 text-sm text-gray-500">${item.sub_kategori || '-'}</td>
            <td class="px-4 py-3 text-sm font-bold text-gray-800">${item.jumlah}</td>
            <td class="px-4 py-3">${bKondisi(item.kondisi)}</td>
            <td class="px-4 py-3">${bStatus(item.status)}</td>
            <td class="px-4 py-3 text-sm text-gray-600">${item.lokasi}</td>
            <td class="px-4 py-3 text-center">
                <button onclick='openEditModal(${JSON.stringify(item)})' class="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold mr-1 hover:bg-blue-100">✏️ Edit</button>
                <button onclick="hapus('${item.id_barang}',${item.rowIndex})" class="px-3 py-1.5 bg-red-50 text-red-500 rounded-lg text-xs font-bold hover:bg-red-100">🗑️ Hapus</button>
            </td>
        </tr>`).join('');
}

// ── RENDER RECENT ────────────────────────────────────────────
function renderRecent() {
    const el = document.getElementById('recentItems');
    const recent = allData.slice(-5).reverse();
    if (!recent.length) {
        el.innerHTML = `<div class="text-center py-8 text-gray-400"><div class="text-4xl mb-2">📭</div><p class="text-sm">Belum ada data</p></div>`;
        return;
    }
    el.innerHTML = recent.map(item => `
        <div class="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
            <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">${ikonKat(item.kategori)}</div>
            <div class="flex-1 min-w-0">
                <p class="font-semibold text-gray-800 text-sm truncate">${item.nama_barang}</p>
                <p class="text-xs text-gray-400">${item.kategori} · ${item.lokasi}</p>
            </div>
            ${bKondisi(item.kondisi)}
        </div>`).join('');
}

// ── STATS ────────────────────────────────────────────────────
function updateStats() {
    document.getElementById('totalBarang').textContent = allData.length;
    document.getElementById('kondisiBaik').textContent = allData.filter(i => i.kondisi === 'Baik').length;
    document.getElementById('perluPerbaikan').textContent = allData.filter(i => i.kondisi === 'Perlu Perbaikan').length;
    document.getElementById('barangRusak').textContent = allData.filter(i => i.kondisi === 'Rusak').length;
}

// ── FILTER ───────────────────────────────────────────────────
function setFilter(btn) {
    activeFilter = btn.dataset.val;
    document.querySelectorAll('.filter-chip').forEach(c => {
        c.classList.remove('bg-green-600', 'text-white');
        c.classList.add('bg-gray-200', 'text-gray-600');
    });
    btn.classList.add('bg-green-600', 'text-white');
    btn.classList.remove('bg-gray-200', 'text-gray-600');
    applyFilter();
}

function setFilterD(btn) {
    activeFilter = btn.dataset.val;
    document.querySelectorAll('.filter-chip-d').forEach(c => {
        c.classList.remove('bg-green-600', 'text-white');
        c.classList.add('bg-gray-100', 'text-gray-600');
    });
    btn.classList.add('bg-green-600', 'text-white');
    btn.classList.remove('bg-gray-100', 'text-gray-600');
    applyFilter();
}

function applyFilter() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    filteredData = allData.filter(i =>
        (i.nama_barang.toLowerCase().includes(q) || i.id_barang.toLowerCase().includes(q)) &&
        (!activeFilter || i.kondisi === activeFilter)
    );
    renderCards();
    renderTable();
    document.getElementById('itemCount').textContent = filteredData.length + ' barang ditemukan';
}

// ── TAMBAH ───────────────────────────────────────────────────
async function handleTambah(e) {
    e.preventDefault();
    const data = {
        id_barang: document.getElementById('idBarang').value.trim(),
        nama_barang: document.getElementById('namaBarang').value.trim(),
        kategori: document.getElementById('kategori').value,
        sub_kategori: document.getElementById('subKategori').value.trim(),
        jumlah: parseInt(document.getElementById('jumlah').value),
        kondisi: document.getElementById('kondisi').value,
        status: document.getElementById('status').value,
        lokasi: document.getElementById('lokasi').value
    };
    if (!data.id_barang || !data.nama_barang || !data.kategori || !data.kondisi || !data.status || !data.lokasi) {
        showToast('Lengkapi semua field wajib', 'error'); return;
    }
    if (allData.some(i => i.id_barang === data.id_barang)) {
        showToast('ID Barang sudah ada!', 'error'); return;
    }
    try {
        showToast('Menyimpan...', 'info');
        const params = new URLSearchParams({ action: 'add', data: JSON.stringify(data) });
        const res = await fetch(`${API_URL}?${params}`, { method: 'GET', redirect: 'follow' });
        const result = await res.json();
        if (result.status === 'success') {
            showToast('✅ Data berhasil disimpan!', 'success');
            document.getElementById('formTambah').reset();
            document.querySelectorAll('#sheet-tambah .opt-btn').forEach(b => b.classList.remove('on'));
            document.getElementById('kondisi').value = '';
            document.getElementById('status').value = '';
            closeAllSheets();
            setTimeout(loadData, 1500);
        } else throw new Error(result.message);
    } catch (err) { showToast('❌ Gagal: ' + err.message, 'error'); }
}

// ── EDIT ─────────────────────────────────────────────────────
function openEditModal(item) {
    document.getElementById('editRowIndex').value = item.rowIndex;
    document.getElementById('editIdBarang').value = item.id_barang;
    document.getElementById('editIdBarangDisplay').textContent = item.id_barang;
    document.getElementById('editNamaBarang').value = item.nama_barang;
    document.getElementById('editKategori').value = item.kategori;
    document.getElementById('editSubKategori').value = item.sub_kategori || '';
    document.getElementById('editJumlah').value = item.jumlah;
    document.getElementById('editKondisi').value = item.kondisi;
    document.getElementById('editStatus').value = item.status;
    document.getElementById('editLokasi').value = item.lokasi;

    document.querySelectorAll('#editKondisiPicker .opt-btn').forEach(b =>
        b.classList.toggle('on', b.textContent.includes(item.kondisi === 'Perlu Perbaikan' ? 'Perbaikan' : item.kondisi))
    );
    document.querySelectorAll('#editStatusPicker .opt-btn').forEach(b =>
        b.classList.toggle('on', b.textContent.includes(item.status))
    );
    openSheet('edit');
}

async function handleEdit(e) {
    e.preventDefault();
    const rowIndex = parseInt(document.getElementById('editRowIndex').value);
    const data = {
        id_barang: document.getElementById('editIdBarang').value,
        nama_barang: document.getElementById('editNamaBarang').value.trim(),
        kategori: document.getElementById('editKategori').value,
        sub_kategori: document.getElementById('editSubKategori').value.trim(),
        jumlah: parseInt(document.getElementById('editJumlah').value),
        kondisi: document.getElementById('editKondisi').value,
        status: document.getElementById('editStatus').value,
        lokasi: document.getElementById('editLokasi').value
    };
    try {
        showToast('Mengupdate...', 'info');
        const url = `${API_URL}?action=update&rowIndex=${rowIndex}&data=${encodeURIComponent(JSON.stringify(data))}`;
        const res = await fetch(url, { method: 'GET', redirect: 'follow' });
        const result = await res.json();
        if (result.status === 'success') {
            showToast('✅ Berhasil diupdate!', 'success');
            closeAllSheets();
            setTimeout(loadData, 1000);
        } else throw new Error(result.message);
    } catch (err) { showToast('❌ Gagal: ' + err.message, 'error'); }
}

// ── HAPUS ────────────────────────────────────────────────────
async function hapus(idBarang, rowIndex) {
    if (!confirm(`Hapus barang "${idBarang}"?`)) return;
    try {
        showToast('Menghapus...', 'info');
        const url = `${API_URL}?action=delete&rowIndex=${rowIndex}&id_barang=${encodeURIComponent(idBarang)}`;
        const res = await fetch(url, { method: 'GET', redirect: 'follow' });
        const result = await res.json();
        if (result.status === 'success') {
            showToast('✅ Berhasil dihapus!', 'success');
            setTimeout(loadData, 1000);
        } else throw new Error(result.message);
    } catch (err) { showToast('❌ Gagal: ' + err.message, 'error'); }
}

// ── EXPORT CSV ───────────────────────────────────────────────
function exportToCSV() {
    if (!filteredData.length) { showToast('Tidak ada data', 'error'); return; }
    const h = ['ID Barang','Nama Barang','Kategori','Sub Kategori','Jumlah','Kondisi','Status','Lokasi'];
    const csv = [h.join(','), ...filteredData.map(i =>
        [i.id_barang,`"${i.nama_barang}"`,i.kategori,i.sub_kategori||'',i.jumlah,i.kondisi,i.status,i.lokasi].join(',')
    )].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    a.download = `inventaris_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showToast('📥 Berhasil diexport!', 'success');
}

function openSpreadsheet() {
    window.open(`https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`, '_blank');
}

// ── BADGE HELPERS ────────────────────────────────────────────
function bKondisi(k) {
    const m = { 'Baik':['bg-green-100','text-green-700','✅'], 'Perlu Perbaikan':['bg-yellow-100','text-yellow-700','⚠️'], 'Rusak':['bg-red-100','text-red-600','❌'] };
    const [bg,tc,ic] = m[k] || ['bg-gray-100','text-gray-600',''];
    return `<span class="inline-flex items-center gap-1 px-2.5 py-1 ${bg} ${tc} rounded-lg text-xs font-bold whitespace-nowrap">${ic} ${k}</span>`;
}
function bStatus(s) {
    const m = { 'Tersedia':['bg-blue-100','text-blue-700'], 'Perbaikan':['bg-orange-100','text-orange-700'], 'Tidak Ada':['bg-gray-100','text-gray-600'] };
    const [bg,tc] = m[s] || ['bg-gray-100','text-gray-600'];
    return `<span class="inline-flex px-2.5 py-1 ${bg} ${tc} rounded-lg text-xs font-bold whitespace-nowrap">${s}</span>`;
}
function ikonKat(k) {
    return {'Alat Sound':'🔊','Elektronik':'⚡','Peralatan Kebersihan':'🧹','Peralatan Ibadah':'🕌','Perabotan':'🪑'}[k] || '📦';
}
function errCard(msg) {
    return `<div class="bg-white rounded-2xl p-10 text-center shadow-sm"><div class="text-4xl mb-3">❌</div><p class="text-red-500 font-semibold mb-1">Gagal memuat data</p><p class="text-gray-400 text-sm mb-4">${msg}</p><button onclick="loadData()" class="px-5 py-2 bg-green-600 text-white rounded-xl text-sm font-bold">Coba Lagi</button></div>`;
}

// ── TOAST ────────────────────────────────────────────────────
function showToast(msg, type) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = `fixed top-5 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-2xl shadow-xl text-white text-sm font-semibold text-center max-w-sm w-[90%] ${
        type === 'error' ? 'bg-red-500' : type === 'info' ? 'bg-blue-500' : 'bg-green-600'
    }`;
    clearTimeout(t._t);
    t._t = setTimeout(() => t.classList.add('hidden'), 3000);
}
