import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import imageCompression from 'browser-image-compression'; 
import './App.css'; 

const RAW_MARKETING_LIST = [
  "AJI","DEDE","AAM SAEPUL MALIK", "ABAD ROBBANI NAHARUSSURUR", "ABDUL BASIT SADAM HUSEN", "ABDUL KARIM", "ABDUL MUIS",
  "ACHMAD KURNIAWAN", "ACHMAD SARBANUN", "ADAM BAKRI ZAINAL", "ADE PUTRI IBRAHIM", "AFROZAH",
  "AGIL BAYU PRASETYO", "AGRIZAL DWI PRATAMA", "AGUNG PUTERA NEGARA", "AGUNG TEGUH PRABOWO", "AGUS KURNIAWAN",
  "AGUS PURWANTO", "AGUS SHOFYAN", "AGUS SUMANTRI", "AGUS WASITO", "AGUS WURYANTO",
  "AHMAD AFFANDI AULIA", "AHMAD BAHRUL ULUM", "AHMAD CHAIN IBRAHIM", "AHMAD KHOLIK", "AHMAD QODARULLAH",
  "AHMAD RONDI", "AHMAD SHOFIYYULLAH", "AINUR ROFIQ", "AISYAH", "AISYAH SUCI RAHMAH",
  "AJI EMAN SAPUTRA", "AKBAR TANJUNG", "AKMAL DAYAN", "ALI HASFA NAWAWI",
  "ALI MUNIROM", "ALIYANI", "ALLIYA SITI SOFA NADIYA", "AMIR MAHPUDIN", "AMRINSYAH",
  "ANALIS HIKMAWATI", "ANANDITA MURTYANDINI LARAS", "ANANG WIDODO", "ANDHIKA PUTRA AGUS PRATAMA", "ANDRI ASTOYO",
  "ANGGI CAHYO GIRI", "ANGGIT SALMAN FARSI", "ANIS SALAM MUJANAH", "ANNIS DARMAYANTI", "ANNIZA NELLA PRATIWI",
  "ARDI DEWA PRAHARA", "ARI KURNIATI", "ARIF MURSITO NUGROHO", "ARIF RAHMAN", "ARIF RAMADHANI BUDIONO",
  "ARIYANI", "ARMY TELAGA IMAN", "ASEP ABDUL MALIK", "ASEP BUNGSU HARIYANTO", "ASEP YANA SUNARYO",
  "ASRIZAL NUR PRATAMA", "ASTRYANA KACI", "ATRIYANI", "AULIA RAHMAWATI TSANIYA", "AZAM PASHA",
  "AZKA. SPI", "AZZA ANDJARWATI", "BADRIYAH", "BAGUS SAPUTRA", "BENI SETIAWAN",
  "BENI SETIYAWAN", "BING HARYATNO", "BOY TIRTA SUMRIYADI", "BUDI HERYADI", "BUDI MUHIBBUDIN",
  "BUDI SANTOSO", "BUDIONO", "CAHYO PURNOMO", "CANDRA PRAMUDHITA", "CARINA AURELIA",
  "CASKU PRISANDIKI", "CHAERUL BANIN", "CHANDRA EKA PERMANA", "DADANG MEDIYANSAH", "DANIS ADITHIO PRATAMA",
  "DEASY RATNA DEWI", "DEDE AMINUDIN", "DEDE HERDIANSYAH", "DEDEN CANDRA",
  "DEDI SETYAWAN", "DENDI DARMANSYAH", "DENI AHMAD SARIPUDIN", "DEPI SOPIANA", "DESI MURNIATI",
  "DESSY MARIA SELFREE", "DESTI WIRANTI", "DEVY KHADAFI", "DEWANTO PURNOMO", "DEWI KUSWATI",
  "DHIAN ANGGRAINI", "DHYAN INDAH HARIYATI,S.KOM", "EKA WAHYU APRIYANTI", "EKA WIDIA WATI", "ELIVIA NILADIANTI",
  "ELVIAN ENDAHNIWATI", "ENDANG AGUSTIANI", "ENOK KOMARIAH", "EPAN", "ERI HERIAWAN",
  "ERIK ARDIYANSYAH", "ERIK SAPUTRA", "ESA FADIL SAEFULLAH", "EVAN", "FATIKHA JURNIA RIZQI NADEWI",
  "FATINA NABILA", "FEBBY ARDIANSYAH", "FERRY ASMORO", "FIRMANSYAH ABDUL ROHMAN SIDIK", "FITRI HARYATI",
  "FITRI YOSFITA", "FITRIA MONALISA", "FITRIADI ADDAS", "GIO KARJONO", "GUNARTI",
  "GUNAWAN", "HADI PURWANTO", "HARI SUBAKTI", "HARIATI", "HARIKIN",
  "HAYYU MUTIAH IDHAM", "HEFRIN PUTRA SETYAWAN", "HENDAR FIRMANSYAH", "HENDRI ARIPIN", "HENDRI NURHADI",
  "HENNY ARYANTINI", "HERDI", "HERLI INDRA", "HERNI NURMALASARI", "HERNI RAHMAWATI, S.TP",
  "HERU", "HERY SUSILAJAYA SAPUTRA", "HESTI UTAMI", "HIDAYAT", "HUMAIDI",
  "HUSAMA ALLAUDDIN BARIQ", "I WAYAN ISA WHARDANA", "IDA FARIDA", "IIN INDAH SUMINAR, SE", "IIS HARYONO",
  "IKHLAS", "IKHSAN NURGAWAR, S.TP", "IKHWAN MAKHMUD", "IMAM RIADI", "IMAM SAFII",
  "INDAH NURUL ASSA'DIYAH", "IRMA ESSANOVIA", "IRSTA MARINA", "IRSYAD HANAFI", "ISKANDAR SYAH",
  "ISMALIA MERSITA", "ISNI GUSRINI", "ISNU PRASETYO", "ISTILAWATI", "JELI ADAM",
  "JIMMY DESILBA", "JOKO SUDARMO, S.E., M.M., BKP.", "JONI AFRIADI, SH", "JUSIDA SULISTYOWATI", "KARTIKA PERTIWI BERLIAN",
  "KASMIRAN", "KEISYA AULIA AZISKA", "KEMAD RAHARDJO", "KHANSA ANNAWA ZAHRA RUMAISHA", "KIKI ARISKA",
  "KOKOM KOMALASARI", "KURNIAWAN SUGIARTO", "KUSERI AMK", "LAILATUR ROKHMAH", "LANTI LASTARI, S.PI",
  "LENI KUSMAYA", "LESMONO PUTRO", "LIHAN KHUDORI", "LOLA FEBRIANA RAHAYU", "M. AZIZ ABDULLOH",
  "M. AZKA ADE PUTRA WULANDARI", "M. IRCHAM", "M. SAIFUL RIZAL", "M. TOHAR", "MAR'ATUSHOLIHAH",
  "MARSELINA", "MARWAN LA DOPI", "MASRUROH", "MASUDI", "MATORI",
  "MAULANA HASANUDIN", "MAULINA APRIANTI", "MEFTI CHOIRUDIN", "MEI SHINTA ABUTARY", "MERI ARISKA",
  "MIFTAHUDIN", "MIZAB AR RAHMAT ADNYANA", "MOCHAMMAD NAUVALL", "MOH AMIN DRS", "MOH ANSHORI",
  "MOH RAMLI", "MOHAMAD RIYADI", "MOHAMMAD KHOIRUL RIFAI", "MUCH ELVITO SETYA SANTOSO", "MUCHAMAD MASDUEQI",
  "MUHAMAD DIMAS AFRIZA", "MUHAMAD IQBAL ADHITIANSYAH", "MUHAMAD IRFAN ZULKIPLI", "MUHAMAD RAFINALDI TANJUNG", "MUHAMAD RIDWAN SAFII",
  "MUHAMMAD ARSYAD", "MUHAMMAD AS'AD BAIQUNI ROFI", "MUHAMMAD AZIZ SETYA", "MUHAMMAD FADLY AKBAR", "MUHAMMAD FAISAL",
  "MUHAMMAD FATHI HALMI", "MUHAMMAD HAFIZ RAMADHAN", "MUHAMMAD ICHSAN KURNIAWAN", "MUHAMMAD JOKO FAMILI", "MUHAMMAD KHAMDANI",
  "MUHAMMAD MIRZAQ HIDAYAT", "MUHAMMAD NESAN", "MUHAMMAD RAFIQ KARIM", "MUHAMMAD RAFLY", "MUHAMMAD RAUP",
  "MUHAMMAD ROHMATULLOH", "MUHAMMAD SYUHARI", "MUHAMMAD WAHYU BAYHAQI", "MUHAMMAD YASAK", "MUKHAMAD AINUR ROFIK",
  "MUKHAMMAD AGUNG HARIANTO", "MURNI SETYOWATI", "MUUHAMAD MUSTOPA", "NAHDA AULIA MUSTOPA", "NAJUA SYARIFADILAH",
  "NANANG ABDULLAH", "NANANG DHARMANSYAH", "NARSITO", "NAYLA NAZWA AQUELA", "NAZHIDAN ANNAR HUFIAN",
  "NELY AMALIA", "NETTY RIANTINI", "NIA RISA DEWI", "NINING ANI RETNOWATI",
  "NONO DARSONO", "NOOR MUHAMAD G BUSTOMI", "NORMA PUSPITA", "NOVI SINTIASARI", "NOVILIA ROIISATULUMMAH",
  "NOVITA SULISTIANI", "NUR AINI", "NUR ASIAH", "NUR JANNA HARAHAP", "NUR KHAIRIYAH ANITA NASUTION",
  "NUR LAILA PURWANINGSIH", "NURDIN", "NURHASANUDIN", "NURUL FAUZIAH", "OKTALIA",
  "PANDI APANDI", "PIHA APANDI", "POPON WASIDAH", "PRAPTO BUDI SANTOSO", "PRAWOTO",
  "PUJI RAHAYU", "PURWANTO", "RAHARJO PRIANTORO BUDHI PRASETYO", "RAHMAT ANDRIANA", "RAHMI",
  "RAIS ALIM FATHONI", "RAMA MAULANA", "RATNA DIAH", "RENDI WARSA PURNAMA, SH", "RESTI NURJANAH, S. PD",
  "RESTU PRADEVA ADIANSYAH", "RIANIYANTI MAHFUDZOH", "RIDWAN HIDAYATULLOH", "RINA DIAN ROSITAWATI", "RINDU HENDRIAWAN, S. TP",
  "RINI KUSTIANA SYAHRI,ST", "RIPKI SETIAWAN", "RITA ERMAYA", "RIZA HANDAYANI", "RIZKI HERMAWAN",
  "RIZKY GUSTAF", "ROHAEMI", "ROHMAD HIDAYAT", "ROHMAN", "ROHNUDIN",
  "RONI BAHARI", "RONI FEBRIAWAN", "ROSIHAN ANWAR", "RUDI IRAWAN", "RUDI RAHARJA",
  "RUHMAN", "RUSYANA", "RYAN FAKHEZI REFNALDI", "SAEFUL ROCHMAN,SKOM, MM", "SAHRIL SIDIK",
  "SAID MUSTOPA", "SAIFURROHMAN", "SALEHUDIN", "SALSABILA NUR ASYFA", "SAPTADI NURYADI",
  "SARAH MAULIDIA", "SARI SUFLOWER", "SARIFA HASMIYATI", "SARIONO WIJANARKO", "SARYADI ATMOSUWITO",
  "SEPTI CAHYANINGTIAS", "SEPTYANA ERSITA", "SIGIT PURNOMO", "SITI JUBAIDAH", "SITI KOMARIAH",
  "SITI LUTFIKA KHOFSOH", "SITI MASHURA", "SITUTIK WULANDARI", "SLAMET OPRIANTO", "SOERIP JOKO MULYONO",
  "SOPIAN EKO MEIYANTO", "SRI GUNARTO", "SRI HARTATI", "SRI IDAYATI", "SRI MUJIANIK",
  "SRI NINGSIH S. PD.I", "SRI PUJIANTORO", "SRI RAHAYU", "SRI SUPARWATI,. SE", "SRI WIDAYANTI",
  "SUDI HILMAWAN", "SUDIRMAN, CH", "SUHADI", "SUHARTININGSIH", "SUHENDANG",
  "SUKANDI", "SULASTRI", "SUMARTINI TRI NURCAHYANI", "SUPARMAN", "SUPRIYADI",
  "SUPRIYANTO", "SUPRIYANTO (DUPLIKAT)", "SURYANAH", "SURYAWATI",
  "SUSI YULIYANTI", "SUSILAWATI", "SUSILAWATI (DUPLIKAT)", "SUTEJO", "SUTIAH",
  "SUTRIAWATI", "SUWITO", "SUWOTO", "SUYANTO", "SYAIFUL AMRI",
  "SYAMSUL HIDAYAH", "SYARIF MUHAMMAD", "SYARIFAH SOFIYAH AL", "SYIFA FATIROH", "SYIFA NURFADHILLAH",
  "TARIS YUSFIANA", "TAUFIQ AKBAR MAULANA", "TEGUH MARJUKI", "TERINA PUNGKY SEPTA", "TONY KURNIAWAN",
  "ULFAH SAFAAH", "VIKA PUSPA AINI PUTRI", "VIRLY NUR RAHMAYANI", "WAHYU HIDAYAT", "WAHYU KHOLIFAH",
  "WAHYU SETIAWAN", "WAHYU SYARIFUDIN", "WALI HAMBALI", "WALOYO", "WIRASTI APRITA SURYANINGTYAS",
  "WULAN MUNGGARINI", "WULAN SARI", "WULANDARI KEMALA MAYTA", "YANA LAELIANA", "YATINI",
  "YAYAN SOPYAN", "YEK IMAM", "YENI GANTINI", "YOGI BINTORO", "YOKO DWI PURNOMO",
  "YUDI PRASETYO BUDHI", "YUDI TRI SOLEH HUDIN", "YULIA PUTRI ALISHA", "YUNI RISWANTI", "YUSUP MAULANA",
  "YUSUP RACHMAN", "YUYUN MUSTAFA", "YUYUN YUNANI", "ZAENAL BAGUS WIBISONO", "ZAENAL MUTAQIN",
  "ZAINUL ARIFIN", "ZAKIATUS SOLIKAH", "ZAKIYAH", "ZULKARNAIN", "NI'MATUL ISNAINI", "SURACHMAN"
];

const MARKETING_LIST = RAW_MARKETING_LIST.map((name, index) => ({
  value: name, 
  label: `${name} (${String(index + 1).padStart(3, '0')})`, 
  code: String(index + 1).padStart(3, '0') 
}));

function App() {
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzhK-9ci-EA9xkjpc0hbDsGzYJBjmjNHbPaQa29aEpjp2SQWayWJxlSpDB7f0X7Xpae/exec";
  const UPLOAD_URL = "https://ayohalal2026.id/api/upload.php"; 

  const [step, setStep] = useState(() => {
    const savedStep = localStorage.getItem('halalFormStep_vFinal3');
    return savedStep ? parseInt(savedStep) : 1;
  });

  const [status, setStatus] = useState('');
  
  // State Error Modal
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);

  // --- STATE UNTUK ALAMAT OTOMATIS ---
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);

  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('halalFormData_vFinal3');
    return savedData ? JSON.parse(savedData) : {
      marketing: null,
      persetujuan: false,
      nama: '',
      nik: '',
      fotoKTP: null,
      wa: '',
      namaUsaha: '',
      alamatDetail: { provinsi: null, kota: null, kecamatan: null, kelurahan: null, rtrw: '', kodepos: '' },
      produkList: [{ nama: '', fotoProduk: null, urlProduk: '', fotoPendamping: null, urlPendamping: '' }],
      bahan: '',
      alur: '',
      statusNIB: 'tidak_punya', 
      nibDetail: { nomor: '', email: '', password: '' },
      statusSihalal: 'belum_punya',
      sihalalDetail: { email: '', password: '' }
    };
  });

  // --- API WILAYAH ---
  useEffect(() => {
    fetch('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json')
      .then(res => res.json())
      .then(data => setProvinces(data.map(p => ({ value: p.id, label: p.name }))));
  }, []);

  useEffect(() => {
    if (formData.alamatDetail.provinsi?.value) {
      fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${formData.alamatDetail.provinsi.value}.json`)
        .then(res => res.json())
        .then(data => setRegencies(data.map(r => ({ value: r.id, label: r.name }))));
    } else { setRegencies([]); }
  }, [formData.alamatDetail.provinsi]);

  useEffect(() => {
    if (formData.alamatDetail.kota?.value) {
      fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${formData.alamatDetail.kota.value}.json`)
        .then(res => res.json())
        .then(data => setDistricts(data.map(d => ({ value: d.id, label: d.name }))));
    } else { setDistricts([]); }
  }, [formData.alamatDetail.kota]);

  useEffect(() => {
    if (formData.alamatDetail.kecamatan?.value) {
      fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${formData.alamatDetail.kecamatan.value}.json`)
        .then(res => res.json())
        .then(data => setVillages(data.map(v => ({ value: v.id, label: v.name }))));
    } else { setVillages([]); }
  }, [formData.alamatDetail.kecamatan]);

  useEffect(() => {
    const dataToSave = { 
      ...formData, 
      fotoKTP: null, 
      produkList: (formData.produkList || []).map(p => ({...p, fotoProduk: null, fotoPendamping: null})) 
    };
    localStorage.setItem('halalFormData_vFinal3', JSON.stringify(dataToSave));
    localStorage.setItem('halalFormStep_vFinal3', step.toString());
  }, [formData, step]);

  const selectStyles = {
    control: base => ({ ...base, borderColor: '#ccc', padding: '6px', borderRadius: '6px' }),
    option: (base, state) => ({ ...base, backgroundColor: state.isSelected ? '#2e7d32' : 'white', color: state.isSelected ? 'white' : '#000', cursor: 'pointer' })
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') setFormData({ ...formData, [name]: checked });
    else setFormData({ ...formData, [name]: value });
  };

  const handleAlamatManual = (e) => setFormData({ ...formData, alamatDetail: { ...formData.alamatDetail, [e.target.name]: e.target.value } });

  const handleWilayahChange = (field, option) => {
    setFormData(prev => ({
      ...prev,
      alamatDetail: {
        ...prev.alamatDetail,
        [field]: option,
        ...(field === 'provinsi' && { kota: null, kecamatan: null, kelurahan: null }),
        ...(field === 'kota' && { kecamatan: null, kelurahan: null }),
        ...(field === 'kecamatan' && { kelurahan: null })
      }
    }));
  };

  const handleNIBChange = (e) => setFormData({ ...formData, nibDetail: { ...formData.nibDetail, [e.target.name]: e.target.value } });
  const handleSihalalChange = (e) => setFormData({ ...formData, sihalalDetail: { ...formData.sihalalDetail, [e.target.name]: e.target.value } });

  const addProduk = () => {
    if (formData.produkList.length < 7) {
      setFormData({ ...formData, produkList: [...formData.produkList, { nama: '', fotoProduk: null, urlProduk: '', fotoPendamping: null, urlPendamping: '' }] });
    } else {
      showErrorModal("Maksimal 7 Produk.");
    }
  };

  const handleProdukChange = (index, field, value) => {
    const newList = [...formData.produkList];
    newList[index][field] = value;
    setFormData({ ...formData, produkList: newList });
  };

  const uploadToHosting = async (file) => {
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    try {
      const response = await fetch(UPLOAD_URL, { method: "POST", body: formDataUpload });
      const result = await response.json();
      if (result.status === 'success') return result.url;
      else throw new Error(result.message);
    } catch (error) { return null; }
  };

  const handleFileChange = async (e, index = null, type = null) => {
    const file = e.target.files[0];
    if (!file) return;
    const options = { maxSizeMB: 1, maxWidthOrHeight: 1200, useWebWorker: true };
    try {
      const compressedFile = await imageCompression(file, options);
      if (e.target.name === 'fotoKTP') setFormData(prev => ({ ...prev, fotoKTP: compressedFile }));
      else if (index !== null) {
        const fieldName = type === 'produk' ? 'fotoProduk' : 'fotoPendamping';
        const newList = [...formData.produkList];
        newList[index][fieldName] = compressedFile;
        setFormData({ ...formData, produkList: newList });
        const url = await uploadToHosting(compressedFile);
        if (url) {
           const urlField = type === 'produk' ? 'urlProduk' : 'urlPendamping';
           newList[index][urlField] = url;
           setFormData({ ...formData, produkList: newList });
        }
      }
    } catch (error) { showErrorModal("Gagal memproses gambar."); }
  };

  const showErrorModal = (msg) => {
    setErrorMessage(msg);
    setShowError(true);
  };

  const handleNext = () => {
    if (!formData.marketing) return showErrorModal("⚠️ Pilih Pendamping dulu.");
    if (!formData.persetujuan) return showErrorModal("⚠️ Anda harus mencentang persetujuan!");
    if (!formData.nama) return showErrorModal("⚠️ Isi Nama Lengkap.");
    
    // VALIDASI NIK 16 DIGIT
    if (!formData.nik || formData.nik.toString().length !== 16) return showErrorModal("⚠️ NIK harus tepat 16 digit.");
    if (!formData.fotoKTP) return showErrorModal("⚠️ Wajib Upload Foto KTP.");
    
    // VALIDASI WA MINIMAL 10 DIGIT
    if (!formData.wa || formData.wa.toString().length < 10) return showErrorModal("⚠️ Nomor WA minimal 10 digit.");

    setStep(2);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.namaUsaha) return showErrorModal("Isi Nama Usaha");
    const ad = formData.alamatDetail;
    if(!ad.provinsi || !ad.kota || !ad.kecamatan || !ad.kelurahan || !ad.rtrw || !ad.kodepos) return showErrorModal("Lengkapi Semua Kolom Alamat!");
    if (!formData.produkList || formData.produkList.length === 0 || !formData.produkList[0].nama) return showErrorModal("Minimal isi 1 produk");

    if (formData.statusNIB === 'punya') {
      if(!formData.nibDetail?.nomor || !formData.nibDetail?.email || !formData.nibDetail?.password) return showErrorModal("Lengkapi Data NIB");
    }
    
    if (formData.statusSihalal === 'sudah_punya') {
      if(!formData.sihalalDetail?.email || !formData.sihalalDetail?.password) return showErrorModal("Lengkapi Data Akun Sihalal");
    }

    setStatus('loading'); 

    const urlKTP = await uploadToHosting(formData.fotoKTP);
    if (!urlKTP) { setStatus(''); return showErrorModal("Gagal Upload KTP"); }

    const dataToSend = {
      marketing: formData.marketing.value,
      marketingCode: formData.marketing.code || '000',
      persetujuan: "SETUJU",
      nama: formData.nama,
      nik: formData.nik,
      wa: formData.wa,
      urlKTP: urlKTP,
      namaUsaha: formData.namaUsaha,
      alamatDetail: {
        rtrw: ad.rtrw,
        kelurahan: ad.kelurahan.label,
        kecamatan: ad.kecamatan.label,
        kota: ad.kota.label,
        provinsi: ad.provinsi.label,
        kodepos: ad.kodepos
      },
      produkList: formData.produkList,    
      bahan: formData.bahan,
      alur: formData.alur,
      statusNIB: formData.statusNIB,
      nibDetail: formData.nibDetail,
      statusSihalal: formData.statusSihalal,
      sihalalDetail: formData.sihalalDetail
    };

    try {
      await fetch(SCRIPT_URL, { method: 'POST', body: JSON.stringify(dataToSend) });
      setStatus('success');
      localStorage.removeItem('halalFormData_vFinal3');
      localStorage.removeItem('halalFormStep_vFinal3');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  if (status === 'success') return <div className="container success-box"><h1 style={{color:'green'}}>✅ Berhasil Terkirim!</h1><p>Data Anda aman di server kami.</p><button className="btn-submit" onClick={() => window.location.reload()}>Isi Baru</button></div>;

  return (
    <>
      {status === 'loading' && <div className="loading-overlay"><div className="spinner"></div><p>Mengirim Data...</p></div>}

      {/* MODAL ERROR CUSTOM */}
      {showError && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: 'white', padding: '20px', borderRadius: '10px', maxWidth: '80%', textAlign: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{color: '#c0392b', margin: '0 0 10px 0'}}>Perhatian!</h2>
            <p style={{fontSize: '16px', marginBottom: '20px'}}>{errorMessage}</p>
            <button onClick={() => setShowError(false)} style={{
              backgroundColor: '#2980b9', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px'
            }}>OK, Saya Perbaiki</button>
          </div>
        </div>
      )}

      <div className="container">
        <h1>FORMULIR PENDAFTARAN SERTIFIKASI HALAL (SELF DECLARE)</h1>
        
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <div className="form-group">
                <label>Pendamping (Marketing) *</label>
                <Select options={MARKETING_LIST} value={formData.marketing} onChange={(opt) => setFormData({...formData, marketing: opt})} styles={selectStyles} placeholder="Cari Nama..." />
              </div>

              <div className="section-header">DATA DIRI</div>

              <div className="form-group" style={{background:'#fdf6e3', padding:'15px', borderRadius:'8px', border:'1px solid #f39c12', marginBottom:'20px'}}>
                <label style={{fontWeight:'bold', color:'#d35400'}}>Pernyataan Pelaku Usaha:</label>
                <div style={{fontSize:'14px', lineHeight:'1.5', color:'#444', margin:'10px 0'}}>
                  <p>1. Saya selaku pelaku usaha secara sadar dalam memberikan data yang sesuai dan benar.</p>
                  <p style={{marginTop:'5px'}}>2. Saya selaku pelaku usaha secara jujur dan mengakui bahwa bahan-bahan yang digunakan adalah halal.</p>
                </div>
                <label className="checkbox-wrapper">
                  <input type="checkbox" name="persetujuan" checked={formData.persetujuan} onChange={handleChange} />
                  <span style={{fontWeight:'bold'}}>Saya Setuju dan Paham</span>
                </label>
              </div>

              <div className="form-group">
                <label>Nama Lengkap Pelaku Usaha (Sesuai KTP) *</label>
                <input className="input-field" type="text" name="nama" value={formData.nama} onChange={handleChange} required placeholder="Contoh: Budi Santoso" />
              </div>

              <div className="form-group">
                <label>Nomor KTP (NIK) *</label>
                <input className="input-field" type="number" name="nik" value={formData.nik} onChange={handleChange} required placeholder="16 digit angka" />
              </div>

              <div className="form-group">
                <label>Foto KTP *</label>
                <input className="input-field" type="file" name="fotoKTP" accept="image/*" onChange={handleFileChange} />
                {formData.fotoKTP && <small style={{color:'green'}}>✅ Siap Upload</small>}
              </div>

              <div className="form-group">
                <label>Nomor WA / Telepon *</label>
                <input className="input-field" type="number" name="wa" value={formData.wa} onChange={handleChange} required />
              </div>

              <button type="button" className="btn-next" onClick={handleNext}>LANJUT LANGKAH 2 👉</button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="section-header">DATA USAHA</div>

              <div className="form-group"><label>Nama Usaha *</label><input className="input-field" type="text" name="namaUsaha" value={formData.namaUsaha} onChange={handleChange} required /></div>

              <div className="form-group">
                <label>Alamat Lokasi Usaha *</label>
                <div style={{display:'grid', gap:'10px'}}>
                  <Select placeholder="Pilih Provinsi..." options={provinces} value={formData.alamatDetail.provinsi} onChange={(opt) => handleWilayahChange('provinsi', opt)} styles={selectStyles} />
                  <Select placeholder="Pilih Kota/Kab..." options={regencies} value={formData.alamatDetail.kota} onChange={(opt) => handleWilayahChange('kota', opt)} styles={selectStyles} isDisabled={!formData.alamatDetail.provinsi} />
                  <Select placeholder="Pilih Kecamatan..." options={districts} value={formData.alamatDetail.kecamatan} onChange={(opt) => handleWilayahChange('kecamatan', opt)} styles={selectStyles} isDisabled={!formData.alamatDetail.kota} />
                  <Select placeholder="Pilih Kelurahan/Desa..." options={villages} value={formData.alamatDetail.kelurahan} onChange={(opt) => handleWilayahChange('kelurahan', opt)} styles={selectStyles} isDisabled={!formData.alamatDetail.kecamatan} />
                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                    <input className="input-field" placeholder="RT/RW (Manual)" name="rtrw" value={formData.alamatDetail.rtrw} onChange={handleAlamatManual} />
                    <input className="input-field" placeholder="Kode Pos" name="kodepos" value={formData.alamatDetail.kodepos} onChange={handleAlamatManual} />
                  </div>
                </div>
              </div>

              <div className="section-header">PRODUK & FOTO (Max 7)</div>
              {(formData.produkList || []).map((item, index) => (
                <div key={index} style={{border:'1px solid #ddd', padding:'15px', borderRadius:'8px', marginBottom:'15px', backgroundColor:'#fff'}}>
                  <label>Nama Produk {index+1} *</label>
                  <input className="input-field" type="text" value={item.nama} onChange={(e) => handleProdukChange(index, 'nama', e.target.value)} placeholder="Contoh: Keripik Pisang" />
                  <div style={{display:'flex', gap:'10px', marginTop:'10px'}}>
                    <div style={{flex:1}}>
                      <label style={{fontSize:'12px', fontWeight:'bold'}}>Foto Produk</label>
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, index, 'produk')} />
                      {item.urlProduk && <small style={{color:'green'}}>✅ Uploaded</small>}
                    </div>
                    <div style={{flex:1}}>
                      <label style={{fontSize:'12px', fontWeight:'bold'}}>Foto Verval</label>
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, index, 'pendamping')} />
                      {item.urlPendamping && <small style={{color:'green'}}>✅ Uploaded</small>}
                    </div>
                  </div>
                </div>
              ))}
              {(formData.produkList || []).length < 7 && (
                <button type="button" onClick={addProduk} style={{background:'#f39c12', color:'white', padding:'10px', border:'none', borderRadius:'5px', marginBottom:'20px', width:'100%', cursor:'pointer', fontWeight:'bold'}}>+ Tambah Produk Lain</button>
              )}

              <div className="form-group"><label>Bahan & Merek</label><textarea className="input-field" name="bahan" value={formData.bahan} onChange={handleChange} required></textarea></div>
              <div className="form-group"><label>Alur Proses</label><textarea className="input-field" name="alur" value={formData.alur} onChange={handleChange} required></textarea></div>

              <div className="form-group" style={{background:'#f9f9f9', padding:'15px', borderRadius:'8px', border:'1px solid #eee', marginBottom:'15px'}}>
                <label>Kepemilikan NIB *</label>
                <div style={{display:'flex', gap:'20px', marginBottom:'10px', marginTop:'5px'}}>
                  <label style={{cursor:'pointer'}}><input type="radio" name="statusNIB" value="tidak_punya" checked={formData.statusNIB === 'tidak_punya'} onChange={(e) => setFormData({...formData, statusNIB: e.target.value})} /> Tidak Punya</label>
                  <label style={{cursor:'pointer'}}><input type="radio" name="statusNIB" value="punya" checked={formData.statusNIB === 'punya'} onChange={(e) => setFormData({...formData, statusNIB: e.target.value})} /> Punya</label>
                </div>
                {formData.statusNIB === 'punya' && (
                  <div style={{paddingLeft:'10px', borderLeft:'3px solid #27ae60'}}>
                    <input className="input-field" placeholder="Nomor NIB" name="nomor" value={formData.nibDetail?.nomor || ''} onChange={handleNIBChange} style={{marginBottom:'5px'}} />
                    <input className="input-field" placeholder="Email OSS" name="email" value={formData.nibDetail?.email || ''} onChange={handleNIBChange} style={{marginBottom:'5px'}} />
                    <input className="input-field" placeholder="Password OSS" name="password" value={formData.nibDetail?.password || ''} onChange={handleNIBChange} />
                  </div>
                )}
              </div>

              <div className="form-group" style={{background:'#e8f5e9', padding:'15px', borderRadius:'8px', border:'1px solid #a5d6a7'}}>
                <label>Kepemilikan Akun SIHALAL *</label>
                <div style={{display:'flex', gap:'20px', marginBottom:'10px', marginTop:'5px'}}>
                  <label style={{cursor:'pointer'}}><input type="radio" name="statusSihalal" value="belum_punya" checked={formData.statusSihalal === 'belum_punya'} onChange={(e) => setFormData({...formData, statusSihalal: e.target.value})} /> Belum Punya</label>
                  <label style={{cursor:'pointer'}}><input type="radio" name="statusSihalal" value="sudah_punya" checked={formData.statusSihalal === 'sudah_punya'} onChange={(e) => setFormData({...formData, statusSihalal: e.target.value})} /> Sudah Punya</label>
                </div>
                {formData.statusSihalal === 'sudah_punya' && (
                  <div style={{paddingLeft:'10px', borderLeft:'3px solid #2e7d32'}}>
                    <input className="input-field" placeholder="Email Sihalal" name="email" value={formData.sihalalDetail?.email || ''} onChange={handleSihalalChange} style={{marginBottom:'5px'}} />
                    <input className="input-field" placeholder="Password Sihalal" name="password" value={formData.sihalalDetail?.password || ''} onChange={handleSihalalChange} />
                  </div>
                )}
              </div>

              <div className="btn-container">
                <button type="button" className="btn-submit btn-back" onClick={() => setStep(1)}>👈 KEMBALI</button>
                <button type="submit" className="btn-submit">KIRIM DATA ✅</button>
              </div>
            </>
          )}
        </form>
      </div>
    </>
  );
}

export default App;
