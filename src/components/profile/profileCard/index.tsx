import {
  Avatar,
  AvatarGroup,
  AvatarImage,
  HStack,
  Text,
  Box,
  Image,
} from '@gluestack-ui/themed';
import React from 'react';
import {Barber} from '../../../types/barber';

interface Props {
  data: Barber;
}

export default function ProfileCard({data}: Props) {
  console.log('profile image', data.image);
  return (
    <Box p="$4">
      <HStack space="md" alignItems="center">
        <Image
          borderRadius={9999}
          style={{width: 100, height: 100}}
          source={{uri: data.image}}
        />
        <Box>
          <Text color="$textDark500">{`${data.name} ${data.lastname}`}</Text>
          <Text color="$textDark500">{`${data.email}`}</Text>
        </Box>
      </HStack>
    </Box>
  );
}
