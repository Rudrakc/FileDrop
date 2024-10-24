import { db } from './firebaseConfig';
import { collection, addDoc, getDoc, setDoc, doc, onSnapshot } from "firebase/firestore";

const createOffer = async (peerConnection) => {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  const offerDoc = await addDoc(collection(db, "offers"), {
    type: "offer",
    offer: offer
  });

  return offerDoc.id;
};

const createAnswer = async (offerId, peerConnection) => {
  const offerDoc = await getDoc(doc(db, "offers", offerId));
  if (offerDoc.exists()) {
    const offer = offerDoc.data().offer;
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    
    await setDoc(doc(db, "answers", offerId), {
      type: "answer",
      answer: answer
    });
  }
};

const waitForAnswer = (offerId, peerConnection) => {
  const answerDocRef = doc(db, "answers", offerId);
  onSnapshot(answerDocRef, async (snapshot) => {
    const answerData = snapshot.data();
    if (answerData?.answer) {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answerData.answer));
    }
  });
};

const handleICECandidates = (peerConnection, offerId) => {
  const iceCandidatesCollection = collection(db, `offers/${offerId}/candidates`);

  peerConnection.onicecandidate = async (event) => {
    if (event.candidate) {
      await addDoc(iceCandidatesCollection, event.candidate.toJSON());
    }
  };

  onSnapshot(iceCandidatesCollection, async (snapshot) => {
    snapshot.docChanges().forEach(async (change) => {
      if (change.type === "added") {
        const candidate = new RTCIceCandidate(change.doc.data());
        await peerConnection.addIceCandidate(candidate);
      }
    });
  });
};

export { createOffer, createAnswer, waitForAnswer, handleICECandidates };
