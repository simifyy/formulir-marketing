import React, { useState } from 'react';
import Select from 'react-select';
import './App.css'; 

function App() {
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycby0sw-adlPYohzgIOmJIygHDyeTI8x7QR9EmdVTniQTT2btlIPdP9AQh0ehMfSKLVHp/exec";

  const [step, setStep] = useState(1);
  const [status, setStatus] = useState('');

  const optionsMarketing = [
    { value: 'AJI', label: 'AJI (001)' },
    { value: 'DEDE', label: 'DEDE (002)' },
    { value: 'EVAN', label: 'EVAN (003)' },
  ];

  const selectStyles = {
    control: base => ({ ...base, borderColor: '#aaa', padding: '5px' }),
    singleValue: base => ({ ...base, color: '#000' }),
    input: base => ({ ...base, color: '#000' }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#2e7d32' : state.isFocused ? '#c8e6c9' : 'white',
      color: state.isSelected ? 'white' : '#000'
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const name = e.target.name;
    if (file) {
      if (file.size > 2 * 1024 * 1024) return alert("File terlalu besar (Max 2MB)");
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, [name]: reader.result }));
      reader.readAsDataURL(file);
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
      <div className="container" style={{textAlign:'center'}}>
        <h1 style={{color:'green'}}>✅ Terima Kasih!</h1>
        <p>Data Anda berhasil dikirim.</p>
        <button className="btn-submit" onClick={() => window.location.reload()}>Isi Lagi</button>
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
                Saya Setuju dan Paham
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

            <div style={{display:'flex', marginTop:'20px'}}>
              <button type="button" className="btn-submit btn-back" onClick={() => setStep(1)}>👈 KEMBALI</button>
              <button type="submit" className="btn-submit">KIRIM FORMULIR ✅</button>
            </div>
          </>
        )}

        {status === 'loading' && <p className="status-msg">⏳ Sedang mengirim data...</p>}
        {status === 'error' && <p className="status-msg" style={{color:'red'}}>❌ Gagal mengirim. Cek internet.</p>}
      </form>
    </div>
  );
}

export default App;