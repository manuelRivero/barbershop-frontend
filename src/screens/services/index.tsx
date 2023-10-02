import React, {useState} from 'react';
import {
  ScrollView,
  AddIcon,
  Box,
  Heading,
  HStack,
  Image,
  Text,
} from '@gluestack-ui/themed';
import Clock from 'react-live-clock';
import BaseButton from '../../components/shared/baseButton';
import CreateServiceModal from '../../components/createServiceModal';
import {RootState, useAppSelector} from '../../store';
import {Service} from '../../types/services';
import ServiceCard from '../../components/shared/serviceCard';

export default function Services() {
  const {services} = useAppSelector((state: RootState) => state.services);
  console.log('services', services);
  const [showCreateServiceModal, setShowCreateServiceModal] =
    useState<boolean>(false);
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
          {services.map((service: Service) => {
            return <ServiceCard data={service} />;
          })}
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
            onPress={() => setShowCreateServiceModal(true)}
            isLoading={false}
            disabled={false}
            hasIcon={true}
            icon={AddIcon}
          />
        </HStack>
      </Box>
      <CreateServiceModal
        show={showCreateServiceModal}
        onClose={() => setShowCreateServiceModal(false)}
      />
    </>
  );
}
