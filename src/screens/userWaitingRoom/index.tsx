import {HStack, Box, Text, Heading, Center} from '@gluestack-ui/themed';
import Clock from 'react-live-clock';

import React, {useEffect, useState} from 'react';
import {useGetTurnDetailsQuery} from '../../api/turnsApi';
import Loader from '../../components/shared/loader';
import moment from 'moment';
import LottieView from 'lottie-react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {BackHandler, Dimensions} from 'react-native';
import {RootState, useAppSelector} from '../../store';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');


export default function UserWaitingRoom({route}: any) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {turnId} = route.params;
  const {data, isLoading} = useGetTurnDetailsQuery({id: turnId});
  const {userTurn} = useAppSelector((state: RootState) => state.turns);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', function () {
      return true;
    });
    const interval = setInterval(() => {
      if (moment().utc().utcOffset(3, true).isAfter(userTurn?.endDate)) {
        navigation.navigate('UserGreetings', {turnId});
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [userTurn]);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <LinearGradient
      style={{flex: 1}}
      colors={['#fff', '#f1e2ca']}
      start={{x: 0, y: 0.6}}
      end={{x: 0, y: 1}}>
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
            style={{fontSize: 22, color: '#1f3d56'}}
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
            </Box>
            <HStack justifyContent="center" mt="$4">
              <LottieView
                style={{width: 150, height: 150}}
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
