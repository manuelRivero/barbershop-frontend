import React, {useEffect, useRef, useState} from 'react';
import {
  ScrollView,
  AddIcon,
  Box,
  Heading,
  HStack,
  Image,
  Text,
  FlatList,
  Pressable,
} from '@gluestack-ui/themed';
import Clock from 'react-live-clock';
import {RootState, useAppDispatch, useAppSelector} from '../../store';
import {Service} from '../../types/services';
import {ListRenderItemInfo} from 'react-native';
import {addAllServices} from '../../store/features/servicesSlice';
import {useGetBarberServicesQuery} from '../../api/servicesApi';
import Loader from '../../components/shared/loader';
import {useAddTurnMutation, useGetTurnsQuery} from '../../api/turnsApi';
import {Event, TurnSelectItem} from '../../types/turns';
import {
  addTurn,
  initTurns,
  resetAllturns,
} from '../../store/features/turnsSlice';
import SelectTurnModal from '../../components/selectTurnModal';
import {hideInfoModal, showInfoModal} from '../../store/features/layoutSlice';
import UserServiceCard from '../../components/userServiceCard';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

import moment from 'moment-timezone';
import { getDateByTimeZone } from '../../helpers';

moment.tz.setDefault(moment.tz.guess());

const hours = [
  9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3,
];
const businessHoursStart = moment().set({hour: 9, minute: 0, second: 0});

export default function UserServiceSelection({route}: any) {
  const businessHoursEnd = moment().set({hour: 23, minute: 0, second: 0}).utc().utcOffset(3, true);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {id} = route.params;
  const timeRef = useRef<number | null>(null);

  const dispatch = useAppDispatch();
  const {services, showCreateServiceModal} = useAppSelector(
    (state: RootState) => state.services,
  );
  const {turns} = useAppSelector((state: RootState) => state.turns);
  const {user} = useAppSelector((state: RootState) => state.auth);
  const {socket} = useAppSelector((state: RootState) => state.layout);

  const {data, isLoading, refetch, fulfilledTimeStamp} =
    useGetBarberServicesQuery({id});
  const {
    data: turnsData,
    refetch: refetchTurns,
    isLoading: isLoadingTurns,
  } = useGetTurnsQuery({id});
  const [addTurnRequest, {isLoading: isLoadingAddTurn}] = useAddTurnMutation();

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showTurnModal, setShowTurnModal] = useState<boolean>(false);
  const [turnList, setTurnList] = useState<TurnSelectItem[]>([]);

  useEffect(() => {
    if (data) {
      dispatch(addAllServices(data.services));
    }
  }, [data]);

  useEffect(() => {
    const checkTurnForServiceTime = async () => {
      if (selectedService) {
        const slots = [];
        let currentTime = moment().utc().utcOffset(3, true);
        console.log("currentTime", currentTime)

        while (currentTime.isBefore(businessHoursEnd)) {
          const endTime = moment(currentTime).add(
            selectedService.duration,
            'minutes',
          );
          const isSlotAvailable = ![...turns].sort(function (left, right) {
            return moment(left.startDate).diff(moment(right.startDate));
          }).some((slot, slotIndex, slotArray) => {
            const hasNextSlot = slotIndex + 1 < slotArray.length;
            let nextSlotValidation = false;
            if(hasNextSlot){
              nextSlotValidation = endTime.clone().isBetween( moment(slotArray[slotIndex + 1].startDate),moment(slotArray[slotIndex + 1].endDate))
            }
            console.log("curren time", currentTime.clone().isSameOrAfter(slot.startDate))
            return (
              moment(slot.startDate, 'hh:mm A').isBetween(
                currentTime,
                endTime,
              ) ||
              moment(slot.endDate, 'hh:mm A').isBetween(currentTime, endTime) ||
              moment(currentTime).isBetween(slot.startDate, slot.endDate) ||
              nextSlotValidation 
            );
          });

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

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      refetch();
      refetchTurns();
    });

    return unsubscribe;
  }, [navigation]);

  const handleAddTurn = async (turn: TurnSelectItem) => {
    if (selectedService && user) {
      const handleRequest = async () => {
        return addTurnRequest({
          data: {
            name: selectedService.name,
            barber: user?.role === 'barber' ? user?._id : id,
            user: user?.role === 'user' ? user?._id : null,
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
          submitCb: async () => {
            try {
              const res = await handleRequest();
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
              navigation.navigate('UserWaitingRoom', {turnId: res.turn._id});
              socket?.emit('set-turn', {
                barber: {
                  _id: id,
                },
                turnData: res.turn,
              });
            } catch (error) {
              dispatch(
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
                }),
              );
            }
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
  const handleServiceSelect = (e: Service) => {
    setSelectedService(e);
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
    const unsubscribe = navigation.addListener('focus', async () => {
      console.log('focus');
      refetch();
    });

    return unsubscribe;
  }, [navigation]);
  React.useEffect(() => {
    if (turnsData) {
      console.log('turns data', turnsData.turns);
      dispatch(initTurns(turnsData.turns));
    }
  }, [fulfilledTimeStamp]);

  if (isLoading || isLoadingTurns) {
    return <Loader />;
  }
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
            onChange={e => (timeRef.current = e)}
          />
        </HStack>

        <ScrollView flex={1}>
          <Heading textAlign="center" color="$textDark500">
            Servicios disponibles
          </Heading>
          <FlatList
            contentContainerStyle={{paddingBottom: 50}}
            p="$4"
            data={services}
            renderItem={(props: ListRenderItemInfo<any>) => {
              const {item} = props;
              return (
                <Pressable onPress={() => handleServiceSelect(item)}>
                  <UserServiceCard data={item} />
                </Pressable>
              );
            }}
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
          />
        </ScrollView>
        <SelectTurnModal
          onSelect={handleAddTurn}
          turns={turnList}
          show={showTurnModal}
          onClose={() => {
            setShowTurnModal(false);
            setSelectedService(null);
          }}
        />
      </Box>
    </>
  );
}
