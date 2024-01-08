import {HStack, Box, Text, Heading, Center} from '@gluestack-ui/themed';
import Clock from 'react-live-clock';

import React, { useEffect, useState } from 'react';
import {useGetTurnDetailsQuery} from '../../api/turnsApi';
import Loader from '../../components/shared/loader';
import moment from 'moment';
import LottieView from 'lottie-react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import { BackHandler } from 'react-native';


export default function UserWaitingRoom({route}: any) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {turnId} = route.params;
  const {data, isLoading} = useGetTurnDetailsQuery({id: turnId});
  const [restartTime, setRestartTime] = useState<moment.Moment>(moment().utc().utcOffset(3, true).set({hour: 23, minutes: 0}))

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', function() {return true})
    const interval = setInterval(() => {
      if (
        moment()
          .utc()
          .utcOffset(3, true)
          .isAfter(restartTime)
          
      ) {
        const day = moment().utc().utcOffset(3, true).get("date").toLocaleString()
        setRestartTime(moment().set({date: parseInt(day) + 1, hour: 23, minute: 0, second: 0}).utc().utcOffset(3, true))
        navigation.navigate("Usergreetings")
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
        Sala de espera
      </Heading>
      <Center>

      <Box p="$4" w={"$full"} maxWidth={400}>
        <Box softShadow={'1'} p="$4" bg="$white" borderRadius="$lg">
          <Text color="$textDark500">
            Tienes un turno agendado para :{' '}
            <Text color="$textDark900" fontWeight="bold">
              {moment(data.turn[0].startDate).utc().utcOffset(3, true).format('hh:mm')}
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
        <HStack justifyContent='center' mt="$4">
        <LottieView
              style={{width: 150, height: 150}}
              source={require("./../../assets/lottie/waiting.json")}
              autoPlay
              loop={true}
            />

        </HStack>
      </Box>
      </Center>
    </Box>
  );
}
