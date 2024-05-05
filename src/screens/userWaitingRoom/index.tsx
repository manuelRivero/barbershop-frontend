import {HStack, Box, Text, Heading, Center, Image} from '@gluestack-ui/themed';
import Clock from 'react-live-clock';

import React, {useCallback, useEffect, useState} from 'react';
import {useGetTurnDetailsQuery} from '../../api/turnsApi';
import Loader from '../../components/shared/loader';
import moment from 'moment';
import LottieView from 'lottie-react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {BackHandler, Dimensions} from 'react-native';
import {RootState, useAppDispatch, useAppSelector} from '../../store';
import LinearGradient from 'react-native-linear-gradient';
import PushNotification from 'react-native-push-notification';
import socket from '../../socket';
import {resetUserTurn} from '../../store/features/turnsSlice';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {VStack} from '@gluestack-ui/themed';
import {ScrollView} from '@gluestack-ui/themed';
import CustomHeading from '../../components/shared/heading';
import CustomText from '../../components/shared/text';
import { setLastServiceDate } from '../../store/features/authSlice';

const {width} = Dimensions.get('window');

let interval: NodeJS.Timeout;
export default function UserWaitingRoom({route}: any) {
  const dispacth = useAppDispatch();

  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {userTurn} = useAppSelector((state: RootState) => state.turns);

  const turnId = route.params?.turnId || userTurn?._id;

  const {data, isLoading, refetch, fulfilledTimeStamp} = useGetTurnDetailsQuery({id: turnId});
  const [activeSlide, setActiveSlide] = useState<number>(0);


  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', function () {
        return true;
      });
      
      
      interval = setInterval(() => {
        if (moment().utc().utcOffset(3, true).isAfter(moment(userTurn?.endDate))) {
          navigation.navigate('UserGreetings', {turnId});
          clearInterval(interval);
          refetch()
        }
      }, 1000);
  
      return () => clearInterval(interval);
    }, [userTurn]),
  );

  useEffect(() => {
    socket?.on('canceled-turn', ({data}) => {
      console.log('canceled turn notification');

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
        smallIcon: 'ic_notification',
        largeIcon: 'ic_launcher',

        /* iOS only properties */

        message: 'Tu turno ha sido cancelado por inasistencia', // (required)
      });
      dispacth(resetUserTurn());
      navigation.navigate('CanceledTurn');
      clearInterval(interval);
    });

    return () => {
      socket?.off('canceled-turn');
    };
  }, []);

  useEffect(()=>{

  },[fulfilledTimeStamp])

  if (isLoading) {
    return <Loader />;
  }
  return (
    <LinearGradient
      style={{flex: 1}}
      colors={['#fff', '#f1e2ca']}
      start={{x: 0, y: 0.6}}
      end={{x: 0, y: 1}}>
      <Box position="relative">
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
        <HStack mt={'$1'} width={'100%'} justifyContent="center">
          <Clock
            format={'hh:mm:ss'}
            ticking={true}
            element={Text}
            style={{fontSize: 16, color: '#1f3d56'}}
          />
        </HStack>
        <CustomHeading textAlign="center" color="$textDark500">
          Sala de espera
        </CustomHeading>
      </Box>
        <ScrollView mt={'$16'} flex={1}>
          <Center>
            <Box p="$4" w={'$full'} maxWidth={400}>
              <HStack justifyContent="center" mb="$6">
                <LottieView
                  style={{width: 90, height: 90}}
                  source={require('./../../assets/lottie/waiting.json')}
                  autoPlay
                  loop={true}
                />
              </HStack>
              <Box hardShadow={'1'} p="$4" bg="$white" borderRadius="$lg">
                <CustomText color="$textDark500">
                  Tienes un turno agendado para :{' '}
                  <CustomText color="$textDark900" fontWeight="bold">
                    {moment(data.turn[0].startDate)
                      .utc()
                      .utcOffset(3, true)
                      .format('DD-MM')} a las {moment(data.turn[0].startDate)
                        .utc()
                        .utcOffset(3, true)
                        .format('hh:mm A')}
                  </CustomText>
                </CustomText>
                <CustomText color="$textDark500">
                  Barbero:{' '}
                  <CustomText color="$textDark900" fontWeight="bold">
                    {`${data.turn[0].barberData[0].name} ${data.turn[0].barberData[0].lastname}`}
                  </CustomText>
                </CustomText>
                <CustomText color="$textDark500">
                  Servicio:{' '}
                  <CustomText color="$textDark900" fontWeight="bold">
                    {data.turn[0].name}
                  </CustomText>
                </CustomText>
                <CustomText color="$textDark500">
                  Precio:{' '}
                  <CustomText color="$textDark900" fontWeight="bold">
                    {data.turn[0].price}
                  </CustomText>
                </CustomText>
                <CustomText color="$textDark500">
                  Recuerda que tu asistencia debe ser 15 minutos antes de la
                  hora de tu turno
                </CustomText>
              </Box>

              {data && (
                <VStack mt={'$10'}>
                  <CustomHeading mb={'$4'}>
                    Galería de {data.turn[0].serviceData[0].name}
                  </CustomHeading>
                  <Carousel
                    data={data.turn[0].serviceData[0].images}
                    layout={'default'}
                    onSnapToItem={index => setActiveSlide(index)}
                    renderItem={({item, index}: any) => {
                      console.log('index', index);
                      return (
                        <Image
                          borderRadius={8}
                          w={'$full'}
                          style={{width: width * 0.8, height: width * 0.8}}
                          resizeMode="cover"
                          source={{uri: item.url}}
                          alt="imagen-de-servicio"
                        />
                      );
                    }}
                    sliderWidth={width}
                    itemWidth={width * 0.9}
                  />
                  <Pagination
                    dotStyle={{
                      backgroundColor: '#367187',
                    }}
                    dotsLength={data.turn[0].serviceData[0].images.length}
                    activeDotIndex={activeSlide}
                  />
                </VStack>
              )}
            </Box>
          </Center>
        </ScrollView>
    </LinearGradient>
  );
}
