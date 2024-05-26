import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import BarberSelection from '../../screens/barberSelection';
import UserServiceSelection from '../../screens/userServiseSelection';
import UserWaitingRoom from '../../screens/userWaitingRoom';
import UserTabBar from '../../components/layout/userTabBar';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import UserBarberReview from '../../screens/userBarberReview';
import UserBarberGallery from '../../screens/userBarberGallery';
import UserGreetings from '../../screens/UserGreetings';
import {RootState, useAppSelector} from '../../store';
import Profile from '../../screens/profile';
import UserCanceledTurn from '../../screens/UserCanceledTurn';
import moment from 'moment';
import { useSocket } from '../../context/socketContext';

export type RootStackParamList = {
  BarberSelection: undefined;
  UserServiceSelection: {id: number};
  UserWaitingRoom: {turnId: number};
  UserBarberReview: {id: number};
};

export type TabsStackParamList = {
  Schedule: undefined;
  UserProfile: undefined;
};

const Tab = createBottomTabNavigator<TabsStackParamList>();

export default function UserNavigator(): JSX.Element {
  return (
    <Tab.Navigator
      tabBar={props => <UserTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Schedule">
      <>
        <Tab.Screen name="Schedule" component={Schedule} />
        <Tab.Screen name="UserProfile" component={Profile} />
      </>
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();

const Schedule = () => {
  const {userTurn} = useAppSelector((state: RootState) => state.turns);
  useSocket()
  const [activeTurnScreen, setActiveTurnScreen] = useState<string>('UserWaitingRoom')

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        userTurn &&
        moment()
          .utc()
          .utcOffset(3, true)
          .isAfter(moment(userTurn?.endDate), 'minutes')
      ) {
        console.log("UserWaitingRoom")
        setActiveTurnScreen('UserWaitingRoom');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [userTurn]);
  console.log("userTurn", userTurn)

  return (
    <Stack.Navigator
      initialRouteName={!userTurn ? 'BarberSelection' : activeTurnScreen}
      screenOptions={{headerShown: false}}>
      {!userTurn && (
        <>
          <Stack.Screen name="BarberSelection" component={BarberSelection} />
          <Stack.Screen
            name="UserBarberGallery"
            component={UserBarberGallery}
          />
        </>
      )}

      <Stack.Screen
        name="UserServiceSelection"
        component={UserServiceSelection}
      />
      <Stack.Screen name="UserBarberReview" component={UserBarberReview} />

      <Stack.Screen name="UserWaitingRoom" component={UserWaitingRoom} />

      <Stack.Screen name="UserGreetings" component={UserGreetings} />
      <Stack.Screen name="CanceledTurn" component={UserCanceledTurn} />
    </Stack.Navigator>
  );
};
