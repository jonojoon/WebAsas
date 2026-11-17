const campusRooms = {
    "Kampus Depan": [
        "Ruang Kelas X-TPM1", "Ruang Kelas X-TPM2", "Ruang Kelas XI-TPM1", "Ruang Kelas XI-TPM2", "Ruang Kelas TPM",
        "Ruang Kelas X-TPL1", "Ruang Kelas X-TPL2", "Ruang Kelas XI-TPL1", "Ruang Kelas XI-TPL2",
        "Ruang Kelas X-TKR1", "Ruang Kelas X-TKR2", "Ruang Kelas X-TKR3", "Ruang Kelas XI-TKR1", "Ruang Kelas XI-TKR2", "Ruang Kelas XI-TKR3",
        "Bengkel Teknik Mesin (TPM)", "Bengkel Teknik Mesin CNC", "Bengkel Kerja Bangku TPM", "Bengkel TKR",
        "Ruang Alat Mesin Bubut", "Ruang Kajur Otomotif", "Ruang Kelistrikan Otomotif", "Service Mobil / Engine Stand",
        "Lab. Komputer / Simdig TPM", "Ruang Studio", "Ruang Tata Usaha (TU)", "Ruang Kepala Sekolah", "Ruang Guru & Piket",
        "Ruang WKS Hubinmas", "Ruang Dapodik", "Ruang Pertemuan / Lobby", "Mushola", "Toilet (WC) Siswa Kampus Depan", "Lapang Volly", "Rumah Dinas"
    ],
    "Kampus Belakang": [
        "Ruang Kelas X-TKJ1", "Ruang Kelas X-TKJ2", "Ruang Kelas XI-TKJ1", "Ruang Kelas XI-TKJ2",
        "Ruang Kelas X-RPL1", "Ruang Kelas X-RPL2", "Ruang Kelas XI-RPLZ", "Ruang Kelas X-SK1", "Ruang Kelas X-SK2",
        "Ruang Kelas X-DPIB1", "Ruang Kelas X-DPIB2", "Ruang Kelas X-DPIB3", "Ruang Kelas XI-DPIB1", "Ruang Kelas XI-DPIB2", "Ruang Kelas XI-DPIB3",
        "Ruang Kelas X-TITL1", "Ruang Kelas X-TITL2", "Ruang Kelas X-TITL3", "Ruang Kelas XI-TITL1", "Ruang Kelas XI-TITL2", "Ruang Kelas TITL",
        "Lab. Komputer TKJ", "Lab. Komputer RPL", "Lab. Komputer DPIB", "Lab. Kimia",
        "Bengkel Teknik Elektro / TITL", "Ruang Praktek Kesenian", "Ruang Praktek SK", "Ruang Praktek TITL", "Ruang TEFA Bisnis Center",
        "Ruang Guru DPIB / TITL", "Ruang Kesiswaan", "Ruang Wakasek", "Ruang BP/BK", "Ruang Aula", "Ruang Meeting",
        "Perpustakaan", "Kantin Sekolah", "Mushola Kampus Belakang", "Lapangan Upacara / Basket", "Toilet (WC) Siswa Kampus Belakang", "Toilet Guru"
    ]
};

function updateRoomOptions() {
    const campusSelect = document.getElementById('campus');
    const roomSelect = document.getElementById('location');
    const selectedCampus = campusSelect.value;
    const customGroup = document.getElementById('custom-location-group');

    // Sembunyikan input custom saat ganti kampus
    customGroup.classList.add('hidden');
    document.getElementById('custom-location').required = false;

    roomSelect.innerHTML = '<option value="">-- Pilih Ruangan / Fasilitas --</option>';

    if (selectedCampus && campusRooms[selectedCampus]) {
        roomSelect.disabled = false;
        campusRooms[selectedCampus].forEach(room => {
            const option = document.createElement('option');
            option.value = room;
            option.textContent = room;
            roomSelect.appendChild(option);
        });

        // Tambahkan opsi lainnya di bagian bawah
        const otherOption = document.createElement('option');
        otherOption.value = "Lainnya (Ketik Sendiri)";
        otherOption.textContent = "➕ Lainnya (Ketik Sendiri...)";
        roomSelect.appendChild(otherOption);
    } else {
        roomSelect.disabled = true;
        roomSelect.innerHTML = '<option value="">-- Pilih Kampus Terlebih Dahulu --</option>';
    }
}

// Fungsi untuk mendeteksi jika user memilih "Lainnya"
function checkCustomLocation(selectObj) {
    const customGroup = document.getElementById('custom-location-group');
    const customInput = document.getElementById('custom-location');

    if (selectObj.value === "Lainnya (Ketik Sendiri)") {
        customGroup.classList.remove('hidden');
        customInput.required = true;
        customInput.focus();
    } else {
        customGroup.classList.add('hidden');
        customInput.required = false;
        customInput.value = '';
    }
}

// Data awal simulasi
const initialReports = [
    {
        id: '#SAR-042',
        date: '16 Nov 2026',
        reporter: 'Rizky Pratama (XI TPM 1)',
        location: 'Kampus Depan - Lab. Komputer / Simdig TPM',
        category: 'Multimedia / AC / Kipas / Komputer',
        description: 'AC di bagian belakang tidak dingin dan meneteskan air.',
        photo: '',
        status: 'Selesai'
    },
    {
        id: '#SAR-043',
        date: '17 Nov 2026',
        reporter: 'Nadia Putri (XI-RPLZ)',
        location: 'Kampus Belakang - Lab. Komputer RPL',
        category: 'Kelistrikan (Lampu/Stopkontak/Gardu)',
        description: 'Stopkontak di meja nomor 4 konslet dan mengeluarkan percikan api kecil.',
        photo: '',
        status: 'Diproses'
    }
];

let reports = JSON.parse(localStorage.getItem('sarpras_reports')) || initialReports;
let currentPhotoBase64 = '';

function saveReports() {
    localStorage.setItem('sarpras_reports', JSON.stringify(reports));
    if (document.getElementById('public-table-body')) renderPublicTable();
    if (document.getElementById('admin-table-body')) renderAdminTable();
}

function getStatusBadge(status) {
    if (status === 'Selesai') return `<span class="badge badge-resolved">🟢 Selesai</span>`;
    if (status === 'Diproses') return `<span class="badge badge-progress">🟡 Diproses</span>`;
    return `<span class="badge badge-pending">🔴 Menunggu</span>`;
}

// Logika Form Pelapor
const reportForm = document.getElementById('report-form');
if (reportForm) {
    reportForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const campus = document.getElementById('campus').value;
        let room = document.getElementById('location').value;
        
        // Jika memilih lainnya, ambil teks dari input manual
        if (room === "Lainnya (Ketik Sendiri)") {
            room = document.getElementById('custom-location').value;
        }

        const fullLocation = `${campus} - ${room}`;

        const nextNum = 45 + reports.length;
        const ticketId = `#SAR-${String(nextNum).padStart(3, '0')}`;
        const today = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

        const newReport = {
            id: ticketId,
            date: today,
            reporter: document.getElementById('reporter').value,
            location: fullLocation,
            category: document.getElementById('category').value,
            description: document.getElementById('description').value,
            photo: currentPhotoBase64,
            status: 'Menunggu'
        };

        reports.unshift(newReport);
        saveReports();

        this.reset();
        document.getElementById('location').disabled = true;
        document.getElementById('location').innerHTML = '<option value="">-- Pilih Kampus Terlebih Dahulu --</option>';
        document.getElementById('custom-location-group').classList.add('hidden');
        currentPhotoBase64 = '';
        document.getElementById('photo-preview').classList.add('hidden');
        document.getElementById('upload-placeholder').classList.remove('hidden');

        document.getElementById('generated-ticket-id').textContent = ticketId;
        document.getElementById('ticket-alert').classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function previewImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        currentPhotoBase64 = e.target.result;
        document.getElementById('photo-preview').src = currentPhotoBase64;
        document.getElementById('photo-preview').classList.remove('hidden');
        document.getElementById('upload-placeholder').classList.add('hidden');
    };
    reader.readAsDataURL(file);
}

function renderPublicTable() {
    const publicTbody = document.getElementById('public-table-body');
    if (!publicTbody) return;

    const searchQuery = document.getElementById('search-ticket').value.toLowerCase();

    document.getElementById('stat-pending').textContent = reports.filter(r => r.status === 'Menunggu').length;
    document.getElementById('stat-progress').textContent = reports.filter(r => r.status === 'Diproses').length;
    document.getElementById('stat-resolved').textContent = reports.filter(r => r.status === 'Selesai').length;

    const filtered = reports.filter(r => 
        r.id.toLowerCase().includes(searchQuery) || 
        r.location.toLowerCase().includes(searchQuery) ||
        r.description.toLowerCase().includes(searchQuery)
    );

    publicTbody.innerHTML = '';
    if (filtered.length === 0) {
        publicTbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted" style="padding: 24px;">Tidak ada laporan ditemukan.</td></tr>`;
        return;
    }

    filtered.forEach(item => {
        publicTbody.innerHTML += `
            <tr>
                <td class="ticket-code">${item.id}</td>
                <td><strong>${item.location}</strong></td>
                <td>${item.description}</td>
                <td>${getStatusBadge(item.status)}</td>
            </tr>
        `;
    });
}

// Logika Admin Table
function renderAdminTable() {
    const adminTbody = document.getElementById('admin-table-body');
    if (!adminTbody) return;

    const statusFilter = document.getElementById('filter-status').value;
    const filtered = statusFilter === 'ALL' ? reports : reports.filter(r => r.status === statusFilter);

    adminTbody.innerHTML = '';
    if (filtered.length === 0) {
        adminTbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted" style="padding: 24px;">Belum ada data laporan.</td></tr>`;
        return;
    }

    filtered.forEach(item => {
        const realIndex = reports.findIndex(r => r.id === item.id);
        const photoBtn = item.photo 
            ? `<button onclick="openPhotoModal('${item.photo}')" class="btn-link"><i class="fas fa-image"></i> Lihat Foto</button>`
            : `<span class="text-muted">Tanpa foto</span>`;

        adminTbody.innerHTML += `
            <tr>
                <td>
                    <div class="ticket-code">${item.id}</div>
                    <div class="text-muted">${item.date}</div>
                </td>
                <td><strong>${item.reporter}</strong></td>
                <td><strong>${item.location}</strong></td>
                <td style="max-width: 260px;">${item.description}</td>
                <td>${photoBtn}</td>
                <td>
                    <select onchange="updateStatus(${realIndex}, this.value)" class="select-sm">
                        <option value="Menunggu" ${item.status === 'Menunggu' ? 'selected' : ''}>🔴 Menunggu</option>
                        <option value="Diproses" ${item.status === 'Diproses' ? 'selected' : ''}>🟡 Diproses</option>
                        <option value="Selesai" ${item.status === 'Selesai' ? 'selected' : ''}>🟢 Selesai</option>
                    </select>
                </td>
                <td class="text-center">
                    <button onclick="deleteReport(${realIndex})" title="Hapus" class="btn-danger-icon">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

function updateStatus(index, newStatus) {
    reports[index].status = newStatus;
    saveReports();
}

function deleteReport(index) {
    if (confirm(`Yakin ingin menghapus laporan ${reports[index].id}?`)) {
        reports.splice(index, 1);
        saveReports();
    }
}

function loginAdmin(e) {
    e.preventDefault();
    const pass = document.getElementById('admin-password').value;
    if (pass === 'admin123') {
        sessionStorage.setItem('sarpras_admin_auth', 'true');
        checkAdminAuth();
    } else {
        alert('Kata sandi salah! Gunakan: admin123');
    }
}

function logoutAdmin() {
    sessionStorage.removeItem('sarpras_admin_auth');
    checkAdminAuth();
}

function checkAdminAuth() {
    const loginBox = document.getElementById('admin-login-box');
    const dashboardContent = document.getElementById('admin-dashboard-content');
    if (!loginBox || !dashboardContent) return;

    if (sessionStorage.getItem('sarpras_admin_auth') === 'true') {
        loginBox.classList.add('hidden');
        dashboardContent.classList.remove('hidden');
        renderAdminTable();
    } else {
        loginBox.classList.remove('hidden');
        dashboardContent.classList.add('hidden');
    }
}

function openPhotoModal(src) {
    document.getElementById('modal-img').src = src;
    document.getElementById('photo-modal').classList.remove('hidden');
}

function closePhotoModal() {
    document.getElementById('photo-modal').classList.add('hidden');
}

renderPublicTable();
checkAdminAuth();