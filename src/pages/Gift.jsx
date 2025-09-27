import React, { useState, useEffect } from 'react';
import MatrixBackground from '../components/MatrixBackground';
import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import toast, { Toaster } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

const Gift = () => {
  const location = useLocation();
  const [charset, setCharset] = useState('01'); // default charset

  const [formData, setFormData] = useState({
    personName: '',
    personAge: '',
    message: 'Wishing you a magical day full of surprises and joy 👀✨..',
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const id = `${formData.personName}${formData.personAge}`.replace(/\s+/g, '').toLowerCase();

    try {
      await setDoc(doc(db, "gifts", id), {
        ...formData,
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
                  <label className="block mb-1 text-sm font-medium">Person's Name</label>
                  <input
                    type="text"
                    name="personName"
                    value={formData.personName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded bg-white/20 text-white border border-white/30 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">Person's Age</label>
                  <input
                    type="number"
                    name="personAge"
                    value={formData.personAge}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded bg-white/20 text-white border border-white/30 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">Message (optional)</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 rounded bg-white/20 text-white border border-white/30 focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full cursor-pointer py-2 px-4 bg-green-500 hover:bg-green-500 rounded text-white font-semibold transition"
                >
                  Submit
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