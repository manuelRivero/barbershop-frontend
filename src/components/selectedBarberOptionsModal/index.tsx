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
  Box,
  Pressable,
} from '@gluestack-ui/themed';
import React, {useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
interface Props {
  show: boolean;
  onClose: () => void;
  barberId: number | null
}
export default function SelectBarberOptionsModal({
  show,
  onClose,
  barberId
}: Props) {
  const ref = useRef();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();


  const handleReview = () => {
    navigation.navigate("UserBarberReview",{id:barberId})
    onClose()
  }
  const handleGallery = () => {
    navigation.navigate("UserBarberGallery",{id:barberId})
    onClose()

  }
  const handleReservation = () => {
    navigation.navigate('UserServiceSelection', {
      id: barberId,
    })
    onClose()

  }
  return (
    <Modal
      isOpen={show && Boolean(barberId)}
      onClose={onClose}
      finalFocusRef={ref}
      >
      <ModalBackdrop />
      <ModalContent bg={'$white'}>
        <ModalHeader>
          <Heading size="lg"></Heading>
          <ModalCloseButton>
            <Icon as={CloseIcon} />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <Pressable onPress={handleGallery}>
            <Box
              softShadow={'2'}
              mb="$2"
              borderColor="$primary100"
              borderWidth={2}
              borderStyle="solid"
              p="$4"
              borderRadius="$lg"
              bg="$white">
              <Text color="$textDark900">Ver catalogo de cortes</Text>
            </Box>
          </Pressable>
          <Pressable onPress={handleReview}>
            <Box
              softShadow={'2'}
              mb="$2"
              borderColor="$primary100"
              borderWidth={2}
              borderStyle="solid"
              p="$4"
              borderRadius="$lg"
              bg="$white">
              <Text color="$textDark900">Calificar</Text>
            </Box>
          </Pressable>
          <Pressable onPress={handleReservation}>
            <Box
              softShadow={'2'}
              mb="$2"
              borderColor="$primary100"
              borderWidth={2}
              borderStyle="solid"
              p="$4"
              borderRadius="$lg"
              bg="$white">
              <Text color="$textDark900">Agendar turno</Text>
            </Box>
          </Pressable>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
