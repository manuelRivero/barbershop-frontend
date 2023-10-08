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
import {User} from '../../../types/user';

interface Props {
  data: User | null
}

export default function ProfileCard({data}: Props) {
  if(!data) return null
  return (
    <Box p="$4" softShadow='1' borderRadius={10} bg="$white">
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
