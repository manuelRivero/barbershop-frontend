import { HStack, Box, Text, Heading, Center, Button } from '@gluestack-ui/themed';
import Clock from 'react-live-clock';

import React, { useEffect, useState } from 'react';
import { useGetTurnDetailsQuery } from '../../api/turnsApi';
import Loader from '../../components/shared/loader';
import moment from 'moment';
import LottieView from 'lottie-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { BackHandler, Dimensions } from 'react-native';
import { RootState, useAppDispatch, useAppSelector } from '../../store';
import PushNotification from 'react-native-push-notification';
import BaseButton from '../../components/shared/baseButton';
import LinearGradient from 'react-native-linear-gradient';
import { resetUserTurn } from '../../store/features/turnsSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function UserGreetings({ route }: any) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dispatch = useAppDispatch();
  const { userTurn } = useAppSelector((state: RootState) => state.turns);

  const turnId = route.params?.turnId || userTurn?._id
  const { data, isLoading } = useGetTurnDetailsQuery({ id: turnId });

  const [restartTime, setRestartTime] = useState<moment.Moment>(
    moment().set({ hour: 23, minutes: 0 }).utc().utcOffset(3, true),
  );


  useEffect(() => {
    if (data) {
      PushNotification.localNotification({
        /* Android Only Properties */
        channelId: 'channel-id', // (required) channelId, if the channel doesn't exist, notification will not trigger.
        bigText: `¡Genial! Tu corte ya fue realizado`, // (optional) default: "message" prop
        vibrate: true, // (optional) default: true
        vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
        groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
        ongoing: false, // (optional) set whether this is an "ongoing" notification
        priority: 'high', // (optional) set notification priority, default: high
        visibility: 'private', // (optional) set notification visibility, default: private
        ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
        title: '¡Nueva notificación!', // (optional)
        // @ts-ignore
        data: {
          barberId: data.turn[0].barberData[0]._id,
          path: "UserBarberReview"
        },

        /* iOS only properties */

        message: `Gracias por elegir nuestro servicio. ¿Deseas calificar a ${data.turn[0].barberData[0].name} ${data.turn[0].barberData[0].lastname}?`, // (required)
      });
    }
  }, [data]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', function () {
      return true;
    });
    const interval = setInterval(() => {
      if (moment().utc().utcOffset(3, true).isAfter(restartTime)) {
        const day = moment().utc().utcOffset(3, true).get('date')
        console.log("day", day)
        setRestartTime(
          moment()
            .set({ date: day + 1, hour: 23, minute: 0, second: 0 })
            .utc()
            .utcOffset(3, true),
        );
        dispatch(resetUserTurn())
        AsyncStorage.removeItem("persist:turns")
        console.log("render")
        navigation.navigate('BarberSelection');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [restartTime]);

  console.log("restar time", restartTime)
  console.log("restar time", restartTime)

  if (isLoading) {
    return <Loader />;
  }
  return (
    <LinearGradient
      style={{ flex: 1 }}
      colors={['#fff', '#f1e2ca']}
      start={{ x: 0, y: 0.6 }}
      end={{ x: 0, y: 1 }}>
      <Box position="relative" flex={1}>
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
        <HStack
          sx={{
            _text: {
              color: '$amber100',
            },
          }}
          mt={'$4'}
          width={'100%'}
          justifyContent="center">
          <Clock
            format={'hh:mm:ss'}
            ticking={true}
            element={Text}
            style={{ fontSize: 16, color: '#1f3d56' }}
          />
        </HStack>
        <Heading textAlign="center" color="$textDark500">
          Gracias por visitarnos
        </Heading>

        <Center mt={'$10'}>
          <Box p="$4" w={'$full'} maxWidth={400}>
            <Box hardShadow={'1'} p="$4" bg="$white" borderRadius="$lg">
              <Heading textAlign="center" color="$textDark500">
                ¡Gracias por preferir nuestro servicio!
              </Heading>
              <Text color="$textDark500" mt={10} textAlign='center'>
                ¿Deseas calificar a {data.turn[0].barberData[0].name} {data.turn[0].barberData[0].lastname}?
              </Text>
              <HStack justifyContent="center" mt="$4">
                <BaseButton
                  background="$primary500"
                  color="$white"
                  onPress={() => navigation.navigate("UserBarberReview", { id: data.turn[0].barberData[0]._id })}
                  title="Calificar"
                  hasIcon={false}
                  disabled={false}
                  isLoading={false}
                />
              </HStack>
            </Box>
          </Box>
        </Center>
        <Center mt={10} px={100}>
          <Text color="$textDark500" textAlign='center'>
            Podrás agendar nuevos servicios a partir de mañana
          </Text>
        </Center>
      </Box>
    </LinearGradient>
  );
}
