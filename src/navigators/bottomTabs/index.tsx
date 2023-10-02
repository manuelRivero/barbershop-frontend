import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TabBar from '../../components/layout/tabBar';
import Schedule from '../../screens/schedule';
import Services from '../../screens/services';

type RootStackParamList = {
  Schedule: undefined;
  Services: undefined;
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
    </Tab.Navigator>
  );
}

export default BottomTabs;
