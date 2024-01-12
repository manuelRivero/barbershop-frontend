import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import TabBar from '../../components/layout/tabBar';
import Schedule from '../../screens/schedule';
import Services from '../../screens/services';
import Profile from '../../screens/profile';
import Stats from '../../screens/stats';
import Gallery from '../../screens/gallery';
import {RootState, useAppSelector} from '../../store';
import StatsBarberSelection from '../../screens/statsBarberSelection';
import AdminBarberStats from '../../screens/AdminBarberStats';
import AllStatsFromDates from '../../screens/AllStatsFromDates';

type RootStackParamList = {
  Schedule: undefined;
  Services: undefined;
  Profile: undefined;
  Stats: undefined;
  BarberStats: undefined;
  AllStatsFromDates: undefined;
};

const Tab = createBottomTabNavigator<RootStackParamList>();
const Stack = createNativeStackNavigator();

function BottomTabs(): JSX.Element {
  const {user} = useAppSelector((state: RootState) => state.auth);
  console.log('user role', user?.role);
  if (user?.role === 'barber') {
    return (
      <Tab.Navigator
        tabBar={props => <TabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}>
        <Tab.Screen
          name="Schedule"
          component={Schedule}
          options={{title: 'Agenda'}}
        />

        <Tab.Screen
          name="Services"
          component={Services}
          options={{title: 'Servicios'}}
        />
        <Tab.Screen
          name="Stats"
          component={Stats}
          options={{title: 'Estadisticas'}}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreens}
          options={{title: 'Perfil'}}
        />
      </Tab.Navigator>
    );
  }

  if (user?.role === 'admin-barber') {
    return (
      <Tab.Navigator
        tabBar={props => <TabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}>
        <Tab.Screen
          name="Schedule"
          component={Schedule}
          options={{title: 'Agenda'}}
        />

        <Tab.Screen
          name="Services"
          component={Services}
          options={{title: 'Servicios'}}
        />
        <Tab.Screen
          name="Stats"
          component={Stats}
          options={{title: 'Estadisticas'}}
        />
        <>
          <Tab.Screen
            name="BarberStats"
            component={BarberStatsScreens}
            options={{title: 'Estadisticas'}}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreens}
            options={{title: 'Perfil'}}
          />
        </>
      </Tab.Navigator>
    );
  }

  if (user?.role === 'admin') {
    return (
      <Tab.Navigator
        tabBar={props => <TabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}>
          <Tab.Screen
            name="BarberStats"
            component={BarberStatsScreens}
            options={{title: 'Estadisticas'}}
          />
          <Tab.Screen
            name="AllStatsFromDates"
            component={AllStatsFromDates}
            options={{title: 'Estadisticas'}}
          />
        <Tab.Screen
          name="Profile"
          component={ProfileScreens}
          options={{title: 'Perfil'}}
        />
      </Tab.Navigator>
    );
  }
  return <></>;
}

export default BottomTabs;

const ProfileScreens = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="BarberProfile">
      <Stack.Screen
        name="BarberProfile"
        component={Profile}
        options={{title: 'Perfil'}}
      />
      <Stack.Screen
        name="BarberGallery"
        component={Gallery}
        options={{title: 'Perfil'}}
      />
    </Stack.Navigator>
  );
};

const BarberStatsScreens = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="BarberStatsSelection">
      <Stack.Screen
        name="BarberStatsSelection"
        component={StatsBarberSelection}
        options={{title: 'Seleccion de barbero'}}
      />
      <Stack.Screen
        name="BarberStatsReview"
        component={AdminBarberStats}
        options={{title: 'estadisticas del barbero'}}
      />
    </Stack.Navigator>
  );
};
