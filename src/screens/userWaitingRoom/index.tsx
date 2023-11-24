import {HStack, Box, Text, Heading} from '@gluestack-ui/themed';
import Clock from 'react-live-clock';

import React from 'react';
import {useGetTurnDetailsQuery} from '../../api/turnsApi';
import Loader from '../../components/shared/loader';
import moment from 'moment';
import LottieView from 'lottie-react-native';


export default function UserWaitingRoom({route}: any) {
  const {turnId} = route.params;
  const {data, isLoading} = useGetTurnDetailsQuery({id: turnId});

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
        Sala de espera
      </Heading>
      <Box p="$4">
        <Box softShadow={'1'} p="$4" bg="$white" borderRadius="$lg">
          <Text color="$textDark500">
            Tienes un turno agendado para :{' '}
            <Text color="$textDark900" fontWeight="bold">
              {moment(data.turn[0].startDate).format('hh:mm')}
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
        <LottieView
              style={{width: 150, height: 150}}
              source={require("./../../assets/lottie/waiting.json")}
              autoPlay
              loop={true}
            />
      </Box>
    </Box>
  );
}
