import { HStack, Box, Text, Heading, Center } from '@gluestack-ui/themed';
import Clock from 'react-live-clock';

import React, { useEffect, useState } from 'react';
import { useGetTurnDetailsQuery } from '../../api/turnsApi';
import Loader from '../../components/shared/loader';
import moment from 'moment';
import LottieView from 'lottie-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { BackHandler, Dimensions } from 'react-native';
import { RootState, useAppSelector } from '../../store';
import LinearGradient from 'react-native-linear-gradient';
import PushNotification from 'react-native-push-notification';
import socket from '../../socket';

const { width } = Dimensions.get('window');

let interval: NodeJS.Timeout
export default function UserWaitingRoom({ route }: any) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { userTurn } = useAppSelector((state: RootState) => state.turns);

  const turnId = route.params?.turnId || userTurn?._id
  console.log("turnId", userTurn)
  const { data, isLoading } = useGetTurnDetailsQuery({ id: turnId });

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', function () {
      return true;
    });
    interval = setInterval(() => {
      if (moment().utc().utcOffset(3, true).isAfter(userTurn?.endDate)) {
        navigation.navigate('UserGreetings', { turnId });
        clearInterval(interval)
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [userTurn]);

  useEffect(() => {
    socket?.on('canceled-turn', ({ data }) => {
      console.log("canceled turn notification")
      
      PushNotification.localNotification({
        /* Android Only Properties */
        channelId: 'channel-id', // (required) channelId, if the channel doesn't exist, notification will not trigger.
        bigText: 'Turno cancelado', // (optional) default: "message" prop
        vibrate: true, // (optional) default: true
        vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
        groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
        ongoing: false, // (optional) set whether this is an "ongoing" notification
        priority: 'high', // (optional) set notification priority, default: high
        visibility: 'private', // (optional) set notification visibility, default: private
        ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
        title: '¡Nueva notificación!', // (optional)
        smallIcon: "ic_notification",
        largeIcon: "ic_launcher",

        /* iOS only properties */

        message: 'Tu turno ha sido cancelado por inasistencia', // (required)
      });
      navigation.navigate('BarberSelection');
      clearInterval(interval)

    });

    return () => {
      socket?.off('canceled-turn');
    };
  }, []);

  console.log("socket", socket)

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
          Sala de espera
        </Heading>
        <Center mt={'$10'}>
          <Box p="$4" w={'$full'} maxWidth={400}>
            <Box hardShadow={'1'} p="$4" bg="$white" borderRadius="$lg">
              <Text color="$textDark500">
                Tienes un turno agendado para :{' '}
                <Text color="$textDark900" fontWeight="bold">
                  {moment(data.turn[0].startDate)
                    .utc()
                    .utcOffset(3, true)
                    .format('hh:mm')}
                </Text>
              </Text>
              <Text color="$textDark500">
                Barbero:{' '}
                <Text
                  color="$textDark900"
                  fontWeight="bold">{`${data.turn[0].barberData[0].name} ${data.turn[0].barberData[0].lastname}`}</Text>
              </Text>
              <Text color="$textDark500">
                Servicio:{' '}
                <Text color="$textDark900" fontWeight="bold">
                  {data.turn[0].name}
                </Text>
              </Text>
              <Text color="$textDark500">
                Recuerda que tu asistencia debe ser 15 minutos antes de la hora de tu turno
              </Text>
            </Box>
            <HStack justifyContent="center" mt="$4">
              <LottieView
                style={{ width: 150, height: 150 }}
                source={require('./../../assets/lottie/waiting.json')}
                autoPlay
                loop={true}
              />
            </HStack>
          </Box>
        </Center>
      </Box>
    </LinearGradient>
  );
}
