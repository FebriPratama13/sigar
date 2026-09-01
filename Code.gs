/*******************************************************
 * SIGAR
 * SISTEM INFORMASI ANTI GRATIFIKASI RESPONSIF
 * Dinas Kesehatan dan Keluarga Berencana
 * Kabupaten Banyumas
 *
 * VERSI:
 * 1 Kode.gs
 * 1 Index.html
 *
 * DATABASE:
 * Google Spreadsheet
 *******************************************************/


/* =====================================================
   KONFIGURASI UTAMA
===================================================== */

const SPREADSHEET_ID = '164OH7yBjWABrs8KwRV0phnGQPxahXW8yWQ_dcFt5P1M';

const APP_NAME = 'SIGAR';
const APP_TITLE = 'Sistem Informasi Gratifikasi, Aduan, dan Respons';
const APP_TAGLINE = 'Satu Aplikasi untuk Edukasi, Pelaporan, Monitoring, dan Pengendalian Gratifikasi.';
const INSTANSI = 'Dinas Kesehatan dan Keluarga Berencana';
const KABUPATEN = 'Kabupaten Banyumas';

const TIMEZONE = 'Asia/Jakarta';

/* Kontak & media sosial resmi Dinkes & KB Kabupaten Banyumas */
const ALAMAT_KANTOR = 'Jl. RA. Wiryaatmaja No.4 Purwokerto Kode Pos 53131';
const TELP_KANTOR = '(0281)-632971';
const FAX_KANTOR = '(0281)-631502';
const EMAIL_KANTOR = 'dinkes@banyumaskab.go.id';
const JAM_KERJA_SENIN_KAMIS = '07.15 - 15.30';
const JAM_KERJA_JUMAT = '07.15 - 15.15';
const INSTAGRAM_URL = 'https://www.instagram.com/dinkesdankbbanyumas?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==';
const INSTAGRAM_NAMA = 'dinkesdankbbanyumas';
const YOUTUBE_URL = 'https://youtu.be/_eXMpQRB3Pw?si=YwDtA3Z74bFfig8Q';
const YOUTUBE_NAMA = 'Dinkes KB Banyumas';

/* Logo Dinas Kesehatan dan Keluarga Berencana Kabupaten Banyumas.
   Ganti nilai di bawah ini dengan tautan gambar logo resmi
   (contoh: unggah file logo ke Google Drive, klik kanan > Bagikan >
   ubah akses menjadi "Siapa saja yang memiliki link", lalu salin ID
   filenya ke dalam URL berikut). Jika dikosongkan / linknya gagal
   dimuat, aplikasi otomatis menampilkan ikon logo cadangan. */
const LOGO_URL = '';


/* =====================================================
   NAMA SHEET
===================================================== */

const SHEET_USERS = 'Users';
const SHEET_LAPORAN = 'Laporan';
const SHEET_TINDAKLANJUT = 'TindakLanjut';
const SHEET_REGULASI = 'Regulasi';
const SHEET_EDUKASI = 'Edukasi';
const SHEET_LOG = 'LogAktivitas';
const SHEET_PAMFLET = 'Pamflet';
const SHEET_PENGUNJUNG = 'Pengunjung';


/* =====================================================
   WEB APP
===================================================== */

function doGet(e){

setupDatabase();

let page="User";

if(e && e.parameter){

if(e.parameter.page=="admin"){

page="Admin";

}

else if(e.parameter.page=="detail"){

page="DetailLaporan";

}

}

/* Catat statistik pengunjung hanya untuk halaman publik (User) */
if(page === "User"){
  catatKunjungan();
}

const t=

HtmlService.createTemplateFromFile(page);

t.no=

e && e.parameter ?

e.parameter.no || ""

:

"";

t.logoUrl = LOGO_URL;
t.appTagline = APP_TAGLINE;
t.alamatKantor = ALAMAT_KANTOR;
t.telpKantor = TELP_KANTOR;
t.faxKantor = FAX_KANTOR;
t.emailKantor = EMAIL_KANTOR;
t.jamKerjaSeninKamis = JAM_KERJA_SENIN_KAMIS;
t.jamKerjaJumat = JAM_KERJA_JUMAT;
t.instagramUrl = INSTAGRAM_URL;
t.instagramNama = INSTAGRAM_NAMA;
t.youtubeUrl = YOUTUBE_URL;
t.youtubeNama = YOUTUBE_NAMA;

return t

.evaluate()

.addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0')

.setTitle(APP_NAME+" - "+APP_TITLE)

.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

}

function include(file){

return HtmlService

.createHtmlOutputFromFile(file)

.getContent();

}

/* =====================================================
   DATABASE
===================================================== */

function getSpreadsheet() {

  if (!SPREADSHEET_ID ||
      SPREADSHEET_ID === 'MASUKKAN_ID_SPREADSHEET_ANDA') {

    throw new Error(
      'SPREADSHEET_ID belum diisi. Silakan isi ID Google Spreadsheet pada Kode.gs.'
    );
  }

  return SpreadsheetApp.openById(SPREADSHEET_ID);
}


/* =====================================================
   SETUP DATABASE OTOMATIS
===================================================== */

function setupDatabase() {

  const ss = getSpreadsheet();

  createSheetIfNotExists(
    ss,
    SHEET_USERS,
    [
      'ID',
      'Username',
      'Password',
      'Nama',
      'Instansi',
      'Jabatan',
      'Role',
      'Status',
      'TanggalDibuat'
    ]
  );


  createSheetIfNotExists(
    ss,
    SHEET_LAPORAN,
    [
      'ID',
      'NoLaporan',
      'Tanggal',
      'UsernamePelapor',
      'NamaPelapor',
      'Instansi',
      'Jabatan',
      'NoTelepon',
      'Email',
      'Anonim',
      'JenisGratifikasi',
      'TanggalKejadian',
      'LokasiKejadian',
      'PihakPemberi',
      'Uraian',
      'NilaiEstimasi',
      'Kronologi',
      'BuktiFile',
      'Status',
      'Catatan',
      'TanggalTindakLanjut',
      'Petugas',
      'TanggalDibuat'
    ]
  );


  createSheetIfNotExists(
    ss,
    SHEET_TINDAKLANJUT,
    [
      'ID',
      'NoLaporan',
      'Tanggal',
      'Status',
      'Catatan',
      'Petugas',
      'TanggalDibuat'
    ]
  );


  createSheetIfNotExists(
    ss,
    SHEET_REGULASI,
    [
      'ID',
      'Judul',
      'Deskripsi',
      'Link',
      'Status'
    ]
  );


  createSheetIfNotExists(
    ss,
    SHEET_EDUKASI,
    [
      'ID',
      'Judul',
      'Deskripsi',
      'Konten',
      'Gambar',
      'Status'
    ]
  );


  /* Migrasi otomatis: pastikan sheet Edukasi lama (tanpa kolom Gambar)
     tetap kompatibel dengan versi baru */
  ensureEdukasiGambarColumn(ss);


  createSheetIfNotExists(
    ss,
    SHEET_LOG,
    [
      'ID',
      'Username',
      'Aktivitas',
      'Keterangan',
      'Tanggal'
    ]
  );

  createSheetIfNotExists(
    ss,
    SHEET_PAMFLET,
    [
      'ID',
      'Judul',
      'Deskripsi',
      'Gambar',
      'Status',
      'Tanggal'
    ]
);

  createSheetIfNotExists(
    ss,
    SHEET_PENGUNJUNG,
    [
      'ID',
      'Tanggal',
      'Timestamp'
    ]
  );


  /* Membuat akun admin default */

  const userSheet = ss.getSheetByName(SHEET_USERS);

  if (userSheet.getLastRow() <= 1) {

    userSheet.appendRow([
      generateID('USR'),
      'admin',
      'admin123',
      'Admin SIGAR',
      INSTANSI + ' ' + KABUPATEN,
      'Admin Sistem',
      'ADMIN',
      'Aktif',
      now()
    ]);

    userSheet.appendRow([
      generateID('USR'),
      'pelapor',
      'pelapor123',
      'Pengguna SIGAR',
      INSTANSI + ' ' + KABUPATEN,
      'Pegawai',
      'PEGAWAI',
      'Aktif',
      now()
    ]);
  }


  /* Data edukasi default */

  const edukasiSheet = ss.getSheetByName(SHEET_EDUKASI);

  if (edukasiSheet.getLastRow() <= 1) {

    edukasiSheet.appendRow([
      generateID('EDU'),
      'Apa itu Gratifikasi?',
      'Kenali pengertian gratifikasi',
      'Gratifikasi adalah pemberian dalam arti luas, meliputi uang, barang, rabat, komisi, pinjaman tanpa bunga, tiket perjalanan, fasilitas penginapan, perjalanan wisata, pengobatan cuma-cuma, dan fasilitas lainnya.',
      '',
      'Aktif'
    ]);

    edukasiSheet.appendRow([
      generateID('EDU'),
      'Cegah Gratifikasi',
      'Tolak gratifikasi dengan bijak',
      'Pegawai wajib menolak gratifikasi yang berhubungan dengan jabatan dan berlawanan dengan kewajiban atau tugasnya.',
      '',
      'Aktif'
    ]);

    edukasiSheet.appendRow([
      generateID('EDU'),
      'Cara Melaporkan Gratifikasi',
      'Laporkan melalui SIGAR',
      'Gunakan menu Laporkan Gratifikasi untuk menyampaikan informasi terkait dugaan gratifikasi.',
      '',
      'Aktif'
    ]);
  }


  /* Data regulasi default */

  const regulasiSheet = ss.getSheetByName(SHEET_REGULASI);

  if (regulasiSheet.getLastRow() <= 1) {

    regulasiSheet.appendRow([
      generateID('REG'),
      'Undang-Undang Nomor 20 Tahun 2001',
      'Perubahan atas UU Nomor 31 Tahun 1999 tentang Pemberantasan Tindak Pidana Korupsi',
      'https://peraturan.bpk.go.id/',
      'Aktif'
    ]);

    regulasiSheet.appendRow([
      generateID('REG'),
      'Peraturan KPK tentang Gratifikasi',
      'Ketentuan mengenai pelaporan gratifikasi',
      'https://www.kpk.go.id/',
      'Aktif'
    ]);
  }
}






/* =====================================================
   CREATE SHEET
===================================================== */

function createSheetIfNotExists(ss, sheetName, headers) {

  let sheet = ss.getSheetByName(sheetName);

  if (!sheet) {

    sheet = ss.insertSheet(sheetName);

    sheet
      .getRange(1, 1, 1, headers.length)
      .setValues([headers]);

    sheet
      .getRange(1, 1, 1, headers.length)
      .setFontWeight('bold');

    sheet.setFrozenRows(1);
  }

}


/* =====================================================
   MIGRASI KOLOM GAMBAR PADA SHEET EDUKASI
   (agar spreadsheet lama yang belum punya kolom Gambar
   tetap kompatibel tanpa kehilangan data)
===================================================== */

function ensureEdukasiGambarColumn(ss) {

  const sheet = ss.getSheetByName(SHEET_EDUKASI);

  if (!sheet) return;

  const lastCol = sheet.getLastColumn();

  if (lastCol < 5) return;

  const headers = sheet
    .getRange(1, 1, 1, lastCol)
    .getValues()[0];

  if (headers[4] === 'Gambar') return;

  /* Sheet lama: ID, Judul, Deskripsi, Konten, Status
     -> sisipkan kolom baru "Gambar" sebelum kolom Status */

  sheet.insertColumnBefore(5);

  sheet
    .getRange(1, 5)
    .setValue('Gambar')
    .setFontWeight('bold');

}


/* =====================================================
   LOGIN
===================================================== */

function login(username, password) {

  setupDatabase();

  username = String(username || '').trim();
  password = String(password || '').trim();

  if (!username || !password) {

    return {
      success: false,
      message: 'Username dan password wajib diisi.'
    };

  }


  const sheet = getSpreadsheet()
    .getSheetByName(SHEET_USERS);

  const data = sheet
    .getDataRange()
    .getValues();


  for (let i = 1; i < data.length; i++) {

    const row = data[i];

    const dbUsername = String(row[1] || '').trim();
    const dbPassword = String(row[2] || '').trim();
    const status = String(row[7] || '').trim();


    if (
      username === dbUsername &&
      password === dbPassword
    ) {

      if (status.toLowerCase() !== 'aktif') {

        return {
          success: false,
          message: 'Akun Anda tidak aktif.'
        };

      }


      const user = {

        id: row[0],

        username: row[1],

        nama: row[3],

        instansi: row[4],

        jabatan: row[5],

        role: row[6]

      };


      logActivity(
        username,
        'LOGIN',
        'Berhasil login'
      );


      return {

        success: true,

        message: 'Login berhasil.',

        user: user

      };

    }

  }


  logActivity(
    username,
    'LOGIN_GAGAL',
    'Username atau password salah'
  );


  return {

    success: false,

    message: 'Username atau password salah.'

  };

}


/* =====================================================
   LOGOUT
===================================================== */

function logout(username) {

  logActivity(
    username || 'UNKNOWN',
    'LOGOUT',
    'Pengguna keluar dari sistem'
  );

  return {

    success: true,

    message: 'Logout berhasil.'

  };

}


/* =====================================================
   DASHBOARD
===================================================== */

function getDashboardData() {

  const sheet = getSpreadsheet()
    .getSheetByName(SHEET_LAPORAN);

  const data = sheet
    .getDataRange()
    .getValues();


  let total = 0;

  let proses = 0;

  let selesai = 0;

  let ditolak = 0;


  const laporan = [];


  for (let i = 1; i < data.length; i++) {

    if (!data[i][0]) continue;


    total++;


    const status =
      String(data[i][18] || '')
      .toLowerCase();


    if (status === 'belum terverifikasi' || status === 'dalam proses') {
      proses++;
    }
    else if (status === 'terverifikasi' || status === 'selesai') {
      selesai++;
    }
    else if (status === 'ditolak') {
      ditolak++;
    }


    laporan.push({

      no: data[i][1],

      tanggal: formatDate(data[i][2]),

      jenis: data[i][10],

      pelapor:
        data[i][9] === true ||
        data[i][9] === 'TRUE'
          ? 'Rahasia'
          : data[i][4],

      status: data[i][18]

    });

  }


  laporan.reverse();


  return {

    total: total,

    proses: proses,

    selesai: selesai,

    ditolak: ditolak,

    persentaseTolak: total > 0
      ? Math.round(
          ((total - ditolak) / total) * 100
        )
      : 100,

    laporanTerbaru:
      laporan.slice(0, 5)

  };

}


/* =====================================================
   STATISTIK PENGUNJUNG HALAMAN WEBSITE (PUBLIK)
===================================================== */

/* Mencatat satu kunjungan ke halaman publik (dipanggil dari doGet) */
function catatKunjungan() {

  try {

    const sheet = getSpreadsheet()
      .getSheetByName(SHEET_PENGUNJUNG);

    if (!sheet) return;

    const tanggal = Utilities.formatDate(
      new Date(),
      TIMEZONE,
      'yyyy-MM-dd'
    );

    sheet.appendRow([
      generateID('PNG'),
      tanggal,
      now()
    ]);

  }
  catch (e) {
    /* Jangan sampai kegagalan pencatatan pengunjung
       mengganggu proses menampilkan halaman */
  }

}


/* =====================================================
   MENGAMBIL REKAP JUMLAH PENGUNJUNG (BUGS FIXED)
===================================================== */
function getStatistikPengunjung() {
  const sheet = getSpreadsheet().getSheetByName(SHEET_PENGUNJUNG);
  if (!sheet) {
    return { hariIni: 0, mingguIni: 0, bulanIni: 0, tahunIni: 0, total: 0 };
  }

  const data = sheet.getDataRange().getValues();
  const now_ = new Date();
  const todayStr = Utilities.formatDate(now_, TIMEZONE, 'yyyy-MM-dd');
  const bulanStr = Utilities.formatDate(now_, TIMEZONE, 'yyyy-MM');
  const tahunStr = Utilities.formatDate(now_, TIMEZONE, 'yyyy');

  const hariIndex = (now_.getDay() + 6) % 7;
  const awalMinggu = new Date(now_);
  awalMinggu.setDate(now_.getDate() - hariIndex);
  const awalMingguStr = Utilities.formatDate(awalMinggu, TIMEZONE, 'yyyy-MM-dd');

  let hariIni = 0; let mingguIni = 0; let bulanIni = 0; let tahunIni = 0; let total = 0;

  for (let i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    let tglStr = '';
    if (data[i][1] instanceof Date) {
      tglStr = Utilities.formatDate(data[i][1], TIMEZONE, 'yyyy-MM-dd');
    } else {
      tglStr = String(data[i][1] || '').trim();
    }
    
    if (!tglStr) continue;

    total++;
    if (tglStr === todayStr) hariIni++;
    if (tglStr >= awalMingguStr && tglStr <= todayStr) mingguIni++;
    if (tglStr.slice(0, 7) === bulanStr) bulanIni++;
    if (tglStr.slice(0, 4) === tahunStr) tahunIni++;
  }

  return {
    hariIni: hariIni,
    mingguIni: mingguIni,
    bulanIni: bulanIni,
    tahunIni: tahunIni,
    total: total
  };
}


/* =====================================================
   SIMPAN LAPORAN GRATIFIKASI
===================================================== */

function simpanLaporan(data) {

  setupDatabase();


  if (!data) {

    throw new Error(
      'Data laporan tidak ditemukan.'
    );

  }


  const sheet = getSpreadsheet()
    .getSheetByName(SHEET_LAPORAN);


  const id =
    generateID('LAP');


  const noLaporan =
    generateNomorLaporan();


  let buktiUrl = '';


  /* Upload file bukti */

  if (
    data.buktiBase64 &&
    data.buktiNama
  ) {

    try {

      const folder =
        getOrCreateUploadFolder();

      const bytes =
        Utilities.base64Decode(
          data.buktiBase64
        );

      const blob =
        Utilities.newBlob(
          bytes,
          data.buktiType ||
          'application/octet-stream',
          data.buktiNama
        );

      const file =
        folder.createFile(blob);

      buktiUrl =
        file.getUrl();

    }

    catch (err) {

      buktiUrl =
        'Gagal upload: ' +
        err.message;

    }

  }


  const tanggal =
    data.tanggal ||
    formatDate(new Date());


  sheet.appendRow([

    id,

    noLaporan,

    tanggal,

    data.username || '',

    data.namaPelapor || '',

    data.instansi || '',

    data.jabatan || '',

    data.noTelepon || '',

    data.email || '',

    data.anonim || false,

    data.jenisGratifikasi || '',

    data.tanggalKejadian || '',

    data.lokasiKejadian || '',

    data.pihakPemberi || '',

    data.uraian || '',

    data.nilaiEstimasi || '',

    data.kronologi || '',

    buktiUrl,

    'Belum Terverifikasi',

    '',

    '',

    '',

    now()

  ]);


  logActivity(

    data.username || 'PUBLIK',

    'LAPORAN_BARU',

    noLaporan

  );


  return {

    success: true,

    noLaporan: noLaporan,

    message:
      'Laporan gratifikasi berhasil dikirim.'

  };

}


/* =====================================================
   GENERATE NOMOR LAPORAN
===================================================== */

function generateNomorLaporan() {

  const year =
    new Date()
    .getFullYear();


  const sheet =
    getSpreadsheet()
    .getSheetByName(SHEET_LAPORAN);


  const lastRow =
    sheet.getLastRow();


  let nomor =
    1;


  if (lastRow > 1) {

    nomor =
      lastRow;

  }


  return (

    'LG-' +

    year +

    '-' +

    String(nomor)
      .padStart(5, '0')

  );

}

/* =====================================================
   HELPER: HITUNG RENTANG TANGGAL DARI FILTER PERIODE
   (Dipakai bersama oleh getLaporanData & unduhLaporanExcel
   supaya tabel & unduhan Excel selalu konsisten)
===================================================== */
function hitungRentangTanggal(filters) {

  filters = filters || {};
  const now_ = new Date();
  const hariIni = Utilities.formatDate(now_, TIMEZONE, 'yyyy-MM-dd');

  let awal = null;
  let akhir = hariIni;

  if (filters.periode === 'harian') {
    awal = hariIni;
  } else if (filters.periode === 'mingguan') {
    const hariIndex = (now_.getDay() + 6) % 7;
    const awalMinggu = new Date(now_);
    awalMinggu.setDate(now_.getDate() - hariIndex);
    awal = Utilities.formatDate(awalMinggu, TIMEZONE, 'yyyy-MM-dd');
  } else if (filters.periode === 'bulanan') {
    awal = Utilities.formatDate(now_, TIMEZONE, 'yyyy-MM') + '-01';
  } else if (filters.periode === 'tahunan') {
    awal = Utilities.formatDate(now_, TIMEZONE, 'yyyy') + '-01-01';
  } else if (filters.periode === 'custom' && filters.tanggalAwal) {
    awal = filters.tanggalAwal;
    if (filters.tanggalAkhir) akhir = filters.tanggalAkhir;
  }
  // periode === 'semua' / tidak diisi -> awal tetap null (tidak difilter tanggal)

  return { awal: awal, akhir: akhir };
}

/* =====================================================
   GET SEMUA LAPORAN
===================================================== */

function getLaporanData(filters) {

  const sheet = getSpreadsheet().getSheetByName(SHEET_LAPORAN);
  const data = sheet.getDataRange().getValues();
  const result = [];

  filters = filters || {};
  const rentang = hitungRentangTanggal(filters);
  const adaFilterTanggal = filters.periode && filters.periode !== 'semua';

  for (let i = 1; i < data.length; i++) {

    if (!data[i][0]) continue;

    const status = String(data[i][18] || '');
    const jenis = String(data[i][10] || '');

    if (filters.status && filters.status !== 'Semua Status' && status !== filters.status) continue;
    if (filters.jenis && filters.jenis !== 'Semua Jenis' && jenis !== filters.jenis) continue;

    if (adaFilterTanggal) {
      const tglLapor = data[i][2] ? new Date(data[i][2]) : null;
      if (!tglLapor) continue;
      const tglKey = Utilities.formatDate(tglLapor, TIMEZONE, 'yyyy-MM-dd');
      if (rentang.awal && tglKey < rentang.awal) continue;
      if (tglKey > rentang.akhir) continue;
    }

    result.push({
      id: data[i][0],
      noLaporan: data[i][1],
      tanggal: formatDate(data[i][2]),
      nama: data[i][9] === true || data[i][9] === 'TRUE' ? 'Rahasia' : data[i][4],
      jenis: data[i][10],
      status: data[i][18],
      bukti: data[i][17],
      catatan: data[i][19]
    });

  }

  result.reverse();
  return result;
}

/* =====================================================
   UNDUH LAPORAN KE EXCEL (DENGAN FILTER PERIODE)
===================================================== */
function unduhLaporanExcel(filters) {

  filters = filters || {};

  const sheet = getSpreadsheet().getSheetByName(SHEET_LAPORAN);
  const data = sheet.getDataRange().getValues();

  const now_ = new Date();
  const rentang = hitungRentangTanggal(filters);

  const headers = [
    'No', 'No. Laporan', 'Tanggal Lapor', 'Pelapor', 'Instansi', 'Jabatan',
    'Jenis Gratifikasi', 'Tanggal Kejadian', 'Lokasi Kejadian', 'Pihak Pemberi',
    'Nilai Estimasi', 'Uraian', 'Status', 'Catatan', 'Petugas', 'Link Bukti File'
  ];

  const rows = [headers];
  let no = 1;

  for (let i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;

    const tglLapor = data[i][2] ? new Date(data[i][2]) : null;
    if (!tglLapor) continue;

    const tglKey = Utilities.formatDate(tglLapor, TIMEZONE, 'yyyy-MM-dd');
    if (rentang.awal && tglKey < rentang.awal) continue;
    if (tglKey > rentang.akhir) continue;

    const status = String(data[i][18] || '');
    const jenis = String(data[i][10] || '');

    if (filters.status && filters.status !== 'Semua Status' && status !== filters.status) continue;
    if (filters.jenis && filters.jenis !== 'Semua Jenis' && jenis !== filters.jenis) continue;

    const anonim = data[i][9] === true || data[i][9] === 'TRUE';

    rows.push([
      no++,
      data[i][1],
      formatDate(data[i][2]),
      anonim ? 'Rahasia' : data[i][4],
      data[i][5],
      data[i][6],
      data[i][10],
      (data[i][11] instanceof Date) ? formatDate(data[i][11]) : data[i][11],
      data[i][12],
      data[i][13],
      data[i][15],
      data[i][14],
      data[i][18],
      data[i][19],
      data[i][21],
      data[i][17] || '-'
    ]);
  }

  if (rows.length <= 1) {
    return {
      success: true,
      jumlah: 0,
      base64: '',
      filename: ''
    };
  }

  // Buat spreadsheet sementara, isi data, export ke xlsx, lalu hapus
  const namaFile = 'Laporan_SIGAR_' + Utilities.formatDate(now_, TIMEZONE, 'yyyyMMdd_HHmmss');
  const tempSS = SpreadsheetApp.create(namaFile);
  const tempSheet = tempSS.getSheets()[0];

  tempSheet.getRange(1, 1, rows.length, headers.length).setValues(rows);
  tempSheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');

  // Ubah kolom "Link Bukti File" jadi hyperlink berlabel, aman dari masalah locale
  const kolomBukti = headers.length;
  for (let r = 2; r <= rows.length; r++) {
    const url = rows[r - 1][kolomBukti - 1];
    if (url && url !== '-' && String(url).indexOf('http') === 0) {
      const richText = SpreadsheetApp.newRichTextValue()
        .setText('Lihat Bukti')
        .setLinkUrl(url)
        .build();
      tempSheet.getRange(r, kolomBukti).setRichTextValue(richText);
    }
  }

  tempSheet.autoResizeColumns(1, headers.length);

  SpreadsheetApp.flush();

  const fileId = tempSS.getId();
  const exportUrl = 'https://docs.google.com/spreadsheets/d/' + fileId + '/export?format=xlsx';
  const token = ScriptApp.getOAuthToken();

  const response = UrlFetchApp.fetch(exportUrl, {
    headers: { Authorization: 'Bearer ' + token }
  });

  const blob = response.getBlob();
  const base64 = Utilities.base64Encode(blob.getBytes());

  // Hapus spreadsheet sementara dari Drive setelah di-export
  DriveApp.getFileById(fileId).setTrashed(true);

  logActivity(
    'ADMIN',
    'UNDUH_LAPORAN_EXCEL',
    (filters.periode || 'semua') + ' - ' + (rows.length - 1) + ' baris'
  );

  return {
    success: true,
    jumlah: rows.length - 1,
    base64: base64,
    filename: 'Laporan_Gratifikasi_' + (filters.periode || 'semua') + '_' +
      Utilities.formatDate(now_, TIMEZONE, 'yyyyMMdd') + '.xlsx'
  };
}

/* =====================================================
   DETAIL LAPORAN 
===================================================== */
function getDetailLaporan(noLaporan) {
  const sheet = getSpreadsheet().getSheetByName(SHEET_LAPORAN);
  const data = sheet.getDataRange().getValues();
  
  const searchId = String(noLaporan).trim().toLowerCase();

  for (let i = 1; i < data.length; i++) {
    const dbId = String(data[i][1]).trim().toLowerCase();

    if (dbId === searchId) {
      
      return {
        id: String(data[i][0] || ''),
        noLaporan: String(data[i][1] || ''),
        tanggal: formatDate(data[i][2]),
        username: String(data[i][3] || ''),
        nama: (data[i][9] === true || String(data[i][9]).toUpperCase() === 'TRUE') ? 'Rahasia' : String(data[i][4] || ''),
        instansi: String(data[i][5] || ''),
        jabatan: String(data[i][6] || ''),
        noTelepon: String(data[i][7] || ''),
        email: String(data[i][8] || ''),
        anonim: String(data[i][9] || ''),
        jenis: String(data[i][10] || ''),
        
        // Cek khusus untuk tanggal kejadian
        tanggalKejadian: (data[i][11] instanceof Date) ? formatDate(data[i][11]) : String(data[i][11] || ''),
        
        lokasiKejadian: String(data[i][12] || ''),
        pihakPemberi: String(data[i][13] || ''),
        uraian: String(data[i][14] || ''),
        nilaiEstimasi: String(data[i][15] || ''),
        kronologi: String(data[i][16] || ''),
        bukti: String(data[i][17] || ''),
        status: String(data[i][18] || ''),
        catatan: String(data[i][19] || ''),
        tanggalTindakLanjut: formatDate(data[i][20]),
        petugas: String(data[i][21] || ''),
        riwayat: getRiwayatLaporan(data[i][1])
      };
    }
  }

  return null; 
}

/* =====================================================
   RIWAYAT LAPORAN 
===================================================== */
function getRiwayatLaporan(noLaporan) {
  const sheet = getSpreadsheet().getSheetByName(SHEET_TINDAKLANJUT);
  const values = sheet.getDataRange().getValues();
  const hasil = [];
  
  const searchId = String(noLaporan).trim().toLowerCase();

  for(let i = 1; i < values.length; i++){
    if(String(values[i][1]).trim().toLowerCase() !== searchId) continue;

    hasil.push({
      tanggal: formatDate(values[i][2]),
      status: String(values[i][3] || ''),
      catatan: String(values[i][4] || ''),
      petugas: String(values[i][5] || '')
    });
  }

  return hasil;
}

/* =====================================================
   CEK STATUS LAPORAN (PUBLIK, TANPA LOGIN)
===================================================== */

function cekStatusLaporan(noLaporan) {

  noLaporan =
    String(noLaporan || '')
    .trim();


  if (!noLaporan) {

    return {

      ditemukan: false,

      message:
        'Nomor laporan wajib diisi.'

    };

  }


  const sheet =
    getSpreadsheet()
    .getSheetByName(SHEET_LAPORAN);


  const data =
    sheet
    .getDataRange()
    .getValues();


  for (let i = 1; i < data.length; i++) {

    if (
      String(data[i][1])
        .trim()
        .toLowerCase() ===
      noLaporan.toLowerCase()
    ) {

      logActivity(

        'PUBLIK',

        'CEK_STATUS',

        String(data[i][1])

      );


      return {

        ditemukan: true,

        noLaporan: data[i][1],

        tanggalLapor:
          formatDate(data[i][2]),

        jenis: data[i][10],

        status: data[i][18],

        catatan: data[i][19],

        tanggalTindakLanjut:
          formatDate(data[i][20])

      };

    }

  }


  return {

    ditemukan: false,

    message:
      'Nomor laporan tidak ditemukan. Pastikan kode yang Anda masukkan sudah benar.'

  };

}


/* =====================================================
   UPDATE STATUS
===================================================== */

function updateStatusLaporan(
  noLaporan,
  status,
  catatan,
  petugas
) {

  const sheet =
    getSpreadsheet()
    .getSheetByName(SHEET_LAPORAN);


  const data =
    sheet
    .getDataRange()
    .getValues();


  for (let i = 1; i < data.length; i++) {

    if (
      String(data[i][1]) ===
      String(noLaporan)
    ) {

      sheet
        .getRange(i + 1, 19)
        .setValue(status);


      sheet
        .getRange(i + 1, 20)
        .setValue(catatan);


      sheet
        .getRange(i + 1, 21)
        .setValue(now());


      sheet
        .getRange(i + 1, 22)
        .setValue(petugas);


      const tindak =
        getSpreadsheet()
        .getSheetByName(
          SHEET_TINDAKLANJUT
        );


      tindak.appendRow([

        generateID('TIN'),

        noLaporan,

        now(),

        status,

        catatan,

        petugas,

        now()

      ]);


      logActivity(

        petugas,

        'UPDATE_STATUS',

        noLaporan +
        ' menjadi ' +
        status

      );


      return {

        success: true,

        message:
          'Status berhasil diperbarui.'

      };

    }

  }


  return {

    success: false,

    message:
      'Laporan tidak ditemukan.'

  };

}

/* =====================================================
   STATISTIK (DENGAN DATA MENTAH UNTUK FILTER DINAMIS)
===================================================== */
function getStatistikData() {
  const sheet = getSpreadsheet().getSheetByName(SHEET_LAPORAN);
  const data = sheet.getDataRange().getValues();

  const hasil = {
    kpi: { total: 0, proses: 0, selesai: 0, ditolak: 0, avgSla: 0 },
    jenis: {}, lokasi: {}, instansi: {}, anonimitas: { anonim: 0, terbuka: 0 },
    dates: [] // Kita gunakan array ini untuk menampung data uang agar bisa di-filter di Javascript HTML
  };

  let totalHariSla = 0;
  let jumlahSelesaiSla = 0;

  for (let i = 1; i < data.length; i++) {
    if (!data[i][0]) continue; 

    hasil.kpi.total++;
    const statusOriginal = String(data[i][18] || '').trim();
    const status = statusOriginal.toLowerCase();
    
    // 1. Hitung Status KPI & SLA (Waktu Respon)
    let isDone = false;
    if (status === 'belum terverifikasi' || status === 'dalam proses') hasil.kpi.proses++;
    else if (status === 'terverifikasi' || status === 'selesai') { hasil.kpi.selesai++; isDone = true; } 
    else if (status === 'ditolak') { hasil.kpi.ditolak++; isDone = true; }

    if (isDone && data[i][2] && data[i][20]) {
      const tglLapor = new Date(data[i][2]);
      const tglTindak = new Date(data[i][20]);
      const selisihHari = Math.max(0, Math.ceil((tglTindak.getTime() - tglLapor.getTime()) / (1000 * 60 * 60 * 24)));
      totalHariSla += selisihHari;
      jumlahSelesaiSla++;
    }

    // 2. Data General (Jenis, Lokasi, Instansi, Anonimitas)
    const jenisNama = String(data[i][10] || 'Lainnya').trim() || 'Lainnya';
    hasil.jenis[jenisNama] = (hasil.jenis[jenisNama] || 0) + 1;

    let lokasiNama = String(data[i][12] || '').trim();
    if(lokasiNama === '') lokasiNama = 'Tidak Diketahui';
    hasil.lokasi[lokasiNama] = (hasil.lokasi[lokasiNama] || 0) + 1;

    let instansiNama = String(data[i][5] || '').trim();
    if(instansiNama === '') instansiNama = 'Masyarakat / Eksternal';
    hasil.instansi[instansiNama] = (hasil.instansi[instansiNama] || 0) + 1;

    if(data[i][9] === true || String(data[i][9]).toUpperCase() === 'TRUE') hasil.anonimitas.anonim++;
    else hasil.anonimitas.terbuka++;

    // 3. Masukkan data Nilai & Jenis ke dalam array dates untuk keperluan filter Panel Uang
    let tglStr = '';
    const tgl = data[i][2];
    if (tgl instanceof Date) tglStr = Utilities.formatDate(tgl, TIMEZONE, 'yyyy-MM-dd');
    else if (tgl) { try { tglStr = Utilities.formatDate(new Date(tgl), TIMEZONE, 'yyyy-MM-dd'); } catch(e){} }

    if (tglStr) {
      const nilaiStr = String(data[i][15] || '0').replace(/[^0-9]/g, '');
      hasil.dates.push({
        tanggal: tglStr + 'T00:00:00.000Z',
        status: statusOriginal,
        nilai: parseInt(nilaiStr) || 0,
        jenis: jenisNama
      });
    }
  }

  hasil.kpi.avgSla = jumlahSelesaiSla > 0 ? Math.round(totalHariSla / jumlahSelesaiSla) : 0;
  return hasil;
}

/* =====================================================
   EDUKASI
===================================================== */

function getEdukasi() {

  const sheet =
    getSpreadsheet()
    .getSheetByName(SHEET_EDUKASI);


  const data =
    sheet
    .getDataRange()
    .getValues();


  const result = [];


  for (let i = 1; i < data.length; i++) {

    if (
      data[i][0] &&
      data[i][5] === 'Aktif'
    ) {

      result.push({

        id: data[i][0],

        judul: data[i][1],

        deskripsi: data[i][2],

        konten: data[i][3],

        gambar: data[i][4]

      });

    }

  }


  return result;

}


/* =====================================================
   EDUKASI (ADMIN - SEMUA DATA)
===================================================== */

function getEdukasiAdmin() {

  const sheet =
    getSpreadsheet()
    .getSheetByName(SHEET_EDUKASI);

  const data =
    sheet
    .getDataRange()
    .getValues();

  const result = [];

  for (let i = 1; i < data.length; i++) {

    if (!data[i][0]) continue;

    result.push({

      id: data[i][0],
      judul: data[i][1],
      deskripsi: data[i][2],
      konten: data[i][3],
      gambar: data[i][4],
      status: data[i][5]

    });

  }

  return result.reverse();

}


/* =====================================================
   TAMBAH EDUKASI
===================================================== */

function tambahEdukasi(data) {

  const sheet =
    getSpreadsheet()
    .getSheetByName(SHEET_EDUKASI);

  let gambarUrl = '';

  if (data.gambarBase64 && data.gambarNama) {

    gambarUrl = simpanGambarKeDrive(
      data.gambarBase64,
      data.gambarType,
      data.gambarNama
    );

  }

  sheet.appendRow([

    generateID('EDU'),
    data.judul,
    data.deskripsi,
    data.konten,
    gambarUrl,
    data.status || 'Aktif'

  ]);

  logActivity(
    'ADMIN',
    'TAMBAH_EDUKASI',
    data.judul
  );

  return {

    success: true,
    message: 'Edukasi berhasil ditambahkan.'

  };

}


/* =====================================================
   UPDATE EDUKASI
===================================================== */

function updateEdukasi(data) {

  const sheet =
    getSpreadsheet()
    .getSheetByName(SHEET_EDUKASI);

  const values =
    sheet
    .getDataRange()
    .getValues();

  for (let i = 1; i < values.length; i++) {

    if (values[i][0] != data.id) continue;

    let gambar = values[i][4];

    if (data.gambarBase64 && data.gambarNama) {

      hapusGambarDrive(gambar);

      gambar = simpanGambarKeDrive(
        data.gambarBase64,
        data.gambarType,
        data.gambarNama
      );

    } else if (data.hapusGambar) {

      hapusGambarDrive(gambar);

      gambar = '';

    }

    sheet.getRange(i + 1, 2).setValue(data.judul);
    sheet.getRange(i + 1, 3).setValue(data.deskripsi);
    sheet.getRange(i + 1, 4).setValue(data.konten);
    sheet.getRange(i + 1, 5).setValue(gambar);
    sheet.getRange(i + 1, 6).setValue(data.status);

    logActivity(
      'ADMIN',
      'UPDATE_EDUKASI',
      data.judul
    );

    return {

      success: true,
      message: 'Edukasi berhasil diupdate.'

    };

  }

  return {

    success: false,
    message: 'Data tidak ditemukan.'

  };

}


/* =====================================================
   HAPUS EDUKASI
===================================================== */

function hapusEdukasi(id) {

  const sheet =
    getSpreadsheet()
    .getSheetByName(SHEET_EDUKASI);

  const values =
    sheet
    .getDataRange()
    .getValues();

  for (let i = 1; i < values.length; i++) {

    if (values[i][0] != id) continue;

    hapusGambarDrive(values[i][4]);

    sheet.deleteRow(i + 1);

    logActivity(
      'ADMIN',
      'HAPUS_EDUKASI',
      id
    );

    return {

      success: true,
      message: 'Edukasi berhasil dihapus.'

    };

  }

  return {

    success: false,
    message: 'Edukasi tidak ditemukan.'

  };

}


/* =====================================================
   REGULASI (USER - HANYA YANG AKTIF)
===================================================== */
function getRegulasi() {
  const sheet = getSpreadsheet().getSheetByName(SHEET_REGULASI);
  const data = sheet.getDataRange().getValues();
  const result = [];

  for (let i = 1; i < data.length; i++) {
    if (
      data[i][0] &&
      data[i][4] === 'Aktif'
    ) {
      result.push({
        id: data[i][0],
        judul: data[i][1],
        deskripsi: data[i][2],
        link: data[i][3]
      });
    }
  }

  return result.reverse();
}

/* =====================================================
   REGULASI (ADMIN - SEMUA DATA)
===================================================== */
function getRegulasiAdmin() {
  const sheet = getSpreadsheet().getSheetByName(SHEET_REGULASI);
  const data = sheet.getDataRange().getValues();
  const result = [];

  for (let i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    result.push({
      id: data[i][0],
      judul: data[i][1],
      deskripsi: data[i][2],
      link: data[i][3],
      status: data[i][4]
    });
  }
  return result.reverse();
}

/* =====================================================
   TAMBAH REGULASI
===================================================== */
function tambahRegulasi(data) {
  const sheet = getSpreadsheet().getSheetByName(SHEET_REGULASI);
  sheet.appendRow([
    generateID('REG'),
    data.judul,
    data.deskripsi,
    data.link,
    data.status || 'Aktif'
  ]);

  logActivity('ADMIN', 'TAMBAH_REGULASI', data.judul);
  return { success: true, message: 'Regulasi berhasil ditambahkan.' };
}

/* =====================================================
   UPDATE REGULASI
===================================================== */
function updateRegulasi(data) {
  const sheet = getSpreadsheet().getSheetByName(SHEET_REGULASI);
  const values = sheet.getDataRange().getValues();

  for (let i = 1; i < values.length; i++) {
    if (values[i][0] != data.id) continue;
    
    sheet.getRange(i + 1, 2).setValue(data.judul);
    sheet.getRange(i + 1, 3).setValue(data.deskripsi);
    sheet.getRange(i + 1, 4).setValue(data.link);
    sheet.getRange(i + 1, 5).setValue(data.status);
    
    logActivity('ADMIN', 'UPDATE_REGULASI', data.judul);
    return { success: true, message: 'Regulasi berhasil diupdate.' };
  }
  return { success: false, message: 'Data tidak ditemukan.' };
}

/* =====================================================
   HAPUS REGULASI
===================================================== */
function hapusRegulasi(id) {
  const sheet = getSpreadsheet().getSheetByName(SHEET_REGULASI);
  const values = sheet.getDataRange().getValues();

  for (let i = 1; i < values.length; i++) {
    if (values[i][0] != id) continue;
    
    sheet.deleteRow(i + 1);
    logActivity('ADMIN', 'HAPUS_REGULASI', id);
    return { success: true, message: 'Regulasi berhasil dihapus.' };
  }
  return { success: false, message: 'Regulasi tidak ditemukan.' };
}

/* =====================================================
   USERS
===================================================== */

function getUsers() {

  const sheet =
    getSpreadsheet()
    .getSheetByName(SHEET_USERS);


  const data =
    sheet
    .getDataRange()
    .getValues();


  const result = [];


  for (let i = 1; i < data.length; i++) {

    if (!data[i][0]) continue;


    result.push({

      id: data[i][0],

      username: data[i][1],

      nama: data[i][3],

      instansi: data[i][4],

      jabatan: data[i][5],

      role: data[i][6],

      status: data[i][7]

    });

  }


  return result;

}


/* =====================================================
   TAMBAH USER
===================================================== */

function tambahUser(data) {

  const sheet =
    getSpreadsheet()
    .getSheetByName(SHEET_USERS);


  sheet.appendRow([

    generateID('USR'),

    data.username,

    data.password,

    data.nama,

    data.instansi,

    data.jabatan,

    data.role || 'PEGAWAI',

    'Aktif',

    now()

  ]);


  return {

    success: true,

    message:
      'Pengguna berhasil ditambahkan.'

  };

}


/* =====================================================
   LOG AKTIVITAS
===================================================== */

function logActivity(
  username,
  aktivitas,
  keterangan
) {

  try {

    const sheet =
      getSpreadsheet()
      .getSheetByName(
        SHEET_LOG
      );


    sheet.appendRow([

      generateID('LOG'),

      username,

      aktivitas,

      keterangan,

      now()

    ]);

  }

  catch (err) {

    console.log(err);

  }

}


/* =====================================================
   UPLOAD FOLDER
===================================================== */

function getOrCreateUploadFolder() {

  const folderName =
    'SIGAR - Bukti Gratifikasi';


  const folders =
    DriveApp
    .getFoldersByName(
      folderName
    );


  if (folders.hasNext()) {

    return folders.next();

  }


  return DriveApp
    .createFolder(
      folderName
    );

}


/* =====================================================
   ID GENERATOR
===================================================== */

function generateID(prefix) {

  return (

    prefix +

    '-' +

    new Date()
      .getTime() +

    '-' +

    Math.floor(
      Math.random() * 1000
    )

  );

}


/* =====================================================
   DATE
===================================================== */

function now() {

  return Utilities.formatDate(

    new Date(),

    TIMEZONE,

    'yyyy-MM-dd HH:mm:ss'

  );

}


function formatDate(date) {

  if (!date) return '';


  try {

    return Utilities.formatDate(

      new Date(date),

      TIMEZONE,

      'dd MMM yyyy'

    );

  }

  catch (e) {

    return date;

  }

}

/* =====================================================
   FOLDER GAMBAR (folder Drive lama "SIGAR - Pamflet",
   sekarang dipakai bersama untuk gambar Edukasi & Informasi)
===================================================== */

function getPamfletFolder() {

  const folderName = "SIGAR - Pamflet";

  const folders = DriveApp.getFoldersByName(folderName);

  if (folders.hasNext()) {
    return folders.next();
  }

  return DriveApp.createFolder(folderName);
}


/* =====================================================
   UPLOAD GAMBAR (dipakai oleh Edukasi & Informasi)
   Catatan: menu "Pamflet" pada Admin sudah dihapus.
   Fitur unggah gambarnya tetap terhubung dan dipakai
   ulang di sini (folder Drive "SIGAR - Pamflet") supaya
   setiap konten Edukasi & Informasi juga bisa
   menampilkan gambar.
===================================================== */

function simpanGambarKeDrive(gambarBase64, gambarType, gambarNama) {

  const folder = getPamfletFolder();

  const bytes = Utilities.base64Decode(gambarBase64);

  const blob = Utilities.newBlob(
    bytes,
    gambarType,
    gambarNama
  );

  const file = folder.createFile(blob);

  file.setSharing(
    DriveApp.Access.ANYONE_WITH_LINK,
    DriveApp.Permission.VIEW
  );

  return "https://drive.google.com/thumbnail?id=" + file.getId() + "&sz=w1000";

}


function hapusGambarDrive(urlGambar) {

  try {

    if (!urlGambar) return;

    const id = urlGambar.match(/[-\w]{25,}/);

    if (id) {

      DriveApp.getFileById(id[0]).setTrashed(true);

    }

  } catch (e) {}

}


function updateUser(data) {
  const sheet = getSpreadsheet().getSheetByName(SHEET_USERS);
  const values = sheet.getDataRange().getValues();
  
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(data.id)) {
      sheet.getRange(i + 1, 2).setValue(data.username);
      if (data.password && data.password.trim() !== '') { 
        sheet.getRange(i + 1, 3).setValue(data.password); 
      }
      sheet.getRange(i + 1, 4).setValue(data.nama);
      sheet.getRange(i + 1, 5).setValue(data.instansi);
      sheet.getRange(i + 1, 6).setValue(data.jabatan);
      sheet.getRange(i + 1, 7).setValue(data.role);
      sheet.getRange(i + 1, 8).setValue(data.status);
      
      logActivity(data.username, 'UPDATE_USER', 'Edit akun: ' + data.username);
      return { success: true, message: 'Data pengguna berhasil diperbarui.' };
    }
  }
  return { success: false, message: 'Pengguna tidak ditemukan.' };
}


function hapusUser(id) {
  const sheet = getSpreadsheet().getSheetByName(SHEET_USERS);
  const values = sheet.getDataRange().getValues();
  
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(id)) {
      const hapusUsername = values[i][1];
      sheet.deleteRow(i + 1);
      logActivity('SISTEM', 'HAPUS_USER', 'Menghapus akun: ' + hapusUsername);
      return { success: true, message: 'Pengguna berhasil dihapus.' };
    }
  }
  return { success: false, message: 'Pengguna tidak ditemukan.' };
}