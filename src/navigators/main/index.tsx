import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabs from '../bottomTabs';
import Login from '../../screens/login';
import {RootState, useAppSelector} from '../../store';
import Loading from '../../screens/loading';
const Stack = createNativeStackNavigator();

export default function MainNavigator(): JSX.Element {
  const {user} = useAppSelector((state: RootState) => state.auth);
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
            <>
              <Stack.Screen name="Loading" component={Loading} />
              <Stack.Screen name="BottomsTabs" component={BottomTabs} />
            </>
          )
        ) : (
          <Stack.Screen name="Login" component={Login} />
        )}
      </>
    </Stack.Navigator>
  );
}
