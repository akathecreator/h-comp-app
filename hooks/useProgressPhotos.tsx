import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { useGlobalContext } from "@/lib/global-provider";

const useProgressPhotos = () => {
  const { user } = useGlobalContext();
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    if (!user) return;

    const photosRef = collection(db, "users", user.uid, "progress_photos");
    const q = query(photosRef, orderBy("uploadedAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPhotos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPhotos(fetchedPhotos);
    });

    return () => unsubscribe();
  }, [user]);

  return { photos, setPhotos };
};

export default useProgressPhotos;