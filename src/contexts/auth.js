import React, { useState, createContext, useEffect } from 'react';

import firestore from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../firebase-config';

export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAuth, setLoadingAuth] = useState(false);

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);


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

  async function signUp(email, password, name){
    setLoadingAuth(true);

    await createUserWithEmailAndPassword(auth, email, password)
    .then( async (value) => {
      let uid = value.user.uid;
      await firestore().collection('users')
      .doc(uid).set({
        nome: name
      }) 
      .then( () => {
        let data = {
          uid: uid,
          nome: name,
          email: value.user.email
        };

        setUser(data);
        storageUser(data);
        setLoadingAuth(false);

      }) 


    })
    .catch((error) => {
      console.log(error);
      setLoadingAuth(false);
    })
  }

  async function signOut(){
    await getAuth().signOut();
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