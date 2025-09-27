import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import toast from 'react-hot-toast';

const DynamicRedirect = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const checkDocument = async () => {
      if (!id) return;

      const match = id.match(/^([a-zA-Z]+)(\d+)$/);

      if (!match) {
        toast.error("Invalid URL format!");
        navigate('/');
        return;
      }

      const namePart = match[1];
      const numberPart = match[2];
      const docId = `${namePart}${numberPart}`.toLowerCase();
      const docRef = doc(db, 'gifts', docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const charset = `${namePart}${numberPart}`;
        navigate(`/wish?charset=${encodeURIComponent(charset)}`);
      } else {
        toast.error("This wish does not exist!");
        navigate('/');
      }
    };

    checkDocument();
  }, [id, navigate]);

  return null;
};

export default DynamicRedirect;