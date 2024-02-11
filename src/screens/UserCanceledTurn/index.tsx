import { HStack, Box, Text, Heading, Center, Button } from '@gluestack-ui/themed';

import React, { useEffect, useState } from 'react';
import LottieView from 'lottie-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { BackHandler, Dimensions } from 'react-native';
import BaseButton from '../../components/shared/baseButton';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

export default function UserCanceledTurn({ route }: any) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', function () {
      return true;
    });
 

  }, []);

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
        <Heading textAlign="center" color="$textDark500" mt="$8">
          Turno cancelado
        </Heading>

        <Center mt={'$16'}>
          <Box p="$4" w={'$full'} maxWidth={400}>
            <Box hardShadow={'1'} p="$4" bg="$white" borderRadius="$lg">
              <Heading textAlign="center" color="$textDark500">
                Tu turno ha sido cancelado por inasistencia
              </Heading>
              <Text color="$textDark500" mt={10} textAlign='center'>
              recuerda que la asistencia al local por cualquiera de nuestros servicios debe ser de 15 minutos antes de la hora agendada de forma obligatoria.
              </Text>
              <Text color="$textDark500" mt={10} textAlign='center'>
                Si consideras que esto fue un error no dudes en comunicarte con nuestro administrador al numero +54 123123123
              </Text>
            </Box>
          </Box>
        </Center>
        <HStack justifyContent="center" mt="$4">
                <BaseButton
                  background="$primary500"
                  color="$white"
                  onPress={() => navigation.navigate("BarberSelection")}
                  title="Volver al inicio"
                  hasIcon={false}
                  disabled={false}
                  isLoading={false}
                />
              </HStack>
      </Box>
    </LinearGradient>
  );
}
