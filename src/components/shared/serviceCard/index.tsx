import React from 'react';
import {Service} from '../../../types/services';
import {Box, Icon, Image, Pressable} from '@gluestack-ui/themed';
import {Text} from '@gluestack-ui/themed';
import {HStack} from '@gluestack-ui/themed';
import {Trash2, FileEdit, Clock2, CircleDollarSign} from 'lucide-react-native';
import {useAppDispatch} from '../../../store';
import {setServiceForEdition} from '../../../store/features/servicesSlice';
interface Props {
  data: Service;
}
export default function ServiceCard({data}: Props) {
  const dispatch = useAppDispatch();
  const handleEdit = () => {
    dispatch(setServiceForEdition(data));
  };
  return (
    <Box softShadow={'1'} p="$4" borderRadius="$lg" bg="$white">
      <HStack space="lg" mb={'$4'}>
        <Image
          w="$20"
          h="$20"
          borderRadius={10}
          source={
            data.image
              ? {uri: data.image}
              : require('./../../../assets/images/image-placeholder.png')
          }
          alt="foto-del-servicio"
        />
        <Box>
          <Text fontWeight="bold" color="$textDark500">
            {data.name}
          </Text>
          <HStack space="xs" w="$full" mt={"$2"} flexWrap='wrap'>
            <HStack space="xs" bg={"$primary100"}  px="$1" borderRadius={"$full"} alignItems="center">
              <Icon as={Clock2} color="$textDark500"/>
              <Text fontWeight="bold" color="$textDark500">
                {data.duration} minutos
              </Text>
            </HStack>
            <HStack space="xs" bg={"$primary100"}  px="$1" borderRadius={"$full"} alignItems="center">
              <Icon as={CircleDollarSign} color="$textDark500" />
              <Text fontWeight="bold" color="$textDark500">
                {data.price} pesos
              </Text>
            </HStack>
          </HStack>
        </Box>
      </HStack>

      <Text color="$textDark500">{data.description}</Text>
      <HStack justifyContent="flex-end" w="$full" space="md" zIndex={100}>
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
    </Box>
  );
}
