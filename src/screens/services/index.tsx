import React, {useState} from 'react';
import {
  ScrollView,
  AddIcon,
  Box,
  Heading,
  HStack,
  Image,
  Text,
  FlatList,
} from '@gluestack-ui/themed';
import Clock from 'react-live-clock';
import BaseButton from '../../components/shared/baseButton';
import CreateServiceModal from '../../components/createServiceModal';
import {RootState, useAppDispatch, useAppSelector} from '../../store';
import {Service} from '../../types/services';
import ServiceCard from '../../components/shared/serviceCard';
import {ListRenderItemInfo} from 'react-native';
import { toggleCreateServiceModal } from '../../store/features/servicesSlice';

export default function Services() {
  const {services, showCreateServiceModal} = useAppSelector(
    (state: RootState) => state.services,
  );
  const dispatch = useAppDispatch();
  console.log('services', services);
  const handleCloseModal = ():void => {
    dispatch(toggleCreateServiceModal(false));
  };
  const handleOpenModal = ():void => {
    dispatch(toggleCreateServiceModal(true));
  };
  return (
    <>
      <Box bg="$primary100" flex={1}>
        <HStack
          sx={{
            _text: {
              color: '$amber100',
            },
          }}
          mt={'$4'}
          width={'100%'}
          justifyContent="center">
          <Clock
            format={'hh:mm:ss'}
            ticking={true}
            element={Text}
            style={{fontSize: 22, color: '#1f3d56'}}
          />
        </HStack>

        <ScrollView flex={1}>
          <Heading textAlign="center" color="$textDark900">
            Servicios disponibles
          </Heading>
          <FlatList
            contentContainerStyle={{paddingBottom: 50}}
            p="$4"
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
        </ScrollView>

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
    </>
  );
}
