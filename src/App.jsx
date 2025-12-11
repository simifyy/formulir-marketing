import React, { useState } from 'react';
import Select from 'react-select';
import imageCompression from 'browser-image-compression'; 
import './App.css'; 

function App() {
  // GANTI URL INI DENGAN URL SCRIPT TERBARU KAMU
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycby0sw-adlPYohzgIOmJIygHDyeTI8x7QR9EmdVTniQTT2btlIPdP9AQh0ehMfSKLVHp/exec";

  const [step, setStep] = useState(1);
  const [status, setStatus] = useState('');

  const optionsMarketing = [
    { value: 'AJI', label: 'AJI (001)' },
    { value: 'DEDE', label: 'DEDE (002)' },
    { value: 'EVAN', label: 'EVAN (003)' },
  ];

  // Style dropdown agar responsive
  const selectStyles = {
    control: base => ({ 
      ...base, 
      borderColor: '#aaa', 
      padding: '8px', // Padding lebih besar
      borderRadius: '8px',
      fontSize: '16px' 
    }),
    singleValue: base => ({ ...base, color: '#000' }),
    input: base => ({ ...base, color: '#000' }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#2e7d32' : state.isFocused ? '#c8e6c9' : 'white',
      color: state.isSelected ? 'white' : '#000',
      padding: '12px' // Opsi lebih mudah disentuh
    })
  };

  const [formData, setFormData] = useState({
    marketing: null,
    persetujuan: false,
    email: '',
    nama: '',
    nik: '',
    fotoKTP: '',
    alamat: '',
    wa: '',
    // Step 2
    namaUsaha: '',
    alamatUsaha: '',
    produk: '',
    fotoProduk: '',
    bahan: '',
    alur: '',
    nib: '',
    fotoPendamping: ''
  });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const name = e.target.name;

    if (file) {
      const options = {
        maxSizeMB: 0.1,        
        maxWidthOrHeight: 800, 
        useWebWorker: true,
        initialQuality: 0.7   
      };

      try {
        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);
        reader.onloadend = () => {
          setFormData(prev => ({ ...prev, [name]: reader.result }));
        };
      } catch (error) {
        console.error("Gagal kompresi:", error);
        alert("Gagal mengompres gambar.");
      }
    }
  };

  const handleNext = () => {
    if (!formData.marketing) return alert("Pilih Pendamping dulu di bagian atas!");
    if (!formData.persetujuan) return alert("Anda harus mencentang persetujuan!");
    if (!formData.nama || !formData.nik || !formData.fotoKTP || !formData.alamat || !formData.wa) {
      return alert("Mohon lengkapi semua data wajib (tanda merah *)");
    }
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.namaUsaha || !formData.produk || !formData.fotoProduk || !formData.bahan || !formData.alur) {
      return alert("Lengkapi data usaha!");
    }

    setStatus('loading');

    const dataToSend = {
      marketing: formData.marketing.value,
      persetujuan: "SETUJU",
      email: formData.email || "Tidak Memiliki Email",
      nama: formData.nama,
      nik: formData.nik,
      alamat: formData.alamat,
      wa: formData.wa,
      fotoKTP: formData.fotoKTP,
      namaUsaha: formData.namaUsaha,
      alamatUsaha: formData.alamatUsaha,
      produk: formData.produk,
      fotoProduk: formData.fotoProduk,
      bahan: formData.bahan,
      alur: formData.alur,
      nib: formData.nib || "Belum Memiliki NIB",
      fotoPendamping: formData.fotoPendamping
    };

    try {
      await fetch(SCRIPT_URL, { method: 'POST', body: JSON.stringify(dataToSend) });
      setStatus('success');
    } catch (error) {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="container" style={{textAlign:'center', padding: '40px 20px'}}>
        <h1 style={{color:'green', fontSize: '28px'}}>✅ Terima Kasih!</h1>
        <p style={{fontSize: '16px', lineHeight: '1.6'}}>Data pendaftaran Anda telah berhasil dikirim ke sistem kami.</p>
        <button className="btn-submit" onClick={() => window.location.reload()} style={{marginTop:'30px'}}>Isi Formulir Baru</button>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>FORMULIR PENDAFTARAN</h1>
      <h2 style={{color: '#f57c00'}}>SERTIFIKASI HALAL</h2>
      <p className="subtitle">Isi data dengan benar dan jujur.</p>

      <form onSubmit={handleSubmit}>

        {step === 1 && (
          <>
            <div className="form-group" style={{borderBottom:'2px solid #ddd', paddingBottom:'20px'}}>
              <label>Pilih Pendamping (Marketing) <span>*</span></label>
              <Select 
                options={optionsMarketing} 
                onChange={(opt) => setFormData({...formData, marketing: opt})} 
                placeholder="Pilih Nama..."
                styles={selectStyles}
              />
            </div>

            <div className="section-header">INFORMASI PRIBADI</div>

            <div className="form-group">
              <label>Pernyataan Pelaku Usaha:</label>
              <div className="statement-box">
                <p>1. Saya selaku pelaku usaha secara sadar memberikan data yang sesuai dan benar...</p>
                <p>2. Saya mengakui bahwa bahan-bahan yang digunakan adalah halal...</p>
              </div>
              <label className="checkbox-wrapper">
                <input type="checkbox" name="persetujuan" onChange={handleChange} />
                <span>Saya Setuju dan Paham</span>
              </label>
            </div>

            <div className="form-group">
              <label>Email Aktif</label>
              <input className="input-field" type="text" name="email" onChange={handleChange} placeholder="Ketik 'Tidak Memiliki Email' jika kosong" />
            </div>

            <div className="form-group">
              <label>Nama (Sesuai KTP) <span>*</span></label>
              <input className="input-field" type="text" name="nama" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>NIK (Sesuai KTP) <span>*</span></label>
              <input className="input-field" type="number" name="nik" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Unggah Foto KTP <span>*</span></label>
              <input className="input-field" type="file" name="fotoKTP" accept="image/*" onChange={handleFileChange} required />
              <small style={{color:'#666', fontSize:'12px', display:'block', marginTop:'5px'}}>Foto otomatis diperkecil agar cepat.</small>
            </div>

            <div className="form-group">
              <label>Alamat Lengkap (Sesuai KTP) <span>*</span></label>
              <textarea className="input-field" name="alamat" rows="3" onChange={handleChange} required></textarea>
            </div>

            <div className="form-group">
              <label>Nomor WA Aktif <span>*</span></label>
              <input className="input-field" type="number" name="wa" onChange={handleChange} required />
            </div>

            <button type="button" className="btn-next" onClick={handleNext}>LANJUT KE INFO USAHA 👉</button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="section-header">INFORMASI USAHA & PRODUK</div>

            <div className="form-group">
              <label>Nama Usaha Anda <span>*</span></label>
              <input className="input-field" type="text" name="namaUsaha" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Alamat Lokasi Usaha <span>*</span></label>
              <textarea className="input-field" name="alamatUsaha" rows="3" onChange={handleChange} required></textarea>
            </div>

            <div className="form-group">
              <label>Produk yang Dijual <span>*</span></label>
              <input className="input-field" type="text" name="produk" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Foto Produk <span>*</span></label>
              <input className="input-field" type="file" name="fotoProduk" accept="image/*" onChange={handleFileChange} required />
            </div>

            <div className="form-group">
              <label>Bahan & Merek (Contoh: Gula: Gulaku, dst) <span>*</span></label>
              <textarea className="input-field" name="bahan" rows="5" onChange={handleChange} required></textarea>
            </div>

            <div className="form-group">
              <label>Alur Proses Pembuatan <span>*</span></label>
              <textarea className="input-field" name="alur" rows="4" onChange={handleChange} required></textarea>
            </div>

            <div className="form-group">
              <label>No NIB</label>
              <input className="input-field" type="text" name="nib" placeholder="Isi 'Belum Memiliki NIB' jika kosong" onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Upload Foto Pendampingan</label>
              <input className="input-field" type="file" name="fotoPendamping" accept="image/*" onChange={handleFileChange} />
            </div>

            {/* Container Tombol agar rapi di HP */}
            <div className="btn-container">
              <button type="button" className="btn-submit btn-back" onClick={() => setStep(1)}>👈 KEMBALI</button>
              <button type="submit" className="btn-submit" style={{marginTop:0}}>KIRIM DATA ✅</button>
            </div>
          </>
        )}

        {status === 'loading' && (
          <div style={{marginTop:'20px', padding:'15px', backgroundColor:'#e0f2f1', borderRadius:'8px', color:'#00695c', textAlign:'center'}}>
            <p style={{margin:0, fontWeight:'bold', fontSize:'16px'}}>🚀 Sedang Mengirim Data...</p>
            <p style={{margin:'5px 0 0 0', fontSize:'13px'}}>Mohon tunggu sebentar.</p>
          </div>
        )}
        
        {status === 'error' && (
          <p className="status-msg" style={{color:'red', fontWeight:'bold'}}>❌ Gagal mengirim. Cek koneksi internet Anda.</p>
        )}
      </form>
    </div>
  );
}

export default App;