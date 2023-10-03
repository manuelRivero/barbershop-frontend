import React from 'react';
import {Service} from '../../../types/services';
import {Box, Icon, Image, Pressable} from '@gluestack-ui/themed';
import {Text} from '@gluestack-ui/themed';
import {HStack} from '@gluestack-ui/themed';
import {Trash2, FileEdit} from 'lucide-react-native';
import { useAppDispatch } from '../../../store';
import { setServiceForEdition } from '../../../store/features/servicesSlice';
interface Props {
  data: Service;
}
export default function ServiceCard({data}: Props) {
  const dispatch = useAppDispatch()
  const handleEdit = () => {
    dispatch(setServiceForEdition(data))
  }
  return (
    <Box softShadow={'1'} p="$4" borderRadius="$lg" bg="$white">
      <HStack
        justifyContent="flex-end"
        w="$full"
        mb={'$4'}
        position="absolute"
        top={25}
        space="md"
        zIndex={100}>
        <Pressable>
          <Box borderRadius={'$full'} p="$2" bg={'$white'}>
            <Icon as={Trash2} size={24} color="$red500" />
          </Box>
        </Pressable>
        <Pressable onPress={handleEdit}>
          <Box borderRadius={'$full'} p="$2" bg={'$white'}>
            <Icon as={FileEdit} size={24} color="$blue500" />
          </Box>
        </Pressable>
      </HStack>
      <HStack justifyContent="center" mb={'$4'}>
        <Image
          w="$80"
          h="$80"
          borderRadius={10}
          source={
            data.image
              ? {uri: data.image}
              : require('./../../../assets/images/image-placeholder.png')
          }
          alt="foto-del-servicio"
        />
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

      <Text color="$textDark900">{data.description}</Text>
    </Box>
  );
}
