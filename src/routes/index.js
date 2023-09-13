import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';

import { AuthContext } from '../contexts/auth';

import AuthRoutes from './authRoutes';
import AppRoutes from './appRoutes';

function Routes() {
    const { signed } = useContext(AuthContext);
    const loading = false;

    if(loading){
        <View 
        style={{
            flex:1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#36393F'
        }}
        >
            <ActivityIndicator size={50} color="#e52246" />
        </View>
    }

 return (
   signed ? <AppRoutes/> : <AuthRoutes/>
  );
}

export default Routes;