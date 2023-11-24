import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BarberSelection from '../../screens/barberSelection';
import UserSchedule from '../../screens/userSchedule';
import UserServiceSelection from '../../screens/userServiseSelection';
import UserWaitingRoom from '../../screens/userWaitingRoom';

export type RootStackParamList = {
  BarberSelection: undefined;
  UserSchedule: {id: number};
  UserServiceSelection: {id: number};
  UserWaitingRoom: {turnId:number};
};
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function UserNavigator(): JSX.Element {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <>
        <Stack.Screen name="BarberSelection" component={BarberSelection} />
        <Stack.Screen
          name="UserServiceSelection"
          component={UserServiceSelection}
        />

        <Stack.Screen name="UserSchedule" component={UserSchedule} />
        <Stack.Screen name="UserWaitingRoom" component={UserWaitingRoom} />
      </>
    </Stack.Navigator>
  );
}
