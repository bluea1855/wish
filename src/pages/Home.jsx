import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../pages/firebase"; // your firebase config
import MatrixBackground from "../components/MatrixBackground";
import GreetingCard from "../components/Greetingcard";
import Effect from "../components/Effect";

const Home = () => {
  const location = useLocation();
  const [charset, setCharset] = useState("01");
  const [personName, setPersonName] = useState("");
  const [personAge, setPersonAge] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userDefinedCharset = params.get("charset") || "01";

    // Update charset with delay (your original logic)
    const timeoutId = setTimeout(() => {
      setCharset(userDefinedCharset);
    }, 8400);

    return () => clearTimeout(timeoutId);
  }, [location.search]);

  useEffect(() => {
    if (!charset) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "gifts", charset);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPersonName(data.personName || "");
          setPersonAge(data.personAge || "");
        } else {
          console.log("No such document!");
          setPersonName("");
          setPersonAge("");
        }
      } catch (error) {
        console.error("Error fetching Firestore data:", error);
        setPersonName("");
        setPersonAge("");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [charset]);

  return (
    <div className="h-screen overflow-hidden">
      <Effect />
      <MatrixBackground charset={charset} />
      {!loading && <GreetingCard name={personName} age={personAge} />}
    </div>
  );
};

export default Home;