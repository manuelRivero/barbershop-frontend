import {
  Text,
  Box,
  Image,
  VStack,
} from '@gluestack-ui/themed';
import React from 'react';
import {User} from '../../../types/user';

interface Props {
  data: User | null;
}

export default function ProfileCard({data}: Props) {
  if (!data) return null;
  return (
    <Box p="$4" softShadow="1" borderRadius={10} bg="$white">
      <VStack space="md" alignItems="center">
        <Box
          hardShadow="1"
          bg="$white"
          borderRadius={9999}
          style={{width: 100, height: 100}}>
          <Image
            borderRadius={9999}
            style={{width: 100, height: 100}}
            source={{uri: data.image}}
          />
        </Box>
        <Box>
          <Text
            color="$textDark500"
            textAlign="center">{`${data.name} ${data.lastname}`}</Text>
          <Text color="$textDark500" textAlign="center">{`${data.email}`}</Text>
        </Box>
      </VStack>
    </Box>
  );
}
