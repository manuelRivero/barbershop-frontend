import React from 'react';
import {Service} from '../../../types/services';
import {Box, Icon, Pressable, VStack} from '@gluestack-ui/themed';
import FastImage from 'react-native-fast-image';
import {Text} from '@gluestack-ui/themed';
import {HStack} from '@gluestack-ui/themed';
import {Trash2, FileEdit, Clock2, CircleDollarSign} from 'lucide-react-native';
import {useAppDispatch} from '../../../store';
import {
  removeService,
  setServiceForEdition,
} from '../../../store/features/servicesSlice';
import {
  hideInfoModal,
  showInfoModal,
} from '../../../store/features/layoutSlice';
import {Image} from 'react-native';
import { AdvancedImage } from 'cloudinary-react-native';
import { Cloudinary } from '@cloudinary/url-gen';
import CustomText from '../text';



const cld = new Cloudinary({
  cloud: {
      cloudName: 'djbolgjce'
  }
});

interface Props {
  data: Service;
}
export default function ServiceCard({data}: Props) {
  const dispatch = useAppDispatch();
  const handleEdit = () => {
    dispatch(setServiceForEdition(data));
  };
  const handleDelete = (): void => {
    dispatch(
      showInfoModal({
        title: '¿Deseas eliminar este servicio?',
        type: 'info',
        hasCancel: true,
        cancelCb: () => {
          dispatch(hideInfoModal());
        },
        hasSubmit: true,
        submitCb: () => {
          dispatch(removeService(data));
          dispatch(hideInfoModal());
          dispatch(
            showInfoModal({
              title: '¡Servicio eliminado!',
              type: 'success',
              hasCancel: false,
              cancelCb: null,
              hasSubmit: false,
              submitCb: null,
              hideOnAnimationEnd: true,
              submitData: null,
              cancelData: null,
            }),
          );
        },
        hideOnAnimationEnd: false,
        submitData: {
          text: 'Eliminar',
          background: '$red500',
        },
        cancelData: {
          text: 'Cancelar',
          background: '$blueGray200',
        },
      }),
    );
  };
  
  return (
    <Box hardShadow={'1'} p="$4" borderRadius="$lg" bg="$white">
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
        
        <Box flex={1}>
          <Box flexDirection='row'>
          <CustomText fontWeight="bold" color="$textDark500">
            {data.name}
          </CustomText>

          </Box>
          <VStack space="sm" mt={'$1'} flexWrap="wrap">
            <HStack
              space="xs"
              bg={'$primary100'}
              px="$1"
              borderRadius={'$full'}
              alignItems="center">
              <Icon as={Clock2} color="$textDark500" />
              <CustomText fontWeight="bold">
                {data.duration} minutos
              </CustomText>
            </HStack>
            <HStack
              space="xs"
              bg={'$primary100'}
              px="$1"
              borderRadius={'$full'}
              alignItems="center">
              <Icon as={CircleDollarSign} color="$textDark500" />
              <CustomText fontWeight="bold">
                {data.price} pesos
              </CustomText>
            </HStack>
          </VStack>
        </Box>
      </HStack>

      <CustomText color="$textDark500">{data.description}</CustomText>
      <HStack justifyContent="flex-end" w="$full" space="md" zIndex={100}>
        <Pressable onPress={handleDelete}>
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
