import {
  Box,
  HStack,
  Heading,
  Icon,
  Image,
  Pressable,
} from '@gluestack-ui/themed';
import {ChevronLeftIcon} from 'lucide-react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Carousel from 'react-native-snap-carousel';
import {Dimensions, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Loader from '../../components/shared/loader';
import {useGetBarberServicesQuery} from '../../api/servicesApi';
import {Service} from '../../types/services';
import {CircleDollarSign} from 'lucide-react-native';
import CustomText from '../../components/shared/text';
import {Clock2} from 'lucide-react-native';
import {VStack} from '@gluestack-ui/themed';
import BaseButton from '../../components/shared/baseButton';
import Header from '../../components/header';
import { useGetBarberDetailQuery } from '../../api/barbersApi';
import BarberAvatar from '../../components/shared/barberAvatar';

const width = Dimensions.get('window').width;
export default function UserBarberGallery({route}: any) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {id} = route.params;
  const {data, isLoading, refetch} = useGetBarberServicesQuery({id: id});
  const {data:barberData, isLoading:isLoadingBarberData, refetch: refetchBarberData} = useGetBarberDetailQuery({id})

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      refetch();
      refetchBarberData();
    });

    return unsubscribe;
  }, [navigation]);

  if (isLoading || isLoadingBarberData) {
    return <Loader />;
  }

  return (
    <LinearGradient
      style={{flex: 1}}
      colors={['#fff', '#f1e2ca']}
      start={{x: 0, y: 0.6}}
      end={{x: 0, y: 1}}>
      <Box p="$4" flex={1} position="relative">
        <Header
          title="Galería"
          viewClock={false}
          viewGoBack={true}
          width={width}
        />
        <Box mt="$16" mb={"$4"} >
          <BarberAvatar barber={barberData?.barber[0] || null} />
        </Box>
        <Box mb="$4" flex={1} justifyContent="center" alignItems="center">
          {data && data.services.length > 0 ? (
            <Carousel
              data={data?.services.flatMap((service: Service) =>
                service.images.map(image => ({...image, service})),
              )}
              renderItem={({item}: any) => (
                <Box>
                  <Box borderRadius={'$lg'} overflow="hidden">
                    <Image
                      source={{uri: item.url}}
                      w={300}
                      h={300}
                      alt="imagen del servicio"
                    />
                  </Box>
                  <CustomText fontWeight="bold" mt={'$2'}>
                    {item.service.name}
                  </CustomText>
                  <VStack space="xs" mt={'$2'} flexWrap="wrap">
                    <HStack
                      space="xs"
                      bg={'$primary100'}
                      px="$1"
                      borderRadius={'$full'}>
                      <Icon as={Clock2} color="$textDark500" />
                      <CustomText fontWeight="bold" color="$textDark500">
                        {item.service.duration} minutos
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
                        {item.service.price} pesos
                      </CustomText>
                    </HStack>
                  </VStack>
                  <HStack mt={'$2'} justifyContent="center">
                    <BaseButton
                      background="$primary500"
                      color="$white"
                      onPress={() =>
                        navigation.navigate('UserServiceSelection', {
                          id,
                          service: item.service,
                        })
                      }
                      title="Agentar"
                      hasIcon={false}
                      disabled={false}
                      isLoading={false}
                    />
                  </HStack>
                </Box>
              )}
              sliderWidth={width}
              itemWidth={width * 0.8}
            />
          ) : (
            <Text>Este barbero no ha subido fotos</Text>
          )}
        </Box>
      </Box>
    </LinearGradient>
  );
}

interface CarouselItemProps {
  img: string;
}
const CarouselItem = ({img}: CarouselItemProps) => {
  console.log('Img carousel', img);
  return (
    <Box borderRadius={'$2xl'} bg="$red100" overflow="hidden">
      <Image
        source={{uri: img}}
        alt="imagen del corte"
        width={width * 0.8}
        height={300}
        resizeMode="cover"
      />
    </Box>
  );
};
