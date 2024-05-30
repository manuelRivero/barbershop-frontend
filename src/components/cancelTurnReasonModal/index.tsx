import React, {useState, useEffect} from 'react';
import {
  Heading,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Icon,
  CloseIcon,
  Box,
  HStack,
  SelectItem,
} from '@gluestack-ui/themed';

import BaseButton from '../shared/baseButton';
import {Select} from '@gluestack-ui/themed';
import {SelectTrigger} from '@gluestack-ui/themed';
import {SelectInput} from '@gluestack-ui/themed';
import {SelectIcon} from '@gluestack-ui/themed';
import {ChevronDownIcon} from '@gluestack-ui/themed';
import {SelectPortal} from '@gluestack-ui/themed';
import {SelectBackdrop} from '@gluestack-ui/themed';
import {SelectContent} from '@gluestack-ui/themed';
import {SelectDragIndicatorWrapper} from '@gluestack-ui/themed';
import {SelectDragIndicator} from '@gluestack-ui/themed';
import CustomHeading from '../shared/heading';
import { barberReasons, clientReasons} from '../../const/cancelReasons'
interface Props {
  show: boolean;
  onClose: () => void;
  onNext: () => void;
  onChange: (reason: string) => void;
  user: 'barber' | 'user';
  selectedReason: any
}

export default function CancelTurnReasonModal({selectedReason, show, onClose, onNext, onChange, user}: Props) {


    const handleClose = (): void => {
    onClose();
  };

  const handleSelect = (reason: string) => {
    onChange(reason)
  };

  return (
    <Modal isOpen={show} onClose={handleClose}>
      <ModalBackdrop />
      <ModalContent bg="$white" >
        <ModalHeader>
          <CustomHeading textAlign="center">
            Elige un motivo para cancelar el turno
          </CustomHeading>
          <ModalCloseButton>
            <Icon as={CloseIcon} />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <Box mb="$4">
            <Select onValueChange={handleSelect}>
              <SelectTrigger variant="outline" size="md">
                <SelectInput fontSize={12} placeholder="Selecciona una opción" />
                <SelectIcon mr="$3">
                  <Icon as={ChevronDownIcon} />
                </SelectIcon>
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  {user === 'barber' && barberReasons.map((reason:string) => <SelectItem label={reason} value={reason} />)}
                  {user === 'user' && clientReasons.map((reason:string) => <SelectItem label={reason} value={reason} />)}
                </SelectContent>
              </SelectPortal>
            </Select>
          </Box>
        </ModalBody>
        <ModalFooter mt="$4">
          <HStack
            space="2xl"
            position="absolute"
            bottom={10}
            width={'100%'}
            justifyContent="center">
            <BaseButton
              title="Siguiente"
              disabled={!selectedReason}
              background={'$primary500'}
              color={'$white'}
              onPress={() => onNext()}
            />
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
