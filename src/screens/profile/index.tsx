import React, { useState } from 'react';
import ProfileCard from '../../components/profile/profileCard';
import {Box, HStack, Heading, Text} from '@gluestack-ui/themed';
import Clock from 'react-live-clock';
import BaseButton from '../../components/shared/baseButton';
import LinkButton from '../../components/shared/linkButton';
import { RootState, useAppDispatch, useAppSelector } from '../../store';
import { logout } from '../../store/features/authSlice';
import ProfileForm from '../../components/profile/profileForm';

export default function Profile() {
  const dispacth = useAppDispatch()
  const {user} = useAppSelector((state: RootState) => state.auth);

  const [showModal, setShowModal] = useState<boolean>(false)
  const handleLogout = () => {
    dispacth(logout())
  }
  const handleProfileEdition = () => {

  }
  return (
    <Box flex={1} bg={'$primary100'}>
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
      <Heading color="$textDark500" textAlign="center">
        Perfil
      </Heading>
      <ProfileCard data={user} />
      <HStack
      space="2xl"
        position="absolute"
        bottom={10}
        width={'100%'}
        justifyContent="center">
        <LinkButton
        color='$primary500'
          title="Cerrar sesión"
          onPress={() => {}}
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
      <ProfileForm show={showModal} onClose={()=>setShowModal(false)} />
    </Box>
  );
}
