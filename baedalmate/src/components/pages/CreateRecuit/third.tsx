import React, {useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {TextKRBold} from 'themes/text';
import {Fonts} from 'assets/Fonts';
import {
  DARK_GRAY_COLOR,
  ERROR_COLOR,
  PRIMARY_COLOR,
  WHITE_COLOR,
} from 'themes/theme';
import BtnCreateFloating from 'components/atoms/Button/BtnCreateFloating';
import BtnTag from 'components/atoms/Button/BtnTag';
import {useForm} from 'react-hook-form';
import {
  DescriptionInput,
  TitleInput,
} from 'components/atoms/CreateRecruit/Input';
import RecruitTag from 'components/atoms/CreateRecruit/Tags';

export interface RecruitItemProps {
  createDate: string;
  deadlineDate: string;
  deliveryFee: number;
  description: string;
  dormitory: string;
  id: number;
  minPeople: number;
  minPrice: number;
  participate: false;
  platform: string;
  thumbnailImage: string;
  title: string;
  userImage: string;
  userScore: number;
  username: string;
}

const CreateRecruit3 = props => {
  const defaultItem = props.route.params.defaultItem;

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm({
    defaultValues: {
      title: defaultItem && defaultItem.title ? defaultItem.title : '',
      description:
        defaultItem && defaultItem.description ? defaultItem.description : '',
      tags: [{tagname: ''}],
    },
  });
  console.log(props.route.params);

  const onSubmit = data => {
    console.log(data);
    console.log(tagList);
    const newTagList = tagList.map((v, i) => {
      return {tagname: v.tagname};
    });

    tagList.length > 0 &&
      props.navigation.navigate('상세 설정4', {
        ...data,
        tags: newTagList,
        ...props.route.params,
      });
  };
  // const [text, setText] = useState('');
  const [newTag, setNewTag] = useState('');
  const [tagList, setTagList] = useState<{tagname: string; id: number}[]>([]);
  useEffect(() => {
    defaultItem && defaultItem.tags && setTagList(defaultItem.tags);
  }, [defaultItem]);

  return (
    <View
      style={{
        backgroundColor: WHITE_COLOR,
      }}>
      <KeyboardAvoidingView
        // style={styles.avoidingView}
        behavior={Platform.select({ios: 'padding'})}
        keyboardVerticalOffset={44}>
        <ScrollView
          style={{
            backgroundColor: WHITE_COLOR,
            marginBottom: 150,
          }}>
          <View style={{}}>
            <View
              style={{
                padding: 15,
                display: 'flex',
              }}>
              <TextKRBold style={styles.Title}>모집글 작성하기</TextKRBold>
            </View>
            <View
              style={{
                padding: 15,
                backgroundColor: '#F7F8FA',
                borderBottomWidth: 5,
                borderBottomColor: WHITE_COLOR,
              }}>
              <View style={{flexDirection: 'row'}}>
                <TextKRBold style={styles.Label}>모집글 제목</TextKRBold>
                {errors.title && (
                  <Text style={styles.Validation}>제목을 적어주세요</Text>
                )}
              </View>

              <TitleInput
                error={errors}
                name={'title'}
                control={control}
                rules={{required: true}}
              />
            </View>
            <View
              style={{
                padding: 15,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#F7F8FA',
                borderBottomWidth: 5,
                borderBottomColor: WHITE_COLOR,
              }}>
              <View style={{flexDirection: 'row'}}>
                <TextKRBold style={styles.Label}>모집글 설명</TextKRBold>
                {errors.title && (
                  <Text style={styles.Validation}>설명을 적어주세요</Text>
                )}
              </View>
              <DescriptionInput
                error={errors}
                name={'description'}
                control={control}
                rules={{required: true}}
              />
            </View>
            <View
              style={{
                padding: 15,
                display: 'flex',
                backgroundColor: '#F7F8FA',
                borderBottomWidth: 5,
                borderBottomColor: WHITE_COLOR,
              }}>
              <TextKRBold style={styles.Label}>태그쓰기</TextKRBold>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <TextInput
                  style={{
                    backgroundColor: WHITE_COLOR,
                    width: '70%',
                    height: 44,
                    borderRadius: 10,
                    padding: 15,
                  }}
                  maxLength={8}
                  value={newTag}
                  onChangeText={text => {
                    setNewTag(text);
                  }}
                  placeholder="태그를 입력해주세요"></TextInput>
                <BtnTag
                  text={'태그입력'}
                  onPress={() => {
                    if (newTag !== '') {
                      if (tagList.length < 4) {
                        if (newTag.length <= 8) {
                          setTagList([
                            ...tagList,
                            {tagname: newTag, id: tagList.length},
                          ]);
                          setNewTag('');
                        }
                      }
                    }
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginVertical: 15,
                  flexWrap: 'wrap',
                }}>
                {tagList.map((data, index) => (
                  <RecruitTag
                    tagList={tagList}
                    setTagList={setTagList}
                    text={data.tagname}
                    id={index}
                    key={index}
                  />
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
        <View
          style={{
            marginHorizontal: 15,
          }}>
          <View>
            <View></View>
            <BtnCreateFloating
              onPress={handleSubmit(onSubmit)}
              text={'다음으로'}
              id={3}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  Validation: {
    fontFamily: Fonts.Ko,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 24,
    textAlignVertical: 'center',
    color: ERROR_COLOR,
    marginLeft: 20,
  },
  margin: {
    marginLeft: 10,
  },
  Title: {
    fontFamily: Fonts.Ko,
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 22,
    textAlignVertical: 'center',
    color: PRIMARY_COLOR,
  },
  TitleInput: {
    fontFamily: Fonts.Ko,
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 22,
    textAlignVertical: 'center',
  },
  Label: {
    fontFamily: Fonts.Ko,
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 19,
    marginBottom: 15,
    textAlignVertical: 'center',
  },
  Description: {
    fontFamily: Fonts.Ko,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 24,
    alignItems: 'center',
    textAlignVertical: 'center',
    color: DARK_GRAY_COLOR,
  },
  LengthCnt: {
    color: PRIMARY_COLOR,
  },
});

export default CreateRecruit3;
