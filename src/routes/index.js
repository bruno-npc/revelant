import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Dashboard from '../pages/Dashboard';
import AppRoutes from './appRoutes';
import AuthRoutes from './authRoutes';

const Stack = createStackNavigator();

function Routes() {
  return(
    <Stack.Navigator initialRouteName='Dashboard' screenOptions={{ headerShown: false }}>
      <Stack.Screen name='AppRoutes' component={AppRoutes}/>
      <Stack.Screen name='AuthRoutes' component={AuthRoutes}/>
      <Stack.Screen name='Dashboard' component={Dashboard}/>
    </Stack.Navigator>
  )
}

export default Routes;