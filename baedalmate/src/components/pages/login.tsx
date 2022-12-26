import {NavigationProp} from '@react-navigation/native';

import {
  KakaoOAuthToken,
  KakaoProfile,
  login,
  logout,
  unlink,
  getProfile as getKakaoProfile,
} from '@react-native-seoul/kakao-login';

import React, {useEffect, useState} from 'react';
import {Image, View} from 'react-native';

import BtnKakaoLoginWrapper from '../atoms/Button/BtnKakaoLogin';
import {TextKRBold} from 'themes/text';
import axios from 'axios';
import {url} from '../../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LOGO, LOGO_WITH_TEXT} from 'themes/theme';
import BtnAppleAuth from 'components/atoms/Button/BtnAppleAuth';
import appleAuth, {
  AppleCredentialState,
  AppleError,
  AppleRequestOperation,
  AppleRequestScope,
} from '@invertase/react-native-apple-authentication';

const loginURL = url + '/login/oauth2/kakao';

interface LoginProps {
  navigation: NavigationProp<any, any>;
}

function Login({navigation}: LoginProps): React.ReactElement {
  const [result, setResult] = useState<string>('');
  const [kakaoAccessToken, setKakaoAccessToken] = useState<string>('');
  // const [JWTRefreshToken, setJWTRefreshToken] = useState([]);

  // accessToken 갱신 시마다 서버에 accessToken 보내고 JWT token 받아옴
  useEffect(() => {
    getJWTTokens_server();
    getProfile();
  }, [kakaoAccessToken]);

  // 로그인
  const signInWithKakao = async (): Promise<void> => {
    try {
      const token: KakaoOAuthToken = await login();
      setKakaoAccessToken(token.accessToken);
      setResult(JSON.stringify(token));

      // JWTtoken 받아온 후 메인 페이지 이동
      const JWTTokens = await getJWTTokens_localdb();
      // const values = await AsyncStorage.multiGet([
      //   '@BaedalMate_JWTAccessToken',
      //   '@BaedalMate_JWTRefreshToken',
      // ]);
      if (JWTTokens[0][1]) {
        console.log(JWTTokens);
        console.log(JWTTokens[0][1]);
        navigation.navigate('BoardStackComponent');
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };

  //로그아웃
  const signOutWithKakao = async (): Promise<void> => {
    const message = await logout();

    setResult(message);
  };

  // 프로필 가져오기 (에러 해결 필요)
  const getProfile = async (): Promise<void> => {
    try {
      const profile: any = await getKakaoProfile();
      console.log(JSON.stringify(profile.profileImageUrl));
      setResult(JSON.stringify(profile));
      AsyncStorage.setItem('@BaedalMate_ProfileImg', profile.profileImageUrl);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('signOut error', err);
    }
  };

  // 카카오 로그인 연결 끊기
  const unlinkKakao = async (): Promise<void> => {
    const message = await unlink();
    setResult(message);
  };

  // 서버에 accessToken을 포함한 request를 보내고 JWT token을 받아옴
  const getJWTTokens_server = async () => {
    const kakaoRequest = {
      kakaoAccessToken: kakaoAccessToken,
    };

    try {
      // console.log(kakaoAccessToken);
      const response = await axios.post(loginURL, kakaoRequest, {
        headers: {
          'Content-Type': `application/json`,
        },
      });
      const tokens = await response.data;
      const token = tokens.accessToken;
      const refToken = tokens.refreshToken;

      AsyncStorage.multiSet([
        ['@BaedalMate_JWTAccessToken', token],
        ['@BaedalMate_JWTRefreshToken', refToken],
      ]);
      return response;
    } catch (error) {
      console.log(error);

      return false;
    }
  };

  //AsyncStorage에 JWT Access/Refresh Token 저장
  const getJWTTokens_localdb = async () => {
    try {
      const values = await AsyncStorage.multiGet([
        '@BaedalMate_JWTAccessToken',
        '@BaedalMate_JWTRefreshToken',
      ]);

      console.log(values);
      return values;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return (
    <View
      style={{
        // marginTop: 50,
        marginHorizontal: '5%',
        alignItems: 'center',
        height: '100%',
        justifyContent: 'center',
      }}>
      {/* <View
        style={{
          width: 200,
          height: 200,
          backgroundColor: 'gray',
          justifyContent: 'center',
        }}> */}
      <Image
        source={LOGO_WITH_TEXT}
        style={{
          marginBottom: 90,
          width: 400,
          height: 400,
          justifyContent: 'center',
        }}
      />
      {/* </View> */}
      <BtnKakaoLoginWrapper onPress={() => signInWithKakao()} />
      <BtnAppleAuth />
    </View>
  );
}

export default Login;
