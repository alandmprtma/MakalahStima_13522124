"use client"
import StickyBar from '../components/stickybar';
import CSVUploader from '../components/CSVUploader';
import { useState } from 'react';


export default function Home() {
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  const baseStyle = "mx-4 border-black rounded px-7 pb-[8px] pt-[10px] font-black text-sm uppercase leading-normal transition duration-150 ease-in-out focus:outline-none focus:ring-0";

  const dynamicStyle = (isActive) => 
    `${baseStyle} ${isActive ? 'text-black border-neutral-100 bg-neutral-500 bg-opacity-50' : 'text-black border-black border-2 hover:border-neutral-100 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-neutral-40'}`;
  
  const [activeAlgorithm, setActiveAlgorithm] = useState('');
  const [file, setFile] = useState(null); // State to hold the uploaded file
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [result, setResult] = useState(null);

  
const RiskProfileInfo = ({ profile }) => {
  switch (profile) {
    case 'Konservatif':
      return (
        <div className="mt-4 p-4 border rounded bg-gray-100 text-black w-[600px]">
          <h5 className="text-lg font-semibold">Konservatif</h5>
          <p>Profil risiko konservatif cenderung menghindari risiko dan lebih memilih keamanan modal. Mereka biasanya berinvestasi dalam aset dengan volatilitas rendah seperti obligasi pemerintah, deposito berjangka, dan reksa dana pasar uang. Tujuannya adalah pelestarian modal dengan sedikit perhatian terhadap pertumbuhan yang tinggi.</p>
        </div>
      );
    case 'Moderat':
      return (
        <div className="mt-4 p-4 border rounded bg-gray-100 text-black w-[600px]">
          <h5 className="text-lg font-semibold">Moderat</h5>
          <p>Profil risiko moderat mencari keseimbangan antara risiko dan pengembalian. Mereka bersedia menerima sedikit volatilitas untuk mendapatkan pengembalian yang lebih baik daripada investasi konservatif. Portofolio mereka sering kali mencakup kombinasi saham dan obligasi.</p>
        </div>
      );
    case 'Agresif':
      return (
        <div className="mt-4 p-4 border rounded bg-gray-100 text-black w-[600px]">
          <h5 className="text-lg font-semibold">Agresif</h5>
          <p>Profil risiko agresif bersedia mengambil risiko yang lebih tinggi dengan harapan mendapatkan pengembalian yang lebih besar. Mereka cenderung berinvestasi dalam saham, properti, dan pasar berkembang yang menawarkan potensi pertumbuhan tinggi tetapi juga datang dengan tingkat volatilitas yang tinggi.</p>
        </div>
      );
    default:
      return null;
  }
};
  
  const formatPercentage = (value) => {
    return (value * 100).toFixed(2) + '%';
  };

  const handleAlgorithmClick = (algorithm) => {
    console.log("Algorithm", algorithm);
    setActiveAlgorithm(algorithm);
  };

  const handleSubmit = async (event) => {
    setLoading(true);
    setSubmitted(false);
    event.preventDefault();
    if (activeAlgorithm == ''){
      setErrorMessage("Silahkan pilih profil risiko.");
      await delay(1500);
      setLoading(false)
      setErrorMessage(null);
      return;
    }
    if (!file) {
      setErrorMessage("Silahkan upload file CSV.");
      await delay(1500);
      setLoading(false);
      setErrorMessage(null);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('capacity', activeAlgorithm);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/optimize', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResult(data);
      setSubmitted(true);
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Update state with the selected file
  };

  return (
    <html>
    <body>
    <div className="flex flex-col w-full items-center bg-white pb-[35px]">
      <StickyBar />
      <div className="mt-5">
        <label htmlFor="lengthInput" className="flex text-sm font-medium text-black justify-center">
          Dataset Harga Saham (.csv):
        </label>
      </div>
      <div className='h-[750px]'>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="mb-4 translate-x-[120px] mt-3 text-black"
      />
      <CSVUploader file={file} />
      </div>
      <h4 className="mb-2 text-xl font-semibold text-black">Profil Risiko</h4>
      <form onSubmit={handleSubmit}>
        <div>
          <div className='flex justify-center'>
            <button
              type="button"
              className={dynamicStyle(activeAlgorithm === 'Konservatif')}
              onClick={() => handleAlgorithmClick('Konservatif')}
              data-twe-ripple-init
              data-twe-ripple-color="light"
            >
              Konservatif
            </button>
            <button
              type="button"
              className={dynamicStyle(activeAlgorithm === 'Moderat')}
              onClick={() => handleAlgorithmClick('Moderat')}
              data-twe-ripple-init
              data-twe-ripple-color="light"
            >
              Moderat
            </button>
            <button
              type="button"
              className={dynamicStyle(activeAlgorithm === 'Agresif')}
              onClick={() => handleAlgorithmClick('Agresif')}
              data-twe-ripple-init
              data-twe-ripple-color="light"
            >
              Agresif
            </button>
          </div>
          <RiskProfileInfo profile={activeAlgorithm} />
          <div className='flex justify-center'>
            <button
              type="submit"
              className='border-black text-black mt-4 mx-4 mb-[15px] rounded border-2 px-7 pb-[8px] pt-[10px] text-sm font-bold uppercase leading-normal  transition duration-150 ease-in-out hover:border-neutral-100 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-black focus:border-neutral-100 focus:text-neutral-100 focus:outline-none focus:ring-0 active:border-neutral-200 active:text-neutral-200 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10'
              data-twe-ripple-init
              data-twe-ripple-color="light"
            >
              Submit!
            </button>
          </div>
        </div>
      </form>
      {loading && <p className='text-black'>Loading...</p>}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {submitted && result && (
        <div className="mt-4 p-4 border rounded bg-gray-100 text-black w-[600px]">
          <h5 className="flex text-lg font-semibold justify-center">Hasil Optimasi</h5>
          <p className='mt-3'>Rekomendasi Saham: {result.stock_recommendation}</p>
          <p>Return Maksimal Harian: {formatPercentage(result.max_return)}</p> {/* Display return in percentage */}
          <p>Risiko (Standar Deviasi): {formatPercentage(result.risk)}</p> {/* Display risk in percentage */}
        </div>
      )}
    </div>  
    </body>
    </html>
    
  );
}
