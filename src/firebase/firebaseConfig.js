import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Configuração do Firebase fornecida pelo Alisson
const firebaseConfig = {
  apiKey: "AIzaSyAgTlAxQ5TO6GsVgQyG-HBfM7Y7zITXzvg",
  authDomain: "alisson-estetica-automotiva.firebaseapp.com",
  projectId: "alisson-estetica-automotiva",
  storageBucket: "alisson-estetica-automotiva.firebasestorage.app",
  messagingSenderId: "652300776814",
  appId: "1:652300776814:web:718b0123b0b194177cfd7f",
  measurementId: "G-31R0RT0Z27"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa os serviços
export const db = getFirestore(app);
export const auth = getAuth(app);

// Analytics só deve carregar se estivermos no navegador
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { analytics };
export default app;
