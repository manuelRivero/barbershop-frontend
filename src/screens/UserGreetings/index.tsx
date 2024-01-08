import {HStack, Box, Text, Heading, Center} from '@gluestack-ui/themed';
import Clock from 'react-live-clock';

import React, {useEffect, useState} from 'react';
import {useGetTurnDetailsQuery} from '../../api/turnsApi';
import Loader from '../../components/shared/loader';
import moment from 'moment';
import LottieView from 'lottie-react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {BackHandler} from 'react-native';
import { useAppDispatch } from '../../store';
import PushNotification from 'react-native-push-notification';

export default function UserGreetings({route}: any) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dispatch = useAppDispatch();
  const {turnId} = route.params;
  const {data, isLoading} = useGetTurnDetailsQuery({id: turnId});
  const [restartTime, setRestartTime] = useState<moment.Moment>(
    moment().utc().utcOffset(3, true).set({hour: 23, minutes: 0}),
  );

  useEffect(() => {
    console.log("Data de barbero ", data)

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
          path:"UserBarberReview"
        },

        /* iOS only properties */

        message: `Gracias por elegir nuestro servicio. ¿Deseas calificar a ${data.turn[0].barberData[0].name} ${data.turn[0].barberData[0].lastname}?`, // (required)
      });
  }, []);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', function () {
      return true;
    });
    const interval = setInterval(() => {
      if (moment().utc().utcOffset(3, true).isAfter(restartTime)) {
        const day = moment()
          .utc()
          .utcOffset(3, true)
          .get('date')
          .toLocaleString();
        setRestartTime(
          moment()
            .set({date: parseInt(day) + 1, hour: 23, minute: 0, second: 0})
            .utc()
            .utcOffset(3, true),
        );
        navigation.navigate('BarberSelection');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [restartTime]);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <Box bg="$primary100" flex={1}>
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
          style={{fontSize: 22, color: '#1f3d56'}}
        />
      </HStack>
      <Heading textAlign="center" color="$textDark500">
        Gracias por visitarnos
      </Heading>
      <Center>
        <Box p="$4" w={'$full'} maxWidth={400}>
          <Text color="$textDark500">
            ¡Gracias por preferir nuestro servicio!
          </Text>
          <Text color="$textDark500">
            ¿Deseas calificar a?
          </Text>
          <Text color="$textDark500">
            Podrá agendar nuevos servicios a partir de mañana
          </Text>
          <HStack justifyContent="center" mt="$4">
            <LottieView
              style={{width: 150, height: 150}}
              source={require('./../../assets/lottie/success.json')}
              autoPlay
              loop={false}
            />
          </HStack>
        </Box>
      </Center>
    </Box>
  );
}
