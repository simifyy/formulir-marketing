import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import imageCompression from 'browser-image-compression'; 
import './App.css'; 

function App() {
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycby0sw-adlPYohzgIOmJIygHDyeTI8x7QR9EmdVTniQTT2btlIPdP9AQh0ehMfSKLVHp/exec";

  // --- 1. INISIALISASI STATE DENGAN LOCAL STORAGE ---
  const [step, setStep] = useState(() => {
    const savedStep = localStorage.getItem('halalFormStep');
    return savedStep ? parseInt(savedStep) : 1;
  });

  const [status, setStatus] = useState('');

  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('halalFormData');
    return savedData ? JSON.parse(savedData) : {
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
      fotoProduk: [], 
      bahan: '',
      alur: '',
      nib: '',
      fotoPendamping: ''
    };
  });

  // --- 2. AUTO-SAVE KE LOCAL STORAGE ---
  useEffect(() => {
    localStorage.setItem('halalFormData', JSON.stringify(formData));
    localStorage.setItem('halalFormStep', step.toString());
  }, [formData, step]);

  const optionsMarketing = [
    { value: 'AJI', label: 'AJI (001)' },
    { value: 'DEDE', label: 'DEDE (002)' },
    { value: 'EVAN', label: 'EVAN (003)' },
  ];

  const selectStyles = {
    control: base => ({ 
      ...base, 
      backgroundColor: '#ffffff', 
      borderColor: '#ccc',
      padding: '6px', 
      borderRadius: '6px',
      fontSize: '16px',
      boxShadow: 'none',
      color: '#000',
      '&:hover': { borderColor: '#2e7d32' }
    }),
    singleValue: base => ({ ...base, color: '#000' }), 
    input: base => ({ ...base, color: '#000' }),       
    placeholder: base => ({ ...base, color: '#888' }), 
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#2e7d32' : state.isFocused ? '#e8f5e9' : 'white',
      color: state.isSelected ? 'white' : '#000',
      padding: '12px',
      cursor: 'pointer'
    })
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    const name = e.target.name;
    
    if (files && files.length > 0) {
      const options = {
        maxSizeMB: 0.1,        
        maxWidthOrHeight: 800, 
        useWebWorker: true,
        initialQuality: 0.7   
      };

      try {
        if (name === 'fotoProduk') {
          const compressedFilesPromises = Array.from(files).map(async (file) => {
            const compressed = await imageCompression(file, options);
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.readAsDataURL(compressed);
              reader.onloadend = () => resolve(reader.result);
            });
          });

          const base64Array = await Promise.all(compressedFilesPromises);
          setFormData(prev => ({ ...prev, [name]: base64Array })); 
        } else {
          const file = files[0];
          const compressedFile = await imageCompression(file, options);
          const reader = new FileReader();
          reader.readAsDataURL(compressedFile);
          reader.onloadend = () => {
            setFormData(prev => ({ ...prev, [name]: reader.result }));
          };
        }
      } catch (error) {
        console.error("Gagal kompresi:", error);
        alert("Gagal memproses gambar. Coba lagi.");
      }
    }
  };

  const handleNext = () => {
    if (!formData.marketing) return alert("⚠️ Mohon pilih Pendamping dulu.");
    if (!formData.persetujuan) return alert("⚠️ Anda harus mencentang persetujuan!");
    
    if (!formData.nama || !formData.nik || (!formData.fotoKTP && !localStorage.getItem('halalFormData')) || !formData.alamat || !formData.wa || !formData.email) {
      if (!formData.fotoKTP) return alert("⚠️ Mohon lengkapi semua kolom bertanda bintang (*).");
    }
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.namaUsaha || !formData.produk || (!formData.fotoProduk || formData.fotoProduk.length === 0) || !formData.bahan || !formData.alur || !formData.nib) {
      return alert("⚠️ Lengkapi data usaha Anda! (Termasuk NIB, ketik 'Tidak Punya' jika kosong)");
    }

    setStatus('loading'); 

    const dataToSend = {
      marketing: formData.marketing ? formData.marketing.value : '',
      persetujuan: "SETUJU",
      email: formData.email,
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
      nib: formData.nib,
      fotoPendamping: formData.fotoPendamping
    };

    try {
      await fetch(SCRIPT_URL, { method: 'POST', body: JSON.stringify(dataToSend) });
      
      setStatus('success');
      localStorage.removeItem('halalFormData');
      localStorage.removeItem('halalFormStep');
      
    } catch (error) {
      setStatus('error');
    }
  };

  const FileIndicator = ({ hasData }) => {
    if (!hasData || hasData.length === 0) return null;
    return (
      <div style={{marginTop:'5px', fontSize:'13px', color:'#2e7d32', fontWeight:'bold', display:'flex', alignItems:'center', gap:'5px'}}>
        <span>✅ Foto tersimpan di memori.</span>
        <span style={{fontSize:'11px', fontWeight:'normal', color:'#666'}}>(Klik 'Pilih File' jika ingin mengubah)</span>
      </div>
    );
  };

  if (status === 'success') {
    return (
      <div className="container" style={{textAlign:'center', padding: '60px 20px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
        <div style={{fontSize: '70px', marginBottom:'20px'}}>🎉</div>
        <h1 style={{fontSize: '32px', marginBottom:'10px'}}>Berhasil Terkirim!</h1>
        <p style={{fontSize: '16px', color:'#666', maxWidth:'400px', lineHeight:'1.6'}}>
          Terima kasih. Data pendaftaran sertifikasi halal Anda telah kami terima.
        </p>
        <button className="btn-submit" onClick={() => window.location.reload()} style={{marginTop:'40px', width:'auto', paddingLeft:'40px', paddingRight:'40px'}}>
          Isi Formulir Baru
        </button>
      </div>
    );
  }

  return (
    <> 
      {status === 'loading' && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p className="loading-title">Sedang Mengirim Data...</p>
          <p className="loading-text">Mohon jangan tutup halaman ini.</p>
        </div>
      )}

      <div className="container">
        <h1>FORMULIR PENDAFTARAN SERTIFIKASI HALAL (SELF DECLARE) </h1>
        <p className="subtitle">Isi data dengan benar dan jujur.</p>

        <div style={{marginBottom:'25px'}}>
          <div className="step-info">Langkah {step} dari 2</div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{width: step === 1 ? '50%' : '100%'}}></div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          {step === 1 && (
            <>
              <div className="form-group">
                <label>Pilih Pendamping <span>*</span></label>
                <Select 
                  options={optionsMarketing} 
                  value={formData.marketing} // Load nilai dari state
                  onChange={(opt) => setFormData({...formData, marketing: opt})} 
                  placeholder="Cari nama pendamping..."
                  styles={selectStyles}
                />
              </div>

              <div className="section-header">INFORMASI PRIBADI</div>

              <div className="form-group">
                <label>Pernyataan Pelaku Usaha:</label>
                <div className="statement-box">
                  <p>1. Saya selaku pelaku usaha secara sadar dalam memberikan data yang sesuai dan benar, yang nantinya akan digunakan sebagai syarat dalam melakukan pengajuan sertifikasi halal self declare.</p>
                  <p>2. Saya selaku pelaku usaha secara jujur dan mengakui bahwa bahan bahan yang digunakan dalam produk yang diajukan sertifikat halal self declare adalah bahan bahan yang baik dan halal secara perolehannya.</p>
                </div>
                <label className="checkbox-wrapper">
                  <input type="checkbox" name="persetujuan" checked={formData.persetujuan} onChange={handleChange} />
                  <span>Saya Setuju dan Paham</span>
                </label>
              </div>

              <div className="form-group">
                <label>Email Aktif <span>*</span></label>
                <input className="input-field" type="text" name="email" value={formData.email} onChange={handleChange} required placeholder="Ketik 'Tidak Punya' jika kosong" />
              </div>

              <div className="form-group">
                <label>Nama Lengkap (Sesuai KTP) <span>*</span></label>
                <input className="input-field" type="text" name="nama" value={formData.nama} onChange={handleChange} required placeholder="Contoh: Budi Santoso" />
              </div>

              <div className="form-group">
                <label>NIK KTP <span>*</span></label>
                <input className="input-field" type="number" name="nik" value={formData.nik} onChange={handleChange} required placeholder="16 digit angka" />
              </div>

              <div className="form-group">
                <label>Upload Foto KTP <span>*</span></label>
                <input className="input-field" type="file" name="fotoKTP" accept="image/*" onChange={handleFileChange} />
                <FileIndicator hasData={formData.fotoKTP} />
              </div>

              <div className="form-group">
                <label>Alamat Lengkap <span>*</span></label>
                <textarea className="input-field" name="alamat" rows="3" value={formData.alamat} onChange={handleChange} required placeholder="Jalan, RT/RW, Kelurahan, Kecamatan..."></textarea>
              </div>

              <div className="form-group">
                <label>Nomor WhatsApp <span>*</span></label>
                <input className="input-field" type="number" name="wa" value={formData.wa} onChange={handleChange} required placeholder="08xxxxxxxxxx" />
              </div>

              <div className="btn-container">
                <button type="button" className="btn-next" onClick={handleNext}>LANJUT LANGKAH 2 👉</button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="section-header">INFORMASI USAHA & PRODUK</div>

              <div className="form-group">
                <label>Nama Usaha Anda <span>*</span></label>
                <input className="input-field" type="text" name="namaUsaha" value={formData.namaUsaha} onChange={handleChange} required placeholder="Contoh: Keripik Pisang Berkah" />
              </div>

              <div className="form-group">
                <label>Alamat Lokasi Usaha <span>*</span></label>
                <textarea className="input-field" name="alamatUsaha" rows="3" value={formData.alamatUsaha} onChange={handleChange} required placeholder="Alamat tempat produksi..."></textarea>
              </div>

              <div className="form-group">
                <label>Produk Yang Dijual <span>*</span></label>
                <input className="input-field" type="text" name="produk" value={formData.produk} onChange={handleChange} required placeholder="Contoh: Keripik Pisang Coklat" />
              </div>

              <div className="form-group">
                <label>Foto Produk (Bisa Banyak) <span>*</span></label>
                <input className="input-field" type="file" name="fotoProduk" accept="image/*" multiple onChange={handleFileChange} />
                <FileIndicator hasData={formData.fotoProduk} />
                {Array.isArray(formData.fotoProduk) && formData.fotoProduk.length > 0 && (
                  <small style={{display:'block', marginTop:'2px', color:'#666'}}>
                    {formData.fotoProduk.length} foto terpilih.
                  </small>
                )}
              </div>

              <div className="form-group">
                <label>Bahan & Merek <span>*</span></label>
                <textarea className="input-field" name="bahan" rows="4" value={formData.bahan} onChange={handleChange} required placeholder="Contoh: &#10;1. Pisang (Pasar)&#10;2. Minyak Goreng (Tropical)&#10;3. Gula (Gulaku)"></textarea>
              </div>

              <div className="form-group">
                <label>Alur Proses Pembuatan <span>*</span></label>
                <textarea className="input-field" name="alur" rows="4" value={formData.alur} onChange={handleChange} required placeholder="Jelaskan singkat dari bahan mentah sampai jadi..."></textarea>
              </div>

              <div className="form-group">
                <label>Nomor NIB <span>*</span></label>
                <input className="input-field" type="text" name="nib" value={formData.nib} required placeholder="Ketik 'Tidak Punya' jika kosong" onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Foto Pendampingan (Opsional)</label>
                <input className="input-field" type="file" name="fotoPendamping" accept="image/*" onChange={handleFileChange} />
                <FileIndicator hasData={formData.fotoPendamping} />
              </div>

              <div className="btn-container">
                <button type="button" className="btn-submit btn-back" onClick={() => setStep(1)}>👈 KEMBALI</button>
                <button type="submit" className="btn-submit">KIRIM DATA SEKARANG ✅</button>
              </div>
            </>
          )}
        </form>
      </div>
    </>
  );
}

export default App;
