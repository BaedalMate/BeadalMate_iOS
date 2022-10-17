import Slider from 'components/atoms/Main/Slider';
import {mainTagRecruitListI} from 'components/pages/Main';
import React from 'react';

import {View} from 'react-native';
import {PRIMARY_COLOR} from 'themes/theme';
import Header from '../../atoms/Header/Header';
import UserInfoTitle from '../../atoms/Main/UserInfoTitle';

interface UserDataProps {
  dormitory: string;
  nickname: string;
  profileImage: string;
  mainTagRecruitList: mainTagRecruitListI;
  setDormitory: Function;
}

const TodayMenu: React.FunctionComponent<UserDataProps> = ({
  dormitory,
  nickname,
  profileImage,
  mainTagRecruitList,
  setDormitory,
}) => {
  return (
    <View
      style={{
        backgroundColor: PRIMARY_COLOR,
        width: '100%',
        height: 387,
        paddingHorizontal: '5%',
      }}>
      <Header />
      <UserInfoTitle
        userName={nickname}
        userAddress={dormitory}
        setDormitory={setDormitory}
      />

      <Slider mainTagRecruitList={mainTagRecruitList} />
    </View>
  );
};

export default TodayMenu;
