import{View, Text, TouchableOpacity } from 'react-native';
import { styles } from './button.style';

export function Button(props) {
 return (
   <TouchableOpacity style={styles.btn} onPress={props.onPress}>
        <Text style={styles.text}>{props.text}</Text>
    </TouchableOpacity>
  );
}