import React from 'react';
import {Box, Icon} from '@gluestack-ui/themed';
import {Text} from '@gluestack-ui/themed';
import {HStack} from '@gluestack-ui/themed';
import { Clock2, CircleDollarSign} from 'lucide-react-native';
import {Image} from 'react-native';
import { useAppDispatch } from '../../store';
import { Service } from '../../types/services';




interface Props {
  data: Service;
}
export default function UserServiceCard({data}: Props) {
  const dispatch = useAppDispatch();
  
  return (
    <Box softShadow={'1'} p="$4" borderRadius="$lg" bg="$white">
      <HStack space="lg" mb={'$4'}>
        <Image
          style={{width: 100, height: 100}}
          borderRadius={10}
          resizeMode={'cover'}
          source={{
            uri: data.image,
            headers: {
              Pragma: 'no-cache',
            },
          }}
          alt="foto-del-servicio"
          onError={({ nativeEvent: {error} }) => console.log(error)}
        />
        
        <Box>
          <Text fontWeight="bold" color="$textDark500">
            {data.name}
          </Text>
          <HStack space="xs" mt={'$2'} flexWrap="wrap">
            <HStack
              space="xs"
              bg={'$primary100'}
              px="$1"
              borderRadius={'$full'}
              alignItems="center">
              <Icon as={Clock2} color="$textDark500" />
              <Text fontWeight="bold" color="$textDark500">
                {data.duration} minutos
              </Text>
            </HStack>
            <HStack
              space="xs"
              bg={'$primary100'}
              px="$1"
              borderRadius={'$full'}
              alignItems="center">
              <Icon as={CircleDollarSign} color="$textDark500" />
              <Text fontWeight="bold" color="$textDark500">
                {data.price} pesos
              </Text>
            </HStack>
          </HStack>
        </Box>
      </HStack>

      <Text color="$textDark500">{data.description}</Text>
    </Box>
  );
}
