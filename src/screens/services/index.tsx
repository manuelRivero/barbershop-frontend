import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  AddIcon,
  Box,
  Heading,
  HStack,
  Image,
  Text,
  FlatList,
  VStack,
} from '@gluestack-ui/themed';
import Clock from 'react-live-clock';
import BaseButton from '../../components/shared/baseButton';
import CreateServiceModal from '../../components/createServiceModal';
import {RootState, useAppDispatch, useAppSelector} from '../../store';
import {Service} from '../../types/services';
import ServiceCard from '../../components/shared/serviceCard';
import {Dimensions, ListRenderItemInfo} from 'react-native';
import {
  addAllServices,
  toggleCreateServiceModal,
} from '../../store/features/servicesSlice';
import {useGetServicesQuery} from '../../api/servicesApi';
import {useNavigation} from '@react-navigation/native';
import Loader from '../../components/shared/loader';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');


export default function Services() {
  const navigation = useNavigation();

  const dispatch = useAppDispatch();
  const {services, showCreateServiceModal} = useAppSelector(
    (state: RootState) => state.services,
  );
  const {data, isLoading, refetch} = useGetServicesQuery();
  console.log('data', data);

  const handleCloseModal = (): void => {
    dispatch(toggleCreateServiceModal(false));
  };
  const handleOpenModal = (): void => {
    dispatch(toggleCreateServiceModal(true));
  };
  useEffect(() => {
    if (data) {
      dispatch(addAllServices(data.services));
    }
  }, [data]);
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      refetch();
    });

    return unsubscribe;
  }, [navigation]);
  if(isLoading){
    return(<Loader />)
  }
  return (
    <LinearGradient
    style={{flex: 1}}
    colors={['#fff', '#f1e2ca']}
    start={{x: 0, y: 0.6}}
    end={{x: 0, y: 1}}>
      <Box flex={1} position='relative'>

      <Box
          borderRadius={9999}
          w={width * 3}
          h={width * 3}
          position="absolute"
          bg="#f1e2ca"
          overflow="hidden"
          top={-width * 2.75}
          left={-width}
          opacity={0.5}
        />
        <VStack
        alignItems='center'
          mt={'$4'}
          width={'100%'}
          justifyContent="center">
          <Clock
            format={'hh:mm:ss'}
            ticking={true}
            element={Text}
            style={{fontSize: 22, color: '#1f3d56'}}
          />
          <Heading textAlign="center" color="$textDark500">
            Servicios disponibles
          </Heading>
        </VStack>

          <FlatList
            contentContainerStyle={{padding:16, paddingBottom: 80}}
            mt="$10"
            data={services}
            renderItem={(props: ListRenderItemInfo<any>) => {
              const {item} = props;
              return <ServiceCard data={item} />;
            }}
            ItemSeparatorComponent={() => {
              return (
                <Box
                  style={{
                    height: 15,
                    width: '100%',
                  }}
                />
              );
            }}
          />

        <HStack
          position="absolute"
          bottom={10}
          width={'100%'}
          justifyContent="center">
          <BaseButton
            title="Crear servicio"
            background={'$primary500'}
            color={'$white'}
            onPress={handleOpenModal}
            isLoading={false}
            disabled={false}
            hasIcon={true}
            icon={AddIcon}
          />
        </HStack>
      </Box>
      <CreateServiceModal
        show={showCreateServiceModal}
        onClose={handleCloseModal}
      />
    </LinearGradient>
  );
}
