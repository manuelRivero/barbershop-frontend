import React, { useState } from 'react';
import {Box, Icon, Pressable} from '@gluestack-ui/themed';
import {Text} from '@gluestack-ui/themed';
import {HStack} from '@gluestack-ui/themed';
import { Clock2, CircleDollarSign} from 'lucide-react-native';
import {Image} from 'react-native';
import { useAppDispatch } from '../../store';
import { Service } from '../../types/services';
import { VStack } from '@gluestack-ui/themed';
import ServiceImageModal from '../serviceImageModal';
import CustomText from '../shared/text';




interface Props {
  data: Service;
}
export default function UserServiceCard({data}: Props) {
  const dispatch = useAppDispatch();
  const [showImageModal, setShowImageModal] = useState<boolean>(false);

  
  return (
    <>
    <Box softShadow={'1'} p="$4" borderRadius="$lg" bg="$white">
      <HStack space="lg" mb={'$4'}>
        <Pressable onPress={()=> setShowImageModal(true)}>

        <Image
          style={{width: 100, height: 100}}
          borderRadius={10}
          resizeMode={'cover'}
          source={{
            uri: data.images[0].url,
            headers: {
              Pragma: 'no-cache',
            },
          }}
          alt="foto-del-servicio"
          onError={({ nativeEvent: {error} }) => console.log(error)}
        />

        </Pressable>
        
        <Box>
          <CustomText fontWeight="bold">
            {data.name}
          </CustomText>
          <VStack space="xs" mt={'$2'} flexWrap="wrap">
            <HStack
              space="xs"
              bg={'$primary100'}
              px="$1"
              borderRadius={'$full'}
              alignItems="center">
              <Icon as={Clock2} color="$textDark500" />
              <CustomText fontWeight="bold" color="$textDark500">
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
              <CustomText fontWeight="bold" >
                {data.price} pesos
              </CustomText>
            </HStack>
          </VStack>
        </Box>
      </HStack>

      <CustomText >{data.description}</CustomText>
    </Box>
    <ServiceImageModal
        show={showImageModal}
        onClose={() => setShowImageModal(false)}
        service={data}
      />
    </>
  );
}
