import React from 'react';
import {Service} from '../../../types/services';
import {Box} from '@gluestack-ui/themed';
import { Text } from '@gluestack-ui/themed';
interface Props {
  data: Service;
}
export default function ServiceCard({data}:Props) {
  return (
    <Box softShadow={'1'} p="$4" borderRadius="$lg" bg="$white">
      <Text color="$textDark900">Servicio:{data.name}</Text>
      <Text color="$textDark900">Duración:{data.duration}</Text>
      <Text color="$textDark900">Precio:{data.price}</Text>
    </Box>
  );
}
