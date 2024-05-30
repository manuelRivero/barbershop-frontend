import {HStack, Box, Center} from '@gluestack-ui/themed';

import React, {useEffect, useState} from 'react';
import LottieView from 'lottie-react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {BackHandler, Dimensions} from 'react-native';
import BaseButton from '../../components/shared/baseButton';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../../components/shared/text';
import CustomHeading from '../../components/shared/heading';
import {useGetTurnDetailsQuery} from '../../api/turnsApi';
import Loader from '../../components/shared/loader';
import moment from 'moment';
import Header from '../../components/header';

const {width} = Dimensions.get('window');

export default function UserCanceledTurn({route}: any) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const turnId = route.params?.turnId;
  const userType = route.params?.userType || 'user';

  const {data, isLoading, refetch, fulfilledTimeStamp} = useGetTurnDetailsQuery(
    {id: turnId},
    {pollingInterval: 3600000},
  );

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', function () {
      return true;
    });
  }, []);

  useEffect(() => {
    if (data) refetch();
  }, [refetch]);

  if (isLoading || !data) {
    return <Loader />;
  }

  return (
    <LinearGradient
      style={{flex: 1}}
      colors={['#fff', '#f1e2ca']}
      start={{x: 0, y: 0.6}}
      end={{x: 0, y: 1}}>
      <Box position="relative" flex={1}>
      <Header
          title="Turnos agendados"
          viewGoBack={userType === "barber"}
          viewClock={false}
          width={width}
        />
        {console.log('canceled turn data', data)}
        <CustomHeading textAlign="center" color="$textDark500" mt="$16">
          Turno cancelado
        </CustomHeading>

        <Center mt={'$4'}>
          <Box p="$4" w={'$full'} maxWidth={400}>
            <Box hardShadow={'1'} p="$4" bg="$white" borderRadius="$lg">
              {userType === 'user' ? (
                <CustomHeading textAlign="center" color="$textDark500">
                  Tu turno ha sido cancelado por {data.turn[0].cancelReason}
                </CustomHeading>
              ) : (
                <CustomHeading textAlign="center" color="$textDark500">
                  El turno para {moment(data.turn[0].startDate).format("DD-MM-YYYY hh:mm A")}, fue cancelado por el cliente ha sido cancelado por {data.turn[0].cancelReason}
                </CustomHeading>
              )}
              {userType === 'user' && (
                <CustomText color="$textDark500" mt={10} textAlign="center">
                  Si consideras que esto fue un error no dudes en comunicarte
                  con nuestro administrador al numero +54 123123123
                </CustomText>
              )}
            </Box>
          </Box>
        </Center>
        {userType === 'user' && <HStack justifyContent="center" mt="$4">
          <BaseButton
            background="$primary500"
            color="$white"
            onPress={() => navigation.navigate('BarberSelection')}
            title="Volver al inicio"
            hasIcon={false}
            disabled={false}
            isLoading={false}
          />
        </HStack>}
        
      </Box>
    </LinearGradient>
  );
}
