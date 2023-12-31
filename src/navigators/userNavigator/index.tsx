import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import BarberSelection from '../../screens/barberSelection';
import UserServiceSelection from '../../screens/userServiseSelection';
import UserWaitingRoom from '../../screens/userWaitingRoom';
import UserTabBar from '../../components/layout/userTabBar';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import UserBarberReview from '../../screens/userBarberReview';
import UserBarberGallery from '../../screens/userBarberGallery';
import UserGreetings from '../../screens/UserGreetings';

export type RootStackParamList = {
  BarberSelection: undefined;
  UserServiceSelection: {id: number};
  UserWaitingRoom: {turnId: number};
  UserBarberReview: {id: number}
};

export type TabsStackParamList = {
  Schedule: undefined
}

const Tab = createBottomTabNavigator<TabsStackParamList>();

export default function UserNavigator(): JSX.Element {
  return (
    <Tab.Navigator
      tabBar={props => <UserTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <>
        <Tab.Screen name="Schedule" component={Schedule}/>
      </>
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();

const Schedule = () => {
  return (
    <Stack.Navigator
      initialRouteName="BarberSelection"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="BarberSelection" component={BarberSelection} />
      <Stack.Screen name="UserBarberReview" component={UserBarberReview} />
      <Stack.Screen name="UserBarberGallery" component={UserBarberGallery} />
      <Stack.Screen
        name="UserServiceSelection"
        component={UserServiceSelection}
      />

      <Stack.Screen name="UserWaitingRoom" component={UserWaitingRoom} />
      <Stack.Screen
        name="UserGreetings"
        component={UserGreetings}
      />
    </Stack.Navigator>
  );
};
