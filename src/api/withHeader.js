import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

const token= AsyncStorage.getItem('token');

const req=axios.create({
    baseURL:'https://api.sizzle.sadathussain.com/public/api/',
        timeout: 1000,
    headers: {'Authorization': `Bearer ${token}`}
  });
export default req;