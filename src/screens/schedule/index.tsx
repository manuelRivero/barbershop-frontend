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
import {hideInfoModal, showInfoModal} from '../../store/features/layoutSlice';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

import PushNotification from 'react-native-push-notification';

const hours = [
  9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3,
];

const businessHoursStart = moment().set({hour: 9, minute: 0, second: 0});
const businessHoursEnd = moment().set({hour: 23, minute: 0, second: 0});

export default function Schedule() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const dispatch = useAppDispatch();
  const {turns} = useAppSelector((state: RootState) => state.turns);
  const {user} = useAppSelector((state: RootState) => state.auth);
  const {socket} = useAppSelector((state: RootState) => state.layout);

  const {
    data: turnsData,
    refetch: refetchTurns,
    isLoading: isLoadingTurns,
    fulfilledTimeStamp,
  } = useGetTurnsQuery({id: user?._id ?? ''});

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
            barber: user?._id,
            user: null,
            status: 'INCOMPLETE',
            price: selectedService.price,
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
            handleRequest()
              .then(res => {
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
                ),
                  dispatch(addTurn(res.turn));
                setSelectedService(null);
                setShowTurnModal(false);
              })
              .catch(err => {
                showInfoModal({
                  title: '¡No se ha podido agendar tu turno!',
                  type: 'error',
                  hasCancel: false,
                  cancelCb: null,
                  hasSubmit: true,
                  submitData: {
                    text: 'Intentar nuevamente',
                    background: '$primary500',
                  },
                  submitCb: () => {dispatch(hideInfoModal()); setShowTurnModal(false); refetchTurns()},
                  hideOnAnimationEnd: false,
                  cancelData: null,
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

    // try {
    //   return
    //   if (response.data.ok === false) {
    //     throw new Error();
    //   } else {
    //
    //   }
    // } catch (error) {
    //   console.log('error al guardar el turno', error);
    // }
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
      if (
        moment()
          .utc()
          .utcOffset(3, true)
          .isAfter(
            moment().utc().utcOffset(3, true).set({hour: 23, minutes: 0}),
          )
      ) {
        if (turns.length > 0) {
          dispatch(resetAllturns());
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    if (turnsData) {
      console.log('turns data', turnsData.turns);
      dispatch(initTurns(turnsData.turns));
    }
  }, [fulfilledTimeStamp]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      console.log('focus');
      refetchTurns();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    socket?.on('add-turn', ({data}) => {
      dispatch(addTurn(data));
      PushNotification.localNotification({
        /* Android Only Properties */
        channelId: 'channel-id', // (required) channelId, if the channel doesn't exist, notification will not trigger.
        bigText: `Turno agendado para ${moment(data.startDate).format(
          'hh:mm',
        )}`, // (optional) default: "message" prop
        vibrate: true, // (optional) default: true
        vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
        groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
        ongoing: false, // (optional) set whether this is an "ongoing" notification
        priority: 'high', // (optional) set notification priority, default: high
        visibility: 'private', // (optional) set notification visibility, default: private
        ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
        title: '¡Nueva notificación!', // (optional)

        /* iOS only properties */

        message: 'Tienes un nuevo turno', // (required)
        repeatType: 'minute', // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
      });
    });

    return () => {
      socket?.off('add-turn');
    };
  }, []);

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
                Los turnos agendados para el día de hoy serán visibles en tu
                agenda hasta las 11pm.
              </Text>
            )}
            {[...turns]
              .sort(function (left, right) {
                console.log('left', left, 'right', right);
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
        onClose={() => {
          setShowTurnModal(false);
          setSelectedService(null);
        }}
      />
    </>
  );
}
