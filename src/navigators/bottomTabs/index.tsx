import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TabBar from '../../components/layout/tabBar';
import Schedule from '../../screens/schedule';
import Services from '../../screens/services';
import Profile from '../../screens/profile';
import Stats from '../../screens/stats';

type RootStackParamList = {
  Schedule: undefined;
  Services: undefined;
  Profile: undefined;
  Stats: undefined;
};

const Tab = createBottomTabNavigator<RootStackParamList>();

function BottomTabs(): JSX.Element {
  return (
    <Tab.Navigator tabBar={props => <TabBar {...props} />} 
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
        component={Profile}
        options={{title: 'Perfil'}}
      />
    </Tab.Navigator>
  );
}

export default BottomTabs;
