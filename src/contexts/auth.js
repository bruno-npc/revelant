import React, { useState, createContext, useEffect } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

import { doc, setDoc } from "firebase/firestore";

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

  async function signIn(email, password){
    setLoadingAuth(true);

    await signInWithEmailAndPassword(auth, email, password).then( async (value) => {
      let uid = value.user.uid;
      //const userProfile = await firestore().collection('users').doc(uid).get();
      //console.log(userProfile.data().nome);
      let data = {
        uid: uid,
        //nome: userProfile.data().nome,
        email: value.user.email
      };

      setUser(data);
      storageUser(data);
      setLoadingAuth(false);

    })
    .catch((error) => {
      console.log(error);
      setLoadingAuth(false);
    })
  }

  async function signUp(email, password, name) {
    setLoadingAuth(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password)
      .then((userCredential) => {
          const user = userCredential.user;
          console.log(user.uid)
          setLoading(false);
          setDoc(doc(db, "users", user.uid), {
            nome: name,
            email: email,
            uid: user.uid
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