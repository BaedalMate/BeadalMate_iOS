import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {WHITE_COLOR} from 'themes/theme';
export type TodayMenuItemProps = {
  text: string;
};
import {STAR_PRIMARY} from 'themes/theme';
import {TextKRBold} from 'themes/text';
import {TagComponent} from './TodayMenuItem';
import {eachMainTagRecruitListI} from 'components/pages/Main';
import {formPrice} from 'components/utils/api/Recruit';
import {useNavigation} from '@react-navigation/native';
import {url} from '../../../../App';
const TodayMenuItemOngoing = ({item}: {item: eachMainTagRecruitListI}) => {
  const navigation = useNavigation();
  const now = new Date();
  const text =
    item?.deadlineDate.split(' ')[0] + 'T' + item?.deadlineDate.split(' ')[1];
  const deadline = new Date(text);
  const time = deadline.getTime() - now.getTime();
  const durationYear = deadline.getFullYear() - now.getFullYear();
  const durationMonth = deadline.getMonth() - now.getMonth();
  const durationDate = deadline.getDate() - now.getDate();
  const durationHour = deadline.getHours() - now.getHours();
  const durationMinutes = deadline.getMinutes() - now.getMinutes();
  const durationSeconds = deadline.getSeconds() - now.getSeconds();
  const timeText =
    durationYear > 0
      ? durationYear + '년'
      : durationMonth > 0
      ? durationMonth + '달'
      : durationDate > 0
      ? durationDate + '일'
      : durationHour > 0
      ? durationHour + '시간'
      : durationMinutes > 0
      ? durationMinutes + '분'
      : '마감 임박';

  // console.log('asdf', url + '/' + item.image);
  // let convertedImg;
  // useEffect(() => {
  //   const getImg = async () => {
  //     const img = await getImages(item.image);
  //     console.log('image', img);
  //     return 'data:image/jpeg;base64,' + arrayBufferToBase64(img);
  //   };
  //   convertedImg = getImg();
  // }, []);
  // console.log(
  //   'data:image/jpeg;base64,' + arrayBufferToBase64(getImages(item.image)),
  // );
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(
          '글 상세 보기' as never,
          {
            id: item.recruitId,
          } as never,
        );
      }}>
      <TagComponent item={item} />

      <View style={styles.imageSliderWrapper}>
        <Image
          source={{
            uri: url + '/images/' + item.image,
          }}
          style={{
            width: 150,
            height: 114,
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
          }}
        />
        <View
          style={{
            width: 150,
            height: 114,
            padding: 12,
            justifyContent: 'space-evenly',
          }}>
          <Text
            style={{fontSize: 16, fontWeight: '700'}}
            numberOfLines={1}
            ellipsizeMode="tail">
            {item.place}
          </Text>

          <TextKRBold style={{textAlignVertical: 'center'}}>
            <Image
              source={STAR_PRIMARY}
              style={{width: 10, height: 10}}></Image>
            {item?.userScore ? Math.round(item?.userScore * 10) / 10 : 0}
          </TextKRBold>
          <TextKRBold style={{fontWeight: '400'}}>
            배달비{' '}
            <TextKRBold style={{fontWeight: 'bold'}}>
              {formPrice(item.shippingFee)}원
            </TextKRBold>
          </TextKRBold>
          <TextKRBold style={{fontWeight: '400'}}>
            최소주문{' '}
            <TextKRBold style={{fontWeight: 'bold'}}>
              {formPrice(item.minPrice)}원
            </TextKRBold>
          </TextKRBold>
          <TextKRBold style={{fontWeight: 'bold'}}>{timeText}</TextKRBold>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageSliderWrapper: {
    width: 300,
    height: 114,
    backgroundColor: WHITE_COLOR,
    borderRadius: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageSliderItemCreateTitle: {
    color: '#FFFFFF',
    fontSize: 55,
    fontWeight: '200',
    lineHeight: 60,
  },
});

export default TodayMenuItemOngoing;
