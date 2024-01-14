import {Box, HStack, Pressable, VStack} from '@gluestack-ui/themed';
import React from 'react';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs/src/types';
import {Icon} from '@gluestack-ui/themed';
import {Briefcase, CalendarPlus, User, LineChart, UsersIcon, LucideIcon, CalendarClock} from 'lucide-react-native';

interface Icons {
  Schedule: LucideIcon;
  Services: LucideIcon;
  Profile:LucideIcon;
  Stats:LucideIcon
  BarberStats: LucideIcon;
  BarberStatsSelection: LucideIcon;
  AllStatsFromDates: LucideIcon
}
const icons: Icons = {
  Schedule: CalendarPlus,
  Services: Briefcase,
  Profile: User,
  Stats: LineChart,
  BarberStats: UsersIcon,
  BarberStatsSelection: UsersIcon,
  AllStatsFromDates: CalendarClock
};

const getIcon = (name: string) => {
  return icons[name as keyof Icons];
};

export default function TabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps): JSX.Element {
  // console.log('props state', state);
  return (
    <Box p={'$4'} backgroundColor="$primary100">
      <Box h={60} borderRadius={'$xl'} bg={'$white'} overflow={'hidden'}>
        <HStack
          justifyContent="center"
          alignItems="center"
          flex={1}>
          {state.routes.map((route, index) => {
            const {options} = descriptors[route.key];
            const isFocused = state.index === index;
            console.log("route", state.routes[index])


            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                // The `merge: true` option makes sure that the params inside the tab screen are preserved
                navigation.navigate({
                  name: route.name,
                  merge: true,
                  params: undefined,
                });
              }
            };

            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={isFocused ? {selected: true} : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                style={{flex: 1}}>
                <VStack
                  justifyContent="center"
                  alignItems="center">
                  <Icon
                    as={getIcon(route.name)}
                    size={24}
                    color={isFocused ? '$primary500' : '$textDark900'}
                  />
                </VStack>
              </Pressable>
            );
          })}
        </HStack>
      </Box>
    </Box>
  );
}
