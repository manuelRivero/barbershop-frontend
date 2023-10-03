import React, {useRef} from 'react';
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
  HStack,
} from '@gluestack-ui/themed';
import {RootState, useAppDispatch, useAppSelector} from '../../../store';
import {hideInfoModal} from '../../../store/features/layoutSlice';
import LottieView from 'lottie-react-native';

const animations = {
  success: require('../../../assets/lottie/success.json'),
};

export default function InfoModal() {
  const dispatch = useAppDispatch();
  const {infoModal} = useAppSelector((state: RootState) => state.layout);

  const handleClose = () => {
    dispatch(hideInfoModal());
  };

  const handleCancel = () => {
    if (infoModal?.cancelCb) {
      infoModal.cancelCb();
    }
  };
  const handleSubmit = () => {
    if (infoModal?.submitCb) {
      infoModal.submitCb();
    }
  };
  const handleAnimationEnd = () => {
    console.log("on animation end")
    if (infoModal?.hideOnAnimationEnd) {
        dispatch(hideInfoModal());

    }
  };
  return (
    <Modal isOpen={Boolean(infoModal)} onClose={handleClose} bg="$primary100">
      <ModalBackdrop />
      <ModalContent bg="$white" p="$4">
        <ModalBody>
          <HStack justifyContent="center">
            <LottieView
              style={{width: 150, height: 150}}
              source={require('../../../assets/lottie/success.json')}
              onAnimationFinish={()=>handleAnimationEnd()}
              autoPlay
              loop={false}
            />
          </HStack>
          <Text textAlign="center" color={'$textDark500'}>
            {infoModal?.title}
          </Text>
        </ModalBody>
        <ModalFooter>
          {infoModal?.hasCancel && (
            <Button
              variant="outline"
              size="sm"
              action="secondary"
              mr="$3"
              onPress={handleCancel}>
              <ButtonText>Cancelar</ButtonText>
            </Button>
          )}
          {infoModal?.hasSubmit && (
            <Button
              size="sm"
              action="positive"
              borderWidth="$0"
              onPress={handleSubmit}>
              <ButtonText>Aceptar</ButtonText>
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
