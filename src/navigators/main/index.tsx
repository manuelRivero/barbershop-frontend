import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabs from '../bottomTabs';
import Login from '../../screens/login';
import {RootState, useAppDispatch, useAppSelector} from '../../store';
import Loading from '../../screens/loading';
import UserNavigator from '../userNavigator';
import UserLoading from '../../screens/userloading';
import {io} from 'socket.io-client';
import {removeSocket, setSocket} from '../../store/features/layoutSlice';

const Stack = createNativeStackNavigator();

export default function MainNavigator(): JSX.Element {
  const {user} = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const socket = io('https://barbershop-backend-ozy5.onrender.com');
    dispatch(setSocket(socket));
    return () => {
      socket.close();
      dispatch(removeSocket());
    };
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
            <>
              <Stack.Screen name="UserLoading" component={UserLoading} />
              <Stack.Screen name="UserRoutes" component={UserNavigator} />
            </>
          )
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
          </>
        )}
      </>
    </Stack.Navigator>
  );
}
