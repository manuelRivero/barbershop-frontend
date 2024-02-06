import { Text, Image, Heading } from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react'
import Onboarding from 'react-native-onboarding-swiper';

export default function WelcomeOnboarding() {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    return (
        <Onboarding
            onDone={() => navigation.navigate("UserRoutes", { screen: "Schedule" })}
            onSkip={() => navigation.navigate("UserRoutes", { screen: "Schedule" })}
            skipLabel={"Saltar"}
            nextLabel={"Siguiente"}
            bottomBarColor='#f1e2ca'
            pages={[
                {
                    titleStyles: {
                        color: "#000"
                    },
                    backgroundColor: '#f1e2ca',
                    image: <Image w={200} h={200} resizeMode='contain' source={require('../../assets/images/Onboard/logo.png')} />,
                    title: <Heading color="textDark500">Ecuentra a tu barbero</Heading>,
                    subtitle: 'Selecciona a tu barbero de preferencia.',
                },
                {
                    backgroundColor: '#f1e2ca',
                    image: <Image w={200} h={200} resizeMode='contain' source={require('../../assets/images/Onboard/logo.png')} />,
                    title: <Heading color="textDark500">Explora los servicios</Heading>,
                    subtitle: 'Elige el tipo de servicio que deseas.',
                },
                {
                    backgroundColor: '#f1e2ca',
                    image: <Image w={200} h={200} resizeMode='contain' source={require('../../assets/images/Onboard/logo.png')} />,
                    title: <Heading color="textDark500">Agenda tu turno</Heading>,
                    subtitle: 'Escoge el horario para tu turno y listo.',
                },
            ]}
        />
    )
}
