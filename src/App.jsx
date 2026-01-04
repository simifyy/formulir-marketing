import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import imageCompression from 'browser-image-compression'; 
import './App.css'; 

function App() {
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycby0sw-adlPYohzgIOmJIygHDyeTI8x7QR9EmdVTniQTT2btlIPdP9AQh0ehMfSKLVHp/exec";

  const UPLOAD_URL = "https://immjakartapusat.org/api/upload.php"; 

  const [step, setStep] = useState(() => {
    const savedStep = localStorage.getItem('halalFormStep');
    return savedStep ? parseInt(savedStep) : 1;
  });

  const [status, setStatus] = useState('');

  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('halalFormData');
    return savedData ? { ...JSON.parse(savedData), fotoKTP: null, fotoProduk: [], fotoPendamping: null } : {
      marketing: null,
      persetujuan: false,
      email: '',
      nama: '',
      nik: '',
      fotoKTP: null,
      alamat: '',
      wa: '',
      namaUsaha: '',
      alamatUsaha: '',
      produk: '',
      fotoProduk: [],
      bahan: '',
      alur: '',
      nib: '',
      fotoPendamping: null
    };
  });

  useEffect(() => {
    const dataToSave = { ...formData, fotoKTP: null, fotoProduk: [], fotoPendamping: null };
    localStorage.setItem('halalFormData', JSON.stringify(dataToSave));
    localStorage.setItem('halalFormStep', step.toString());
  }, [formData, step]);

  const optionsMarketing = [
    { value: 'AJI', label: 'AJI (001)' },
    { value: 'DEDE', label: 'DEDE (002)' },
    { value: 'EVAN', label: 'EVAN (003)' },
  ];

  const selectStyles = {
    control: base => ({ 
      ...base, backgroundColor: '#ffffff', borderColor: '#ccc', padding: '6px', 
      borderRadius: '6px', fontSize: '16px', boxShadow: 'none', color: '#000',
      '&:hover': { borderColor: '#2e7d32' }
    }),
    singleValue: base => ({ ...base, color: '#000' }), 
    input: base => ({ ...base, color: '#000' }),       
    placeholder: base => ({ ...base, color: '#888' }), 
    option: (base, state) => ({
      ...base, backgroundColor: state.isSelected ? '#2e7d32' : state.isFocused ? '#e8f5e9' : 'white',
      color: state.isSelected ? 'white' : '#000', padding: '12px', cursor: 'pointer'
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
      // Setting kompresi ringan (Max 1MB) sebelum upload ke hosting
      const options = { maxSizeMB: 1, maxWidthOrHeight: 1200, useWebWorker: true };

      try {
        if (name === 'fotoProduk') {
          // Handle Banyak Foto
          const compressedFilesPromises = Array.from(files).map(file => imageCompression(file, options));
          const compressedFiles = await Promise.all(compressedFilesPromises);
          setFormData(prev => ({ ...prev, [name]: compressedFiles })); 
        } else {
          // Handle Satu Foto
          const compressedFile = await imageCompression(files[0], options);
          setFormData(prev => ({ ...prev, [name]: compressedFile }));
        }
      } catch (error) {
        console.error("Gagal kompresi:", error);
        alert("Gagal memproses gambar.");
      }
    }
  };

  // --- FUNGSI UPLOAD KE HOSTING PHP ---
  const uploadToHosting = async (file) => {
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const response = await fetch(UPLOAD_URL, { method: "POST", body: formDataUpload });
      const result = await response.json();
      
      if (result.status === 'success') {
        return result.url; // Berhasil! Kembalikan Link Gambar (https://...)
      } else {
        throw new Error(result.message || "Gagal upload ke server");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      return null;
    }
  };

  const handleNext = () => {
    if (!formData.marketing) return alert("⚠️ Mohon pilih Pendamping dulu.");
    if (!formData.persetujuan) return alert("⚠️ Anda harus mencentang persetujuan!");
    
    // Validasi Step 1
    if (!formData.nama || !formData.nik || !formData.alamat || !formData.wa || !formData.email) {
      return alert("⚠️ Mohon lengkapi semua kolom bertanda bintang (*).");
    }
    // Cek Foto KTP (Khusus file object)
    if (!formData.fotoKTP) return alert("⚠️ Mohon upload Foto KTP.");
    
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.namaUsaha || !formData.produk || (!formData.fotoProduk || formData.fotoProduk.length === 0) || !formData.bahan || !formData.alur || !formData.nib) {
      return alert("⚠️ Lengkapi data usaha Anda!");
    }

    setStatus('loading'); 

    try {
      // 1. UPLOAD FOTO KTP
      const urlKTP = await uploadToHosting(formData.fotoKTP);
      if (!urlKTP) throw new Error("Gagal upload KTP. Cek koneksi.");

      // 2. UPLOAD FOTO PENDAMPING (Opsional)
      let urlPendamping = "";
      if (formData.fotoPendamping) {
        urlPendamping = await uploadToHosting(formData.fotoPendamping);
      }

      // 3. UPLOAD FOTO PRODUK (Banyak)
      // Kita upload satu per satu secara paralel
      const uploadPromises = formData.fotoProduk.map(file => uploadToHosting(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      // Filter jika ada yang gagal, lalu gabung jadi string dipisah enter
      const validUrls = uploadedUrls.filter(url => url !== null);
      if (validUrls.length === 0) throw new Error("Gagal upload foto produk.");
      const urlProdukString = validUrls.join("\n"); 

      // 4. KIRIM DATA LINK KE GOOGLE SHEET
      const dataToSend = {
        marketing: formData.marketing ? formData.marketing.value : '',
        persetujuan: "SETUJU",
        email: formData.email,
        nama: formData.nama,
        nik: formData.nik,
        alamat: formData.alamat,
        wa: formData.wa,
        urlKTP: urlKTP,             // INI SUDAH JADI LINK HTTPS
        namaUsaha: formData.namaUsaha,
        alamatUsaha: formData.alamatUsaha,
        produk: formData.produk,
        urlProduk: urlProdukString, // INI JUGA LINK HTTPS
        bahan: formData.bahan,
        alur: formData.alur,
        nib: formData.nib,
        urlPendamping: urlPendamping // INI JUGA LINK HTTPS
      };

      await fetch(SCRIPT_URL, { method: 'POST', body: JSON.stringify(dataToSend) });
      
      setStatus('success');
      localStorage.removeItem('halalFormData');
      localStorage.removeItem('halalFormStep');
      
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan: " + error.message);
      setStatus('error');
    }
  };

  // Indikator File UI
  const FileIndicator = ({ fileData, isMultiple }) => {
    if (!fileData) return null;
    if (isMultiple && fileData.length === 0) return null;

    return (
      <div style={{marginTop:'5px', fontSize:'13px', color:'#2e7d32', fontWeight:'bold'}}>
        ✅ {isMultiple ? `${fileData.length} foto siap upload` : `File siap: ${fileData.name}`}
      </div>
    );
  };

  if (status === 'success') {
    return (
      <div className="container" style={{textAlign:'center', padding: '60px 20px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
        <div style={{fontSize: '70px', marginBottom:'20px'}}>🎉</div>
        <h1 style={{fontSize: '32px', marginBottom:'10px'}}>Berhasil Terkirim!</h1>
        <p style={{fontSize: '16px', color:'#666', maxWidth:'400px', lineHeight:'1.6'}}>
          Terima kasih. Data & Foto telah tersimpan aman di server kami.
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
          <p className="loading-title">Mengupload ke Server...</p>
          <p className="loading-text">Sedang mengirim foto ke hosting Anda...</p>
        </div>
      )}

      <div className="container">
        <h1>PENDAFTARAN SERTIFIKASI HALAL</h1>
        <p className="subtitle">Program Self Declare (Gratis)</p>

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
                  value={formData.marketing} 
                  onChange={(opt) => setFormData({...formData, marketing: opt})} 
                  placeholder="Cari nama pendamping..."
                  styles={selectStyles}
                />
              </div>

              <div className="section-header">INFORMASI PRIBADI</div>

              <div className="form-group">
                <label>Pernyataan Pelaku Usaha:</label>
                <div className="statement-box">
                  <p>1. Saya memberikan data yang sesuai dan benar untuk syarat sertifikasi halal self declare.</p>
                  <p>2. Saya menjamin bahan yang digunakan dalam produk adalah halal.</p>
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
                <FileIndicator fileData={formData.fotoKTP} isMultiple={false} />
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
                <label>Nama Usaha <span>*</span></label>
                <input className="input-field" type="text" name="namaUsaha" value={formData.namaUsaha} onChange={handleChange} required placeholder="Contoh: Keripik Pisang Berkah" />
              </div>

              <div className="form-group">
                <label>Alamat Lokasi Usaha <span>*</span></label>
                <textarea className="input-field" name="alamatUsaha" rows="3" value={formData.alamatUsaha} onChange={handleChange} required placeholder="Alamat tempat produksi..."></textarea>
              </div>

              <div className="form-group">
                <label>Nama Produk <span>*</span></label>
                <input className="input-field" type="text" name="produk" value={formData.produk} onChange={handleChange} required placeholder="Contoh: Keripik Pisang Coklat" />
              </div>

              <div className="form-group">
                <label>Foto Produk (Bisa Banyak) <span>*</span></label>
                <input className="input-field" type="file" name="fotoProduk" accept="image/*" multiple onChange={handleFileChange} />
                <FileIndicator fileData={formData.fotoProduk} isMultiple={true} />
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
                <FileIndicator fileData={formData.fotoPendamping} isMultiple={false} />
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
