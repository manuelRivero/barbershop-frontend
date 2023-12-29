import React, {useState} from 'react';
import ProfileCard from '../../components/profile/profileCard';
import {Box, HStack, Heading, Text, VStack} from '@gluestack-ui/themed';
import Clock from 'react-live-clock';
import BaseButton from '../../components/shared/baseButton';
import LinkButton from '../../components/shared/linkButton';
import {RootState, useAppDispatch, useAppSelector} from '../../store';
import {logout} from '../../store/features/authSlice';
import ProfileForm from '../../components/profile/profileForm';
import {Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');


export default function Profile() {
  const dispacth = useAppDispatch();
  const {user} = useAppSelector((state: RootState) => state.auth);
  const [showModal, setShowModal] = useState<boolean>(false);
  const handleLogout = () => {
    dispacth(logout());
  };
  const handleProfileEdition = () => {};
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
        <VStack
          mt={'$4'}
          width={'100%'}
          alignItems='center'
          justifyContent="center">
          <Clock
            format={'hh:mm:ss'}
            ticking={true}
            element={Text}
            style={{fontSize: 22, color: '#1f3d56'}}
          />
        <Heading color="$textDark500" textAlign="center">
          Perfil
        </Heading>
        </VStack>
        <Box p="$4" mt="$10">
          <ProfileCard data={user} />
        </Box>
        <HStack
          space="2xl"
          position="absolute"
          bottom={10}
          width={'100%'}
          justifyContent="center">
          <LinkButton
            color="$primary500"
            title="Cerrar sesión"
            onPress={handleLogout}
            isLoading={false}
            disabled={false}
          />
          <BaseButton
            title="Editar perfil"
            background={'$primary500'}
            color={'$white'}
            onPress={() => setShowModal(true)}
            isLoading={false}
            disabled={false}
          />
        </HStack>
        <ProfileForm show={showModal} onClose={() => setShowModal(false)} />
      </Box>
    </LinearGradient>
  );
}
