import React, {useEffect} from 'react';
import Loader from '../../components/shared/loader';
import {RootState, useAppDispatch, useAppSelector} from '../../store';
import {useGetServicesQuery} from '../../api/servicesApi';
import {addAllServices} from '../../store/features/servicesSlice';
import {Box} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {VStack} from '@gluestack-ui/themed';
import {
  PERMISSIONS,
  check,
  request,
  openSettings,
  RESULTS,
} from 'react-native-permissions';
import {showInfoModal} from '../../store/features/layoutSlice';

import io from 'socket.io-client';
const socket = io('http://192.168.100.3:4000');



export default function Loading() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {user} = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const {data, isLoading} = useGetServicesQuery();

  const requestNotificationPermission = async () => {
    const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    return result;
  };

  const checkNotificationPermission = async () => {
    const result = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    return result;
  };

  useEffect(() => {
    if (data) {
      dispatch(addAllServices(data.services));
    }
  }, [data]);

  useEffect(() => {
    const chechForPermissions = async () =>{

      const hasPermissions = await checkNotificationPermission();
      if (hasPermissions !== RESULTS.GRANTED) {
        dispatch(
          showInfoModal({
            title: '¡Necesitamos permisos para enviarte notificaciones!',
            type: 'info',
            hasCancel: false,
            cancelCb: null,
            hasSubmit: true,
            submitCb: async () => {
              const permissionRequest = await requestNotificationPermission();
              if (permissionRequest !== RESULTS.GRANTED) {
                dispatch(
                  showInfoModal({
                    title:
                      'Ve a configuración y activa las notificaciones para poder continuar',
                    type: 'error',
                    hasCancel: false,
                    cancelCb: null,
                    hasSubmit: true,
                    submitCb: async () => {
                      openSettings();
                    },
                    hideOnAnimationEnd: false,
                    submitData: {
                      text: 'Ir a configuración',
                      background: '$primary500',
                    },
                  }),
                );
              } else {
                dispatch(showInfoModal(null));
                navigation.navigate('BottomsTabs');
              }
            },
            hideOnAnimationEnd: false,
            submitData: {
              text: 'Dar permisos',
              background: '$primary500',
            },
          }),
        );
      } else {
        dispatch(showInfoModal(null));
        navigation.navigate('BottomsTabs');
      }
    }
    chechForPermissions()
  }, []);

  useEffect(()=>{
    socket.emit('log-in', {
      user: {
        _id: user?._id,
      },
    });
  },[])

  return (
    <VStack justifyContent="center" alignItems="center" flex={1}>
      <Loader />
    </VStack>
  );
}
