import React, {useEffect} from 'react';
import Loader from '../../components/shared/loader';
import {RootState, useAppDispatch, useAppSelector} from '../../store';
import {useGetServicesQuery} from '../../api/servicesApi';
import {addAllServices} from '../../store/features/servicesSlice';
import {Box} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';

export default function Loading() {
  const navigation = useNavigation();
  const {user} = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const {data, isLoading} = useGetServicesQuery();

  useEffect(() => {
    if (data) {
      dispatch(addAllServices(data.services));
      if(user)
      navigation.navigate('');
    }
  }, [data]);
  return (
    <Box flex={1}>
      <Loader />
    </Box>
  );
}
