import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BarberSelection from '../../screens/barberSelection';
import UserSchedule from '../../screens/userSchedule';

export type RootStackParamList = {
    BarberSelection: undefined;
    UserSchedule: {id:number};
};
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function UserNavigator(): JSX.Element {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}>
      <>
        <Stack.Screen name="BarberSelection" component={BarberSelection} />
        <Stack.Screen name="UserSchedule" component={UserSchedule} />
      </>
    </Stack.Navigator>
  );
}
