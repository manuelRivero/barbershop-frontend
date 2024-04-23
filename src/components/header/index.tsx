import {
  Box,
  Text,
  VStack,
  Heading,
  Icon,
  HStack,
  Pressable,
} from '@gluestack-ui/themed';
import CustomHeading from '../../components/shared/heading';
import Clock from 'react-live-clock';
import {ChevronLeftIcon} from 'lucide-react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  title: string;
  subtitle?: string;
  viewGoBack: boolean;
  viewClock: boolean;
  width: number;
}

export default function Header({
  title,
  subtitle,
  viewGoBack,
  viewClock,
  width,
}: Props) {
  const navigation = useNavigation();
  const translateY = useSharedValue(-100);
  const titleOpacity = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
  }));
  const animatedTitleStyles = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = () => {
        translateY.value = withTiming(0, {
          duration: 1000,
          easing: Easing.bounce,
        });
        titleOpacity.value = withDelay(
          1000,
          withTiming(1, {
            duration: 1000,
            easing: Easing.bounce,
            // @ts-ignore
          } as Animated.WithTimingConfig),
        );
      };
      unsubscribe();

      return () => {
        translateY.value = -100;
        titleOpacity.value = 0;
      };
    }, []),
  );

  return (
    <Animated.View style={[animatedStyles]}>
      <Box
        borderRadius={9999}
        w={width * 3}
        h={width * 3}
        position="absolute"
        bg="#f1e2ca"
        overflow="hidden"
        top={-width * 2.75}
        left={-width}
        opacity={0.5}
      />
      <VStack
        mt={'$1'}
        width={'100%'}
        alignItems="center"
        justifyContent="center">
        {viewClock && (
          <Clock
            format={'hh:mm:ss'}
            ticking={true}
            element={Text}
            style={{fontSize: 16, color: '#1f3d56'}}
          />
        )}
        <HStack
          justifyContent="space-between"
          alignItems="center"
          width={'$full'}>
          <Box p={viewGoBack ? '$0' : '$5'}>
            {viewGoBack && (
              <Pressable onPress={() => navigation.goBack()} p={'$2'}>
                <Icon as={ChevronLeftIcon} size={24} color="$textDark500" />
              </Pressable>
            )}
          </Box>
          <VStack alignItems="center">
            <CustomHeading textAlign="center">{title}</CustomHeading>
            {subtitle && (
              <CustomHeading textAlign="center">{subtitle}</CustomHeading>
            )}
          </VStack>
          <Box width={'$6'} p="$6"></Box>
        </HStack>
      </VStack>
    </Animated.View>
  );
}
