import React from 'react';
import { View, Text, Image } from 'react-native';
import tw from 'twrnc'; 
import icons from '../../constants/icons'; 

function HeaderLogin(props) {
  return (
    <View style={tw `flex flex-col pb-15`}> 
      <Image style={tw`w-60 h-14`} source={icons.logo}/>
      <Text style={tw`text-center text-xl text-gray-500`}>{props.text}</Text>
    </View>
  );
}

export default HeaderLogin;
