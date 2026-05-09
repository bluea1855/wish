import React, { useState, useEffect } from 'react';
import MatrixBackground from '../components/MatrixBackground';
import { db, storage } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import toast, { Toaster } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

const Gift = () => {
  const location = useLocation();
  const [charset, setCharset] = useState('01'); // default charset

  const [formData, setFormData] = useState({
    personName: '',
    personAge: '',
    message: 'Wishing you a magical day full of surprises and joy 👀✨..',
    theme: 'matrix',
  });

  const themes = [
    { id: 'matrix', name: 'Matrix', icon: '💻', desc: 'Digital green rain & hacker terminal aesthetic.' },
    { id: 'cosmic', name: 'Cosmic', icon: '🌌', desc: 'Poetic star-birth and celestial exploration.' },
    { id: 'forest', name: 'Forest', icon: '🌿', desc: 'Whimsical fable and magical forest blooms.' },
    { id: 'traveler', name: 'Traveler', icon: '⏳', desc: 'Cyberpunk hybrid & temporal timeline archives.' },
  ];

  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [link, setLink] = useState('');

  // Extract charset from query param if exists
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const charsetParam = params.get('charset');
    if (charsetParam) {
      setCharset(charsetParam);
    }
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    const id = `${formData.personName}${formData.personAge}`.replace(/\s+/g, '').toLowerCase();

    try {
      const imageUrls = [];
      for (const image of images) {
        const storageRef = ref(storage, `gifts/${id}/${image.name}`);
        const snapshot = await uploadBytes(storageRef, image);
        const url = await getDownloadURL(snapshot.ref);
        imageUrls.push(url);
      }

      await setDoc(doc(db, "gifts", id), {
        ...formData,
        imageUrls,
        createdAt: new Date()
      });

      const generatedLink = `${window.location.origin}/${id}`;
      setLink(generatedLink);
      setSubmitted(true);

      toast.success("Link generated successfully!");
    } catch (error) {
      console.error("Error saving to Firestore:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] overflow-x-hidden selection:bg-green-500/30">
      <Toaster position="top-center" />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="flex items-center justify-center min-h-screen w-full px-4 py-20 relative">
        <div className="group bg-white/[0.03] border border-white/10 backdrop-blur-2xl text-white p-8 sm:p-12 rounded-[2.5rem] shadow-2xl max-w-lg w-full text-center transition-all duration-700 hover:border-white/20">

          {!submitted ? (
            <>
              <div className="mb-10 text-center">
                <h2 className="text-4xl font-black mb-3 tracking-tight bg-gradient-to-br from-white to-white/50 bg-clip-text text-transparent">
                  Create a Wish
                </h2>
                <p className="text-white/40 text-sm font-medium uppercase tracking-[0.2em]">Craft a magical moment</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div>
                  <label htmlFor="personName" className="block mb-1 text-sm font-medium">Person's Name</label>
                  <input
                    id="personName"
                    type="text"
                    name="personName"
                    value={formData.personName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded bg-white/20 text-white border border-white/30 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="personAge" className="block mb-1 text-sm font-medium">Person's Age</label>
                  <input
                    id="personAge"
                    type="number"
                    name="personAge"
                    value={formData.personAge}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded bg-white/20 text-white border border-white/30 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block mb-1 text-sm font-medium">Message (optional)</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 rounded bg-white/20 text-white border border-white/30 focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block mb-3 text-sm font-medium">Choose a Theme</label>
                  <div className="grid grid-cols-2 gap-3">
                    {themes.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, theme: t.id })}
                        className={`p-3 rounded-xl border transition-all text-left group/theme ${
                          formData.theme === t.id
                            ? 'bg-green-500/30 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div className="text-2xl mb-1">{t.icon}</div>
                        <div className="font-bold text-sm">{t.name}</div>
                        <div className="text-[10px] text-white/50 leading-tight mt-1 opacity-0 group-hover/theme:opacity-100 transition-opacity">
                          {t.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="images" className="block mb-1 text-sm font-medium">Upload Photos (Optional)</label>
                  <input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 rounded bg-white/20 text-white border border-white/30 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-white hover:file:bg-green-600 cursor-pointer"
                  />
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full relative group/btn py-4 px-6 bg-green-500 hover:bg-green-400 disabled:bg-white/10 disabled:text-white/20 rounded-2xl text-black font-bold text-lg transition-all duration-300 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] active:scale-95 overflow-hidden"
                >
                  <span className="relative z-10">{uploading ? 'Generating Memory...' : 'Finalize Wish'}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-4">Wish Link Created!</h2>
              <p className="mb-4">Share this link:</p>
              <div className="bg-white/20 p-3 rounded text-sm break-words">
                <a href={link} target="_blank" rel="noopener noreferrer" className="underline">
                  {link}
                </a>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(link);
                  toast.success("Link copied to clipboard!");
                }}
                className="mt-4 py-2 px-4 cursor-pointer bg-green-500 hover:bg-green-600 rounded text-white font-semibold transition"
              >
                Copy Link
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default Gift;
