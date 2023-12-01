import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';

const Stack = createStackNavigator();

function AuthRoutes() {
 return (
   <Stack.Navigator>
       <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
       <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
   </Stack.Navigator>
  );
}


export default AuthRoutes;