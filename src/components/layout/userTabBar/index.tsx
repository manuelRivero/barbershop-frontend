import { Box, HStack, Pressable, Text, VStack } from '@gluestack-ui/themed';
import React from 'react';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs/src/types';
import { Icon } from '@gluestack-ui/themed';
import { CalendarPlus, User, LucideIcon } from 'lucide-react-native';
import { userInfo } from 'os';
import { RootState, useAppSelector } from '../../../store';

interface Icons {
  Schedule: LucideIcon
  UserProfile: LucideIcon
}
const icons: Icons = {
  Schedule: CalendarPlus,
  UserProfile: User
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
  const { user } = useAppSelector((state: RootState) => state.auth);
  return (
    <Box p={'$4'} backgroundColor="$primary100">
      <Box h={60} borderRadius={'$xl'} bg={'$white'} overflow={'hidden'}>
        <HStack
          justifyContent="center"
          alignItems="center"
          flex={1}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label = options.title;
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              console.log("Phone", user?.phone);
              

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
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                style={{ flex: 1 }}>
                <VStack
                  justifyContent="center"
                  alignItems="center">
                  <Box position='relative'>
                    <Icon
                      as={getIcon(route.name)}
                      size={24}
                      color={isFocused ? '$primary500' : '$textDark900'}
                    />
                    {!user?.phone && route.name === "UserProfile" && <Box position='absolute' width={10} height={10} bg='red' left={20} bottom={20} borderRadius={9999} />}
                  </Box>
                </VStack>
              </Pressable>
            );
          })}
        </HStack>
      </Box>
    </Box>
  );
}
