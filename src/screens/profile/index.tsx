import React from 'react';
import ProfileCard from '../../components/profile/profileCard';
import {barber} from '../../dummy-data/barbers';
import {Box, HStack, Heading, Text} from '@gluestack-ui/themed';
import Clock from 'react-live-clock';

export default function Profile() {
  return (
    <Box flex={1} bg={'$primary100'} >
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
      <ProfileCard data={barber} />
    </Box>
  );
}
