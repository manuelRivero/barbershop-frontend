import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabs from '../bottomTabs';
import Login from '../../screens/login';
import {RootState, useAppSelector} from '../../store';
import Loading from '../../screens/loading';
import UserNavigator from '../userNavigator';
import pushNotifications, {
  ReceivedNotification,
} from 'react-native-push-notification';

const Stack = createNativeStackNavigator();

export default function MainNavigator(): JSX.Element {
  const {user} = useAppSelector((state: RootState) => state.auth);
  useEffect(() => {
    pushNotifications.configure({
      onRegister: function (token) {
        console.log('token', token);
      },
      onNotification: function (
        notification: Omit<ReceivedNotification, 'userInfo'>,
      ) {
        console.log('notification', notification);
      },
      onAction: function (notification: ReceivedNotification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);

        // process the action
      },
      requestPermissions: true,
    });
    pushNotifications.createChannel(
      {
        channelId: 'barbershop-channel',
        channelName: 'barbershop',
      },
      created => console.log('created', created),
    );
  }, []);

  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{headerShown: false}}>
      <>
        {user ? (
          user.role === 'barber' ? (
            <>
              <Stack.Screen name="Loading" component={Loading} />
              <Stack.Screen name="BottomsTabs" component={BottomTabs} />
            </>
          ) : (
            <Stack.Screen name="UserRoutes" component={UserNavigator} />
          )
        ) : (
          <Stack.Screen name="Login" component={Login} />
        )}
      </>
    </Stack.Navigator>
  );
}
