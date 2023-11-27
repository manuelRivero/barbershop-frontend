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
import {
  addTurn,
  initTurns,
  resetAllturns,
} from '../../store/features/turnsSlice';
import {useAddTurnMutation, useGetTurnsQuery} from '../../api/turnsApi';
import {showInfoModal} from '../../store/features/layoutSlice';
import {useNavigation} from '@react-navigation/native';
import UserTurnCard from '../../components/userTurnCard';

import io from 'socket.io-client';

const socket = io('http://192.168.100.3:4000');

const businessHoursEnd = moment().set({hour: 20, minute: 0, second: 0});

export default function UserSchedule({route}: any) {
  const navigation = useNavigation();
  const {id} = route.params;
  const dispatch = useAppDispatch();
  const {turns} = useAppSelector((state: RootState) => state.turns);
  const {user} = useAppSelector((state: RootState) => state.auth);
  const {data: turnsData, refetch} = useGetTurnsQuery({id});
  const [addTurnRequest, {isLoading}] = useAddTurnMutation();

  const [showServiceModal, setShowServiceModal] = useState<boolean>(false);

  const [showTurnModal, setShowTurnModal] = useState<boolean>(false);

  const [turnList, setTurnList] = useState<TurnSelectItem[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const handleAddTurn = async (turn: TurnSelectItem) => {
    if (selectedService && user) {
      const handleRequest = async () => {
        return addTurnRequest({
          data: {
            name: selectedService.name,
            barber: id,
            status: 'INCOMPLETE',
            price: selectedService.price,
            user: user?._id,
            startDate: moment(turn.startDate).toISOString(),
            endDate: moment(turn.startDate)
              .add(selectedService.duration, 'minutes')
              .toISOString(),
          },
        }).unwrap();
      };

      dispatch(
        showInfoModal({
          title: `¡Deseas agendar este turno ${moment(turn.startDate).format(
            'hh:mm',
          )}?`,
          type: 'info',
          hasCancel: true,
          cancelCb: () => {},
          hasSubmit: true,
          submitCb: () => {
            handleRequest().then(res => {
              dispatch(
                showInfoModal({
                  title: '¡Turno agendado!',
                  type: 'success',
                  hasCancel: false,
                  cancelCb: null,
                  hasSubmit: false,
                  submitCb: null,
                  hideOnAnimationEnd: true,
                  submitData: null,
                  cancelData: null,
                }),
              );
              dispatch(addTurn(res.turn));
              setSelectedService(null);
              setShowTurnModal(false);
              socket.emit('set-turn', {
                barber: {
                  _id: id,
                },
                turnData: res.turn,
              });
             
            });
          },
          hideOnAnimationEnd: false,
          submitData: {
            text: 'Agendar',
            background: '$green500',
          },
          cancelData: {
            text: 'Cancelar',
            background: '$blueGray200',
          },
        }),
      );
    }
  };

  useEffect(() => {
    const checkTurnForServiceTime = async () => {
      if (selectedService) {
        const slots = [];
        let currentTime = moment().utc().utcOffset(3, true);

        while (currentTime.isBefore(businessHoursEnd)) {
          const endTime = moment(currentTime).add(
            selectedService.duration,
            'minutes',
          );
          const isSlotAvailable = ![...turns].some(
            slot =>
              moment(slot.startDate, 'hh:mm A').isBetween(
                currentTime,
                endTime,
              ) ||
              moment(slot.endDate, 'hh:mm A').isBetween(currentTime, endTime) ||
              moment(currentTime).isBetween(slot.startDate, slot.endDate),
          );

          if (isSlotAvailable) {
            slots.push({
              startDate: currentTime.toDate(),
              endDate: endTime.toDate(),
            });
          }

          currentTime = endTime;
        }
        setTurnList(slots);
        setShowTurnModal(true);
      }
    };

    if (selectedService) {
      checkTurnForServiceTime();
    }
  }, [selectedService]);

  const handleServiceSelect = (e: Service) => {
    setSelectedService(e);
    setShowServiceModal(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (moment().isAfter(moment().set({hour: 23, minutes: 0}))) {
        dispatch(resetAllturns());
      }

    }, 1000);

   

   

    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      console.log('focus');
      refetch();
    });

    return unsubscribe;
  }, [navigation]);
  React.useEffect(() => {
    if (turnsData) {
      dispatch(initTurns(turnsData.turns));
    }
    console.log('turns data', turnsData);
  }, [turnsData]);

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
            {turns.length > 0 && (
              <Text color="$textDark500" textAlign="center" mb={'$4'}>
                Presiona agendar y selecciona un servicio
              </Text>
            )}
            {[...turns]
              .sort(function (left, right) {
                console.log('left', left, 'right', right);
                return moment(left.startDate).diff(moment(right.startDate));
              })
              .map(e => {
                return (
                  <UserTurnCard
                    key={moment(e.startDate).toString()}
                    event={e}
                  />
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
