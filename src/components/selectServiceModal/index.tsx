import {
  Button,
  Heading,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Icon,
  Text,
  CloseIcon,
  ButtonText,
  FlatList,
  Box,
  Pressable,
} from '@gluestack-ui/themed';
import React, {useRef} from 'react';
import {Service} from '../../types/services';
import {ListRenderItemInfo} from 'react-native';
import { RootState, useAppSelector } from '../../store';
interface Props {
  show: boolean;
  onClose: () => void;
  onSelect: (e: Service) => void;
}
export default function SelectServiceModal({show, onClose, onSelect}: Props) {
  const {services} = useAppSelector((state: RootState) => state.services);

  const ref = useRef();

  return (
    <Modal
      isOpen={show}
      onClose={onClose}
      finalFocusRef={ref}
      bg={'$primary100'}>
      <ModalBackdrop />
      <ModalContent bg={'$white'}>
        <ModalHeader>
          <Heading size="lg">Servicios</Heading>
          <ModalCloseButton>
            <Icon as={CloseIcon} />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <FlatList
            data={services}
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
            renderItem={(props: ListRenderItemInfo<any>) => {
              const {item} = props;
              return (
                <Pressable onPress={() => onSelect(item)}>
                  <Box
                    softShadow={'2'}
                    borderColor="$primary100"
                    borderWidth={2}
                    borderStyle="solid"
                    p="$4"
                    borderRadius="$lg"
                    bg="$white">
                    <Text color="$textDark900">
                      Servicio:{' '}
                      <Text color="$textDark900" fontWeight="bold">
                        {item.name}
                      </Text>
                    </Text>
                    <Text color="$textDark900">
                      Duración:{' '}
                      <Text color="$textDark900" fontWeight="bold">
                        {item.duration} minutos
                      </Text>
                    </Text>
                    <Text color="$textDark900">
                      Precio:{' '}
                      <Text color="$textDark900" fontWeight="bold">
                        {item.price} pesos
                      </Text>
                    </Text>
                  </Box>
                </Pressable>
              );
            }}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
