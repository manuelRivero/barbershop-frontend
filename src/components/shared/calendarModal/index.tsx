import React, {useRef, useState, useEffect, useMemo} from 'react';
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
import {Calendar} from 'react-native-calendars';
import moment from 'moment';
import BaseButton from '../baseButton';

interface Props {
  show: boolean;
  onClose: () => void;
  onSelect: (e: Service) => void;
}
export default function CalendarModal({show, onClose, onSelect}: Props) {
  const ref = useRef();

  const disabledDaysIndexes: number[] = [7];
  const [markedDates, setMarkedDates] = useState<any>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const selectDate = (date: any) => {
    const newDate: any = {};
    newDate[date.dateString] = {
      selected: true,
      selectedColor: '#d09e4d',
      selectedByUser: true,
    };

    const datesArray = Object.keys(markedDates);

    const filteredDates = datesArray
      .filter(
        key =>
          markedDates[key as keyof typeof markedDates].selectedByUser !== true,
      )
      .reduce((acc: any, key) => {
        acc[key] = markedDates[key];
        return acc;
      }, {});

    setMarkedDates({...filteredDates, ...newDate});
  };

  const generateSundays = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const sundays = [];

    for (let month = 0; month < 12; month++) {
      const date = new Date(currentYear, month, 1);
      while (date.getDay() !== 0) {
        date.setDate(date.getDate() + 1);
      }
      while (date.getFullYear() === currentYear && date.getMonth() === month) {
        sundays.push(date.toISOString().split('T')[0]);
        date.setDate(date.getDate() + 7);
      }
    }

    return sundays;
  };

  useEffect(() => {
    setMarkedDates(
      generateSundays().reduce((obj: any, date) => {
        obj[date] = {disabled: true, disableTouchEvent: true};
        return obj;
      }, {}),
    );
  }, []);

  useEffect(() => {
    const datesArray = Object.keys(markedDates);
    const targetDate = datesArray.find(
      key =>
        markedDates[key as keyof typeof markedDates].selectedByUser === true,
    );
    console.log("target date", targetDate)
    if (targetDate) {
        setSelectedDate(targetDate);
    }
    return ()=>{
        setSelectedDate(null);

    }
  }, [markedDates]);

  console.log("selectedDate", selectedDate)

  return (
    <Modal
      isOpen={show}
      onClose={onClose}
      finalFocusRef={ref}>
      <ModalBackdrop />
      <ModalContent bg={'$white'}>
        <ModalHeader>
          <Heading size="lg">Fecha</Heading>
          <ModalCloseButton>
            <Icon as={CloseIcon} />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <Calendar
            firstDay={1}
            markedDates={markedDates}
            disabledDaysIndexes={disabledDaysIndexes}
            //   onMonthChange={(date) => {
            //     getDisabledDays(date.month - 1, date.year, disabledDaysIndexes);
            //   }}
            minDate={moment().utc().utcOffset(3, true).toString()}
            maxDate={moment().add('days', 7).toString()}
            initialDate={new Date().toString()}
            onDayPress={day => {
              selectDate(day);
              console.log('selected day', day);
            }}
            monthFormat={'yyyy MM'}
            disableAllTouchEventsForDisabledDays={true}
          />
          {selectedDate && (
            <Box mt={"$4"}>

                <BaseButton
                  background="$primary500"
                  color="$white"
                  onPress={() => onSelect(selectedDate)}
                  title="Seleccionar"
                  hasIcon={false}
                  disabled={false}
                  isLoading={false}
                />

            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
