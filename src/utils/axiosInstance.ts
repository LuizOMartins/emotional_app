import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const navigation = useNavigation<NavigationProps>();
type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const api = axios.create({
  baseURL: 'http://200.98.81.153:8082',
});

const authApi = axios.create({
  baseURL: 'http://200.98.81.153:8081', // Base URL para login e refresh de token
});

// Adiciona o interceptor para incluir o token em todas as requisições na API principal
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token'); // Recupera o token do AsyncStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Adiciona o token ao header
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para lidar com expiração do token na API principal
api.interceptors.response.use(
  response => response, // Retorna a resposta se estiver correta
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Previne que o mesmo request tente várias vezes

      try {
        // Tenta o refresh do token
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const { data } = await authApi.post('/api/auth/refresh-token', {
          refreshToken,
        });

        // Atualiza o token e o refresh token no AsyncStorage
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('refreshToken', data.refreshToken);

        // Atualiza o cabeçalho da requisição original com o novo token e refaz a requisição
        originalRequest.headers['Authorization'] = `Bearer ${data.token}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Erro ao fazer o refresh do token:', refreshError);
        // Se o refresh falhar, remover tokens e redirecionar para login
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('refreshToken');
        navigation.navigate('Login');
      }
    }

    return Promise.reject(error); // Rejeita o erro original se não for tratado
  }
);

// Serviço de login
export const login = async (email: string, password: string, application: string) => {
  try {
    const response = await authApi.post('/api/auth/login', {
      email,
      password,
      application,
    });

    if (response.status === 200) {
      // Armazena o token e o refreshToken no AsyncStorage
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
    }

    return response;
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
};

export default api;
