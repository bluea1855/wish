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
    <div className="h-screen overflow-hidden">
      <Toaster position="top-center" />
      <MatrixBackground charset={charset} />
      <div className="flex items-center justify-center min-h-screen w-full px-4 relative">
        <div className="group bg-white/10 border border-white/30 backdrop-blur-md text-white p-8 sm:p-10 rounded-3xl shadow-xl max-w-md w-full text-center transform transition duration-500 hover:rotate-[1deg] hover:scale-[1.01] hover:shadow-2xl">

          {!submitted ? (
            <>
              <h2 className="text-2xl font-bold mb-6">Wish Form</h2>
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
                  <label htmlFor="theme" className="block mb-1 text-sm font-medium">Select Theme</label>
                  <select
                    id="theme"
                    name="theme"
                    value={formData.theme}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded bg-white/20 text-white border border-white/30 focus:outline-none [&>option]:text-black"
                  >
                    <option value="matrix">Matrix (Hacker)</option>
                    <option value="cosmic">Cosmic Voyage</option>
                    <option value="forest">Enchanted Forest</option>
                    <option value="traveler">Time Traveler</option>
                  </select>
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
                  className="w-full cursor-pointer py-2 px-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 rounded text-white font-semibold transition"
                >
                  {uploading ? 'Generating...' : 'Submit'}
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
