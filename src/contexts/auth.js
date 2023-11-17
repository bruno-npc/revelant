import React, { useState, createContext, useEffect } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

import { doc, setDoc, getDocs, collection, query, where, } from "firebase/firestore";

import { auth, db } from '../../firebase-config';

export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [newUser, setNewUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAuth, setLoadingAuth] = useState(false);

  useEffect(()=> {
    async function loadStorage(){
      const storageUser = await AsyncStorage.getItem('devApp');
      if(storageUser){
        setUser(JSON.parse(storageUser));
        setLoading(false);
      }
      setLoading(false);
    }
    loadStorage();
  }, []);

  async function signIn(email, password) {
    setLoadingAuth(true);
  
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
  
      const userProfileCollection = collection(db, 'users');
      const q = query(userProfileCollection, where('uid', '==', user.uid));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
       const userData = querySnapshot.docs[0].data();

        let data = {
          uid: user.uid,
          email: user.email,
          nome: userData.nome,
        };
        setUser(data);
        storageUser(data);
      } else {
        console.log('Documento do usuário não encontrado.');
      }
  
      setLoadingAuth(false);
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      setLoadingAuth(false);
    }
  }

  async function signUp(email, password, name, estado, igreja, religiao, documentoRecomendacaoPastoral) {
    setLoadingAuth(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password)
      .then((userCredential) => {
          const user = userCredential.user;
          setLoading(false);
          setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: email,
            nome: name,
            estado: estado,
            igreja: igreja,
            religiao: religiao,
            follow: 0,
            recomendacaopastoral: documentoRecomendacaoPastoral,
            historia: '',
            biodescricao: '',
            imgbioprofile:['https://static.vecteezy.com/ti/fotos-gratis/t2/22906122-ai-gerado-cristao-igreja-com-uma-religioso-cruz-e-aura-luz-dentro-a-todo-sala-foto.jpg'],
            imgprofile: '',
            backgroundprofile: ''
          });
          setUser(user);
        })
        .then(() => alert("Conta cadastrada com sucesso!"))
        .catch((error) => {
          console.log(error);
        })
      storageUser(user);
      setLoadingAuth(false);
    } catch (error) {
      console.error(error);
      setLoadingAuth(false);
    }
  }

  async function signOut(){
    await auth.signOut();
    await AsyncStorage.clear().then(() => {setUser(null)});
  }

  async function storageUser(data){
   await AsyncStorage.setItem('revelant-dev', JSON.stringify(data));
  }
 return (
   <AuthContext.Provider value={{ signed: !!user, user, signUp, signIn, signOut, loadingAuth, loading }}>
       {children}
   </AuthContext.Provider>
  );
}

export default AuthProvider;