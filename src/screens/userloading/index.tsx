import React, { useEffect } from 'react';
import Loader from '../../components/shared/loader';
import { RootState, useAppDispatch, useAppSelector } from '../../store';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  PERMISSIONS,
  check,
  request,
  openSettings,
  RESULTS,
} from 'react-native-permissions';
import { showInfoModal } from '../../store/features/layoutSlice';
import { Platform } from 'react-native';
import { useGetActiveTurnQuery } from '../../api/turnsApi';
import { resetUserTurn, setUserTurn } from '../../store/features/turnsSlice';

export default function UserLoading() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dispatch = useAppDispatch();



  const { data, isLoading, refetch, fulfilledTimeStamp } = useGetActiveTurnQuery()
  const requestNotificationPermission = async () => {
    const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    return result;
  };

  const checkNotificationPermission = async () => {
    const result = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    return result;
  };

  useEffect(() => { 
    if(data && data.length > 0){
      dispatch(setUserTurn({...data[0]}))
    } else {
      dispatch(resetUserTurn())
    }
  }, [fulfilledTimeStamp]);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      refetch();
    });

    return unsubscribe;
  }, [navigation]);


  useEffect(() => {
    const chechForPermissions = async () => {
      const platform = Platform.Version;
      if (parseInt(`${platform}`) >= 33) {
        const hasPermissions = await checkNotificationPermission();
        if (hasPermissions !== RESULTS.GRANTED) {
          dispatch(
            showInfoModal({
              title: '¡Necesitamos permisos para enviarte notificaciones! versión de android :' + platform,
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
                  if (!isLoading) {
                    navigation.navigate('WelcomeOnboarding');
                  }
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
          if (!isLoading) {
            navigation.navigate('WelcomeOnboarding');
          }
        }
      } else {
        dispatch(showInfoModal(null));
        if (!isLoading) {
          navigation.navigate('WelcomeOnboarding');
        }
      }
    };
    chechForPermissions();
  }, [isLoading]);

  return (
    <Loader />
  );
}
