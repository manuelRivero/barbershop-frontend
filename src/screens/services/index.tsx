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
import Header from '../../components/header';

const {width} = Dimensions.get('window');

export default function Services() {
  const navigation = useNavigation();

  const dispatch = useAppDispatch();
  const {services, showCreateServiceModal} = useAppSelector(
    (state: RootState) => state.services,
  );
  const {data, isLoading, refetch} = useGetServicesQuery();
  console.log('services', data?.services[0].images);

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
  if (isLoading) {
    return <Loader />;
  }
  return (
    <LinearGradient
      style={{flex: 1}}
      colors={['#fff', '#f1e2ca']}
      start={{x: 0, y: 0.6}}
      end={{x: 0, y: 1}}>
      <Box flex={1} position="relative">
        <Header
          title="Servicios disponibles"
          viewGoBack={false}
          viewClock={true}
          width={width}
        />
        <FlatList
          contentContainerStyle={{padding: 16, paddingBottom: 80}}
          mt="$16"
          data={services}
          ListEmptyComponent={<Text>No has agregado ningún servico</Text>}
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
            onPress={() => handleOpenModal()}
            isLoading={false}
            disabled={false}
            hasIcon={true}
            icon={AddIcon}
          />
        </HStack>
      </Box>
      <CreateServiceModal
        show={showCreateServiceModal}
        onClose={() => handleCloseModal()}
      />
    </LinearGradient>
  );
}
