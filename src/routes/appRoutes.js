import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import Home from '../pages/Home';
import Profile from '../pages/Profile';
import NewPost from '../pages/NewPost';
import PostsUser from '../pages/NewPost';

import Feather from 'react-native-vector-icons/Feather'

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function StackScreen(){
  return(
    <Stack.Navigator>
      <Stack.Screen 
              name='Home' 
              component={Home} 
              options={{headerShown: false}}/>
      <Stack.Screen 
              name='NewPost' 
              component={NewPost}
              options={{
                headerTintColor: '#fff',
                headerStyle:{
                  backgroundColor: '#9372F1'
                }
                }}
              />
      <Stack.Screen name='PostsUser' component={PostsUser} options={{headerShown: false}}/>
    </Stack.Navigator>
  )
}


function AppRoutes() {
 return (
   <Tab.Navigator
   screenOptions={{
        keyboardHidesTabBar: true,
        showLabel: false,
        style:{
          backgroundColor: '#fff',
          borderTopWidth: 0
        },
        activeTintColor: '#9372F1'
      }}
   >
       <Tab.Screen 
          name="Home" 
          component={StackScreen} 
          
          options={{
            headerShown: false,
            tabBarIcon: ({color, size}) => {
                return <Feather name='home' color={color} size={size}/>
            }
          }}
       />
       <Tab.Screen 
          name="Profile" 
          component={Profile}   
          options={{
            headerShown: false,
            tabBarIcon: ({color, size}) => {
                return <Feather name='user' color={color} size={size}/>
            }
          }}
       />
   </Tab.Navigator>
  );
}

export default AppRoutes;