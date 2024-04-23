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
  VStack,
} from '@gluestack-ui/themed';
import {Event, TurnSelectItem} from '../../types/turns';
import Clock from 'react-live-clock';
import SelectServiceModal from '../../components/selectServiceModal';
import {Service} from '../../types/services';
import SelectTurnModal from '../../components/shared/selectTurnModal';
import TurnCard from '../../components/turnCard';
import BaseButton from '../../components/shared/baseButton';
import {RootState, useAppDispatch, useAppSelector} from '../../store';
import {
  addTurn,
  initTurns,
  resetAllturns,
} from '../../store/features/turnsSlice';
import {
  OverridedEvent,
  useAddTurnMutation,
  useGetTurnsQuery,
} from '../../api/turnsApi';
import {hideInfoModal, showInfoModal} from '../../store/features/layoutSlice';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import PushNotification from 'react-native-push-notification';
import {Dimensions} from 'react-native';
import {DollarSignIcon} from 'lucide-react-native';
import {Icon} from '@gluestack-ui/themed';
import socket from '../../socket';
import {setUser} from '../../store/features/authSlice';
import LottieView from 'lottie-react-native';
import CustomText from '../../components/shared/text';
import CustomHeading from '../../components/shared/heading';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useDerivedValue,
  interpolate,
  withRepeat,
  Easing,
  withDelay,
} from 'react-native-reanimated';
import Header from '../../components/header';

const {width} = Dimensions.get('window');
export default function Schedule() {
  const [businessHoursStart, setBusinessHoursStart] = useState<moment.Moment>(
    moment().set({hour: 9, minute: 0, second: 0}).utc().utcOffset(3, true),
  );
  const [businessHoursEnd, setBusinessHoursEnd] = useState<moment.Moment>(
    moment().set({hour: 20, minute: 0, second: 0}).utc().utcOffset(3, true),
  );
  const [businessIsClosed, setBusinessIsClosed] = useState<boolean>(false);

  console.log('businessHoursStart', businessHoursStart);
  console.log('businessHoursEnd', businessHoursEnd);

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const dispatch = useAppDispatch();
  const {turns} = useAppSelector((state: RootState) => state.turns);
  const {user} = useAppSelector((state: RootState) => state.auth);
  const [restartTime, setRestartTime] = useState<moment.Moment>(
    moment().set({hour: 23, minutes: 59, second: 59}).utc().utcOffset(3, true),
  );

  const {
    data: turnsData,
    refetch: refetchTurns,
    isLoading: isLoadingTurns,
    fulfilledTimeStamp,
    isUninitialized,
  } = useGetTurnsQuery({id: user?._id ?? ''});
  const [addTurnRequest, {isLoading}] = useAddTurnMutation();

  const [showServiceModal, setShowServiceModal] = useState<boolean>(false);
  const [showTurnModal, setShowTurnModal] = useState<boolean>(false);
  const [turnList, setTurnList] = useState<TurnSelectItem[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isSunday, setIsSunday] = useState<boolean>(false);
  const translateY = useSharedValue(-100);
  const titleOpacity = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
  }));
  const animatedTitleStyles = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));
  const handleAddTurn = async (turn: TurnSelectItem) => {
    if (selectedService && user) {
      const handleRequest = async () => {
        return addTurnRequest({
          data: {
            name: selectedService.name,
            type: selectedService._id,
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
          title: `¡Deseas agendar este turno ${moment(turn.startDate)
            .utc()
            .utcOffset(3, true)
            .format('hh:mm')}?`,
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
                  submitCb: () => {
                    dispatch(hideInfoModal());
                    setShowTurnModal(false);
                    refetchTurns();
                  },
                  hideOnAnimationEnd: false,
                  cancelData: null,
                });
              });
          },
          hideOnAnimationEnd: false,
          submitData: {
            text: 'Agendar',
            background: '$green500',
            hasLoader: true,
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

  // useEffect(() => {
  //   const checkTurnForServiceTime = async () => {
  //     if (selectedService) {
  //       const slots = [];
  //       let currentTime = moment().utc().utcOffset(3, true);
  //       console.log("currentTime", currentTime)

  //       while (currentTime.isBefore(businessHoursEnd)) {
  //         const endTime = moment(currentTime).add(
  //           selectedService.duration,
  //           'minutes',
  //         );
  //         const isSlotAvailable = ![...turns].sort(function (left, right) {
  //           return moment(left.startDate).diff(moment(right.startDate));
  //         }).some((slot, slotIndex, slotArray) => {
  //           const hasNextSlot = slotIndex + 1 < slotArray.length;
  //           let nextSlotValidation = false;
  //           if(hasNextSlot){
  //             nextSlotValidation = endTime.clone().isBetween( moment(slotArray[slotIndex + 1].startDate),moment(slotArray[slotIndex + 1].endDate))
  //           }
  //           console.log("curren time", currentTime.clone().isSameOrAfter(slot.startDate))
  //           return (
  //             moment(slot.startDate, 'hh:mm A').isBetween(
  //               currentTime,
  //               endTime,
  //             ) ||
  //             moment(slot.endDate, 'hh:mm A').isBetween(currentTime, endTime) ||
  //             moment(currentTime).isBetween(slot.startDate, slot.endDate) ||
  //             nextSlotValidation
  //           );
  //         });

  //         if (isSlotAvailable) {
  //           slots.push({
  //             startDate: currentTime.toDate(),
  //             endDate: endTime.toDate(),
  //           });
  //         }

  //         currentTime = endTime;
  //       }
  //       setTurnList(slots);
  //       setFirtsAvailableTurnTime(moment(slots[0].startDate))
  //       setShowTurnModal(true);
  //     }
  //   };

  //   if (selectedService) {
  //     checkTurnForServiceTime();
  //   }
  // }, [selectedService]);

  useEffect(() => {
    function removeElementAt(arr: any, index: number) {
      let frontPart = arr.slice(0, index);
      let lastPart = arr.slice(index + 1); // index to end of array
      return [...frontPart, ...lastPart];
    }
    const checkTurnForServiceTime = async () => {
      if (selectedService) {
        const slots = [];
        let turnsList = [...turns.filter(turn => turn.status !== 'CANCELED')];
        let currentTime = moment().utc().utcOffset(3, true);
        if (currentTime.isBefore(businessHoursStart)) {
          // const diff = currentTime.clone().diff(businessHoursStart, 'minutes');
          const diff = businessHoursStart.clone().diff(currentTime, 'minutes');
          currentTime = currentTime.add(diff, 'minutes');
        }

        while (
          currentTime
            .clone()
            .add(selectedService.duration, 'minutes')
            .isBefore(businessHoursEnd)
        ) {
          const endTime = currentTime
            .clone()
            .add(selectedService.duration, 'minutes');
          const isSlotInavailable = [...turnsList]
            .sort(function (left, right) {
              return moment(left.startDate).diff(moment(right.startDate));
            })
            .findIndex((slot, slotIndex, slotArray) => {
              const hasNextSlot = slotIndex + 1 < slotArray.length;
              let nextSlotValidation = false;
              console.log('IS AFTER');
              if (hasNextSlot) {
                nextSlotValidation =
                  endTime
                    .clone()
                    .isBetween(
                      moment(slotArray[slotIndex + 1].startDate),
                      moment(slotArray[slotIndex + 1].endDate),
                    ) ||
                  currentTime
                    .clone()
                    .isBetween(
                      moment(slotArray[slotIndex + 1].startDate),
                      moment(slotArray[slotIndex + 1].endDate),
                    );
              }
              return (
                moment(slot.startDate).isBetween(currentTime, endTime) ||
                moment(slot.endDate).isBetween(currentTime, endTime) ||
                moment(currentTime).isBetween(slot.startDate, slot.endDate) ||
                nextSlotValidation ||
                endTime.isBetween(slot.startDate, slot.endDate)
              );
            });
          if (isSlotInavailable < 0) {
            slots.push({
              startDate: currentTime.toDate(),
              endDate: endTime.toDate(),
            });

            currentTime = endTime;
          } else {
            if (
              moment(turnsList[isSlotInavailable].endDate).isAfter(currentTime)
            ) {
              console.log(
                'diff',
                currentTime,
                turnsList[isSlotInavailable].endDate,
                moment(turnsList[isSlotInavailable].endDate).diff(
                  currentTime,
                  'minutes',
                ),
              );
              currentTime = currentTime
                .clone()
                .add(
                  moment(turnsList[isSlotInavailable].endDate).diff(
                    currentTime,
                    'minutes',
                  ) + 1,
                  'minutes',
                );
            }

            turnsList = removeElementAt(turnsList, isSlotInavailable);
          }
        }

        setTurnList(slots);
        setShowTurnModal(true);
      }
    };

    if (selectedService) {
      checkTurnForServiceTime();
    }
  }, [selectedService]);

  useEffect(() => {
    const interval = setInterval(() => {
      const sunday = moment().get('day') === 0;

      if (sunday && !isSunday) {
        setIsSunday(true);
      } else if (!sunday && !isSunday) {
        setIsSunday(false);
      }

      if (moment().utc().utcOffset(3, true).isAfter(restartTime)) {
        const day = moment().get('date');
        setRestartTime(
          moment()
            .set({date: day + 1, hour: 23, minute: 59, second: 59})
            .utc()
            .utcOffset(3, true),
        );
        setBusinessHoursStart(
          moment()
            .set({date: day + 1, hour: 9, minute: 0})
            .utc()
            .utcOffset(3, true),
        );
        setBusinessHoursEnd(
          moment()
            .set({date: day + 1, hour: 20, minute: 0})
            .utc()
            .utcOffset(3, true),
        );
        if (turns.length > 0) {
          dispatch(resetAllturns());
        }
      }

      if (
        moment().utc().utcOffset(3, true).isAfter(businessHoursEnd) &&
        !businessIsClosed
      ) {
        setBusinessIsClosed(true);
      } else if (
        moment().utc().utcOffset(3, true).isBefore(businessHoursEnd) &&
        businessIsClosed
      ) {
        setBusinessIsClosed(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [restartTime]);

  const handleServiceSelect = (e: Service) => {
    setSelectedService(e);
    setShowServiceModal(false);
  };

  React.useEffect(() => {
    if (turnsData) {
      dispatch(initTurns(turnsData));
    }
  }, [fulfilledTimeStamp]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      if (!isUninitialized) {
        refetchTurns();
      }
    });

    return unsubscribe;
  }, [navigation, isUninitialized]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      console.log('focus', isUninitialized);
    });

    return unsubscribe;
  }, [navigation, isUninitialized]);

  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = () => {
        translateY.value = withTiming(0, {
          duration: 1000,
          easing: Easing.bounce,
        });
        titleOpacity.value = withDelay(
          1000,
          withTiming(1, {
            duration: 1000,
            easing: Easing.bounce,
            // @ts-ignore
          } as Animated.WithTimingConfig),
        );
      };
      unsubscribe();

      return () => {
        translateY.value = -100;
        titleOpacity.value = 0;
      };
    }, []),
  );

  useEffect(() => {
    socket.on('add-turn', ({data}) => {
      console.log('notification');
      dispatch(addTurn(data));
      PushNotification.localNotification({
        /* Android Only Properties */
        channelId: 'channel-id', // (required) channelId, if the channel doesn't exist, notification will not trigger.
        bigText: `Turno agendado para ${moment(data.startDate)
          .utc()
          .utcOffset(3, true)
          .format('hh:mm A')}`, // (optional) default: "message" prop
        vibrate: true, // (optional) default: true
        vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
        groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
        ongoing: false, // (optional) set whether this is an "ongoing" notification
        priority: 'high', // (optional) set notification priority, default: high
        visibility: 'private', // (optional) set notification visibility, default: private
        ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
        title: '¡Nueva notificación!', // (optional)
        smallIcon: 'ic_notification',
        largeIcon: 'ic_launcher',
        // @ts-ignore
        data: {
          path: 'Schedule',
        },

        /* iOS only properties */

        message: 'Tienes un nuevo turno', // (required)
      });
    });

    return () => {
      socket?.off('add-turn');
    };
  }, []);

  useEffect(() => {
    socket.on('status-change', ({status}) => {
      dispatch(setUser({isActive: status}));
      console.log('notification');
      PushNotification.localNotification({
        /* Android Only Properties */
        channelId: 'channel-id', // (required) channelId, if the channel doesn't exist, notification will not trigger.
        bigText: `¡Tu estado ha sido cambiado!`, // (optional) default: "message" prop
        vibrate: true, // (optional) default: true
        vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
        groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
        ongoing: false, // (optional) set whether this is an "ongoing" notification
        priority: 'high', // (optional) set notification priority, default: high
        visibility: 'private', // (optional) set notification visibility, default: private
        ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
        title: '¡Nueva notificación!', // (optional)
        smallIcon: 'ic_notification',
        largeIcon: 'ic_launcher',

        /* iOS only properties */

        message: `Tu estado actual es: ${status ? 'Activo' : 'Inactivo'}`, // (required)
      });
    });

    return () => {
      socket?.off('status-change');
    };
  }, []);

  console.log('translateY', translateY.value);

  return (
    <LinearGradient
      style={{flex: 1}}
      colors={['#fff', '#f1e2ca']}
      start={{x: 0, y: 0.6}}
      end={{x: 0, y: 1}}>
      <Box flex={1} position="relative">
        <Header
          title="Turnos agendados"
          subtitle={moment().format('DD-MM-yyyy')}
          viewGoBack={false}
          viewClock={true}
          width={width}
        />
        <ScrollView flex={1} mt={'$10'}>
          <HStack justifyContent="flex-end">
            <HStack
              py={'$1'}
              px={'$4'}
              borderWidth={2}
              borderRadius={16}
              borderColor="$textDark500"
              alignItems="center"
              mr={'$2'}
              w="auto">
              <Icon as={DollarSignIcon} color={'$textDark500'} />
              <CustomText>
                {(turns
                  .filter((turn: Event) => turn.status === 'COMPLETE')
                  .reduce((acc: number, obj: Event) => acc + obj.price, 0) *
                  (user?.commission ? user?.commission : 0)) /
                  100}
              </CustomText>
            </HStack>
          </HStack>
          <Box padding={'$4'}>
            {turns.filter(turn => turn.status !== 'CANCELED').length > 0 && (
              <CustomText textAlign="center" mt={'$10'} mb={'$4'}>
                Los turnos agendados para el día de hoy serán visibles en tu
                agenda hasta las{' '}
                {restartTime.utc().utcOffset(3, true).format('hh:mm A')}.
              </CustomText>
            )}
            {[...turns.filter(turn => turn.status !== 'CANCELED')]
              .sort(function (left, right) {
                return moment(left.startDate).diff(moment(right.startDate));
              })
              .map(e => {
                console.log('user data', user);
                return (
                  <TurnCard key={moment(e.startDate).toString()} event={e} />
                );
              })}
            {turns.filter(turn => turn.status !== 'CANCELED').length === 0 && (
              <>
                {isSunday && (
                  <CustomText textAlign="center" mt={'$10'}>
                    Hoy es domingo y la barberìa se encuentra cerrada
                  </CustomText>
                )}
                {!isSunday && user?.isActive && !businessIsClosed && (
                  <CustomText textAlign="center" mt={'$10'}>
                    Aún no has agendado ningún turno para hoy
                  </CustomText>
                )}
                {!isSunday && !user?.isActive && (
                  <CustomText textAlign="center" mt={'$10'}>
                    Actualmente te encuentras deshabilitado para agendar turnos.
                  </CustomText>
                )}

                {!isSunday && user?.isActive && !businessIsClosed && (
                  <>
                    <CustomText textAlign="center" mt={'$4'}>
                      Agenda abierta para{' '}
                      <CustomText fontWeight="bold">
                        {moment().format('DD-MM-yyyy')}
                      </CustomText>
                    </CustomText>
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
                {!isSunday && user?.isActive && businessIsClosed && (
                  <>
                    <CustomText textAlign="center" mt={'$4'}>
                      La barbería ha cerrado por hoy
                    </CustomText>
                    <HStack justifyContent="center" mt="$4">
                      <LottieView
                        style={{width: 150, height: 150}}
                        source={require('./../../assets/lottie/waiting.json')}
                        autoPlay
                        loop={true}
                      />
                    </HStack>
                  </>
                )}
              </>
            )}
          </Box>
        </ScrollView>
        {console.log('sunday', isSunday)}
        {!isSunday && user?.isActive && (
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
        )}
      </Box>
      <SelectServiceModal
        show={showServiceModal}
        onSelect={handleServiceSelect}
        onClose={() => setShowServiceModal(false)}
      />
      <SelectTurnModal
        businessHoursEnd={businessHoursEnd}
        onSelect={handleAddTurn}
        turns={turnList}
        show={showTurnModal}
        onClose={() => {
          setShowTurnModal(false);
          setSelectedService(null);
        }}
      />
    </LinearGradient>
  );
}
