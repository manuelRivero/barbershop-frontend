import React, {useEffect, useState} from 'react';
import moment from 'moment-timezone';
import {
  ScrollView,
  AddIcon,
  Box,
  Heading,
  HStack,
  Image,
  Text,
} from '@gluestack-ui/themed';
import {Event, TurnSelectItem} from '../../types/turns';
import Clock from 'react-live-clock';
import SelectServiceModal from '../../components/selectServiceModal';
import {Service} from '../../types/services';
import SelectTurnModal from '../../components/selectTurnModal';
import TurnCard from '../../components/turnCard';
import BaseButton from '../../components/shared/baseButton';
import {RootState, useAppDispatch, useAppSelector} from '../../store';
import {addTurn} from '../../store/features/turnsSlice';

const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

export default function Schedule() {
  const dispacth = useAppDispatch();
  const {turns} = useAppSelector((state: RootState) => state.turns);
  const [showServiceModal, setShowServiceModal] = useState<boolean>(false);

  const [showTurnModal, setShowTurnModal] = useState<boolean>(false);

  const [turnList, setTurnList] = useState<TurnSelectItem[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const handleAddTurn = (turn: TurnSelectItem) => {
    if (selectedService) {
      dispacth(
        addTurn({
          _id: (turns.length + 1).toString(),
          status: 'INCOMPLETE',
          price: selectedService.price,
          title: selectedService.name,
          startDate: moment(turn.startDate).toString(),
          endDate: moment(turn.startDate)
            .add(selectedService.duration, 'minutes')
            .toString(),
        }),
      );
      setSelectedService(null);
      setShowTurnModal(false);
    }
  };

  useEffect(() => {
    const checkTurnForServiceTime = () => {
      let startDate = moment(new Date());
      const list: TurnSelectItem[] = [];
      hours.forEach(hour => {
        if (moment().hour() <= hour) return;
        const isUnavaibleIndex = turns.findIndex((turn: Event) => {
          const clonedStartDate = startDate.clone();
          const startDateValidation = clonedStartDate.isBetween(
            moment(turn.startDate),
            moment(turn.endDate),
          );
          const endDateValidation = clonedStartDate
            .add(selectedService?.duration, 'minutes')
            .isBetween(moment(turn.startDate), moment(turn.endDate));
          if (startDateValidation || endDateValidation) {
            return true;
          } else {
            return false;
          }
        });
        if (isUnavaibleIndex < 0) {
          const clonedStartDate = startDate.clone();
          list.push({startDate: clonedStartDate.toDate()});
          startDate = startDate.add(selectedService?.duration, 'minutes');
        } else {
          const prevTurnDuration = moment(turns[isUnavaibleIndex].endDate).diff(
            moment(turns[isUnavaibleIndex].startDate),
            'minutes',
          );
          console.log('prevTurnDuration', prevTurnDuration);
          startDate = startDate.add(prevTurnDuration, 'minutes');
        }
      });
      setTurnList(list);
      setShowTurnModal(true);
    };
    if (selectedService) {
      checkTurnForServiceTime();
    }
  }, [selectedService]);

  const handleServiceSelect = (e: Service) => {
    setSelectedService(e);
    setShowServiceModal(false);
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
          <Heading textAlign="center" color="$textDark500">
            Turnos agendados
          </Heading>
          <Box padding={'$4'}>
            {turns
              .sort(function (left, right) {
                return moment(left.startDate).diff(moment(right.startDate));
              })
              .map(e => {
                return (
                  <TurnCard key={moment(e.startDate).toString()} event={e} />
                );
              })}
            {turns.length === 0 && (
              <>
                <Text textAlign="center" mt={'$10'} color="$textDark500">
                  Aún no has agendado ningún turno para hoy.
                </Text>
                <HStack justifyContent="center">
                  <Image
                    mt={'$10'}
                    maxWidth={'$32'}
                    maxHeight={'$32'}
                    resizeMode="contain"
                    source={require('../../assets/images/schedule-placeholder.png')}
                    alt="agenda-vacia"
                  />
                </HStack>
              </>
            )}
          </Box>
        </ScrollView>
        <HStack
          position="absolute"
          bottom={10}
          width={'100%'}
          justifyContent="center">
          <BaseButton
            title="Agendar"
            background={'$primary500'}
            color={'$white'}
            onPress={() => setShowServiceModal(true)}
            isLoading={false}
            disabled={false}
            hasIcon={true}
            icon={AddIcon}
          />
        </HStack>
      </Box>
      <SelectServiceModal
        show={showServiceModal}
        onSelect={handleServiceSelect}
        onClose={() => setShowServiceModal(false)}
      />
      <SelectTurnModal
        onSelect={handleAddTurn}
        turns={turnList}
        show={showTurnModal}
        onClose={() => setShowTurnModal(false)}
      />
    </>
  );
}
