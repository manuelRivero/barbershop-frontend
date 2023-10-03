import React from 'react';
import {Service} from '../../../types/services';
import {Box, Image} from '@gluestack-ui/themed';
import {Text} from '@gluestack-ui/themed';
import { HStack } from '@gluestack-ui/themed';
interface Props {
  data: Service;
}
export default function ServiceCard({data}: Props) {
  return (
    <Box softShadow={'1'} p="$4" borderRadius="$lg" bg="$white">
        <HStack justifyContent='center' mb={"$4"}>

              <Image w="$80" h="$80" borderRadius={10} source={data.image ? {uri:data.image} : require("./../../../assets/images/image-placeholder.png")} alt="foto-del-servicio"/>
        </HStack>

      <Text color="$textDark900">
        Servicio:{' '}
        <Text fontWeight="bold" color="$textDark900">
          {data.name}
        </Text>
      </Text>
      <Text color="$textDark900">
        Duración:{' '}
        <Text fontWeight="bold" color="$textDark900">
          {data.duration} minutos
        </Text>
      </Text>
      <Text color="$textDark900">
        Precio:{' '}
        <Text fontWeight="bold" color="$textDark900">
          {data.price} pesos
        </Text>
      </Text>

      <Text color="$textDark900">
        {data.description}
      </Text>
    </Box>
  );
}
