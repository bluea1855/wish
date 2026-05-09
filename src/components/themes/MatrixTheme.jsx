import React, { useState, useEffect, useCallback } from "react";
import MatrixBackground from "../MatrixBackground";
import GreetingCard from "../Greetingcard";
import Effect from "../Effect";
import PhotoCollage from "../PhotoCollage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../pages/firebase";

const MatrixTheme = ({ name, age, charset, imageUrls }) => {
  const [isLocked, setIsLocked] = useState(false);
  const [lockedData, setLockedData] = useState(null);

  const fetchLockState = useCallback(async () => {
    if (!charset) return;
    try {
      const docRef = doc(db, "gifts", charset.toLowerCase());
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.lockedContent && data.lockedContent.matrix) {
          setLockedData(data.lockedContent.matrix);
          setIsLocked(true);
        }
      }
    } catch (e) {
      console.error("Error fetching lock state:", e);
    }
  }, [charset]);

  useEffect(() => {
    fetchLockState();
  }, [fetchLockState]);

  const handleLock = async (data) => {
    if (!charset) return;
    try {
      const docRef = doc(db, "gifts", charset.toLowerCase());
      await updateDoc(docRef, {
        "lockedContent.matrix": data
      });
      setIsLocked(true);
      setLockedData(data);
    } catch (e) {
      console.error("Error locking content:", e);
    }
  };

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      <Effect />
      <MatrixBackground charset={charset || "01"} />
      <div className="relative z-10">
        <GreetingCard
          name={name}
          age={age}
          isLocked={isLocked}
          lockedData={lockedData}
          onLock={handleLock}
          charset={charset}
        />
        <div className="pb-20">
          <PhotoCollage imageUrls={imageUrls} />
        </div>
      </div>
    </div>
  );
};

export default MatrixTheme;
