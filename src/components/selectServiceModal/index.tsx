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
import {services} from '../../dummy-data/services';
import {Service} from '../../types/services';
import {ListRenderItemInfo} from 'react-native';
interface Props {
  show: boolean;
  onClose: () => void;
  onSelect: (e: Service) => void;
}
export default function SelectServiceModal({show, onClose, onSelect}: Props) {
  const ref = useRef();

  return (
    <Modal isOpen={show} onClose={onClose} finalFocusRef={ref}>
      <ModalBackdrop />
      <ModalContent>
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
                  <Box softShadow={'1'} p="$4" borderRadius="$lg" bg="$white">
                    <Text>Servicio:{item.name}</Text>
                    <Text>Duración:{item.duration}</Text>
                    <Text>Precio:{item.price}</Text>
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
