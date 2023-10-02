import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabs from '../bottomTabs';
const Stack = createNativeStackNavigator();

export default function MainNavigator(): JSX.Element {
  return (
    <Stack.Navigator initialRouteName="BottomsTabs" screenOptions={{headerShown:false}}>
      <>
        <Stack.Screen name="BottomsTabs" component={BottomTabs} />
      </>
    </Stack.Navigator>
  );
}
