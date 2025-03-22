import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  Timestamp,
  doc,
} from "firebase/firestore";
import dayjs from "dayjs";

const db = getFirestore();

export default function useHydration(userId: string) {
  const [cups, setCups] = useState<number | null>(null);
  const [target, setTarget] = useState(8);
  const [hydrationDocId, setHydrationDocId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const today = dayjs();
  const todayStr = today.format("YYYY-MM-DD");

  useEffect(() => {
    const fetchHydration = async () => {
      const logsRef = collection(db, "logs");
      const q = query(
        logsRef,
        where("user_id", "==", userId),
        where("type", "==", "hydration"),
        where("date", "==", todayStr)
      );

      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const docSnap = snapshot.docs[0];
        const data = docSnap.data();
        setCups(data.cups || 0);
        setTarget(data.target || 8);
        setHydrationDocId(docSnap.id);
      } else {
        setCups(0);
      }

      setLoading(false);
    };

    fetchHydration();
  }, [userId]);

  const logCup = async () => {
    if (cups === null) return;

    const newCups = cups + 1;
    setCups(newCups);

    if (hydrationDocId) {
      const docRef = doc(db, "logs", hydrationDocId);
      await updateDoc(docRef, { cups: newCups });
    } else {
      const newDoc = await addDoc(collection(db, "logs"), {
        type: "hydration",
        user_id: userId,
        cups: 1,
        target,
        date: todayStr,
        year: today.year(),
        month: today.month() + 1,
        day: today.date(),
        timestamp: Timestamp.now(),
      });
      setHydrationDocId(newDoc.id);
    }
  };

  return { cups, target, loading, logCup };
}
