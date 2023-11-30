import {Box, HStack, Pressable, VStack} from '@gluestack-ui/themed';
import React from 'react';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs/src/types';
import {Icon} from '@gluestack-ui/themed';
import {Briefcase, CalendarPlus, User, LineChart} from 'lucide-react-native';

interface Icons {
  Schedule: any;
}
const icons: Icons = {
  Schedule: CalendarPlus,
};

const getIcon = (name: string) => {
  return icons[name as keyof Icons];
};

export default function UserTabBar({
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
            console.log('route options', state.routes);
            const label = options.title;

            const isFocused = state.index === index;

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
