import React, { useEffect, useState, Suspense, lazy } from "react";
import { useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../pages/firebase"; // your firebase config

const MatrixTheme = lazy(() => import("../components/themes/MatrixTheme"));
const CosmicVoyage = lazy(() => import("../components/themes/CosmicVoyage"));
const EnchantedForest = lazy(() => import("../components/themes/EnchantedForest"));
const TimeTraveler = lazy(() => import("../components/themes/TimeTraveler"));

const Home = () => {
  const location = useLocation();
  const [charset, setCharset] = useState("");
  const [personData, setPersonData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userDefinedCharset = params.get("charset");
    if (userDefinedCharset) {
      setCharset(userDefinedCharset);
    }
  }, [location.search]);

  useEffect(() => {
    if (!charset) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "gifts", charset.toLowerCase());
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPersonData(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching Firestore data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [charset]);

  if (loading) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center text-green-500 font-mono">
        Loading experience...
      </div>
    );
  }

  if (!personData) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center text-red-500 font-mono">
        Wish not found.
      </div>
    );
  }

  const theme = personData.theme || "matrix";

  return (
    <Suspense fallback={<div className="h-screen w-full bg-black flex items-center justify-center text-white">Initializing Theme...</div>}>
      {theme === "matrix" && <MatrixTheme name={personData.personName} age={personData.personAge} charset={charset} imageUrls={personData.imageUrls} />}
      {theme === "cosmic" && <CosmicVoyage name={personData.personName} age={personData.personAge} message={personData.message} imageUrls={personData.imageUrls} />}
      {theme === "forest" && <EnchantedForest name={personData.personName} age={personData.personAge} message={personData.message} imageUrls={personData.imageUrls} />}
      {theme === "traveler" && <TimeTraveler name={personData.personName} age={personData.personAge} message={personData.message} imageUrls={personData.imageUrls} />}
    </Suspense>
  );
};

export default Home;
