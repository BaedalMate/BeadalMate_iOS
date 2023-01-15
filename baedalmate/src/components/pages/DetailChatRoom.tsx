import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  MAX_USERNAME_LIMIT,
  // LiveMyMessage,
  // LiveOpponentMessage,
  MyMessage,
  OpponentMessage,
} from 'components/molecules/Chat/Message';
import {url} from '../../../App';
import {getJWTToken} from 'components/utils/api/Recruit';
import axios from 'axios';

import ChatHeader from 'components/atoms/Header/ChatHeader';
import {
  BLOCK_ICON,
  DARK_GRAY_COLOR,
  ERROR_COLOR,
  LINE_GRAY_COLOR,
  PRIMARY_COLOR,
  REPORT_ICON,
  SEND_GRAY_FILLED_ICON,
  WHITE_COLOR,
} from 'themes/theme';
import ChatDate from 'components/atoms/Chat/ChatDate';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Text} from 'react-native-paper';
import {MessageTextInput} from 'components/atoms/CreateRecruit/Input';
import {useForm} from 'react-hook-form';
import {
  eachDetailChatRoomI,
  eachChatRoomURL,
  chatRecruitURL,
  recruitParticipantsI,
  participantI,
} from 'components/utils/api/Chat';
import SockJS from 'sockjs-client';
import {Stomp} from '@stomp/stompjs';
import {TextKRBold, TextKRReg} from 'themes/text';
import {Fonts} from 'assets/Fonts';
import BtnVerticalOrange from 'components/atoms/Button/BtnVerticalOrange';
import {MemberList} from 'components/atoms/Chat/MemberListItem';
import {getReviewParticipantsAPI} from 'components/utils/api/Review';
import Modal from 'react-native-modal/dist/modal';
import {UsePopup} from 'components/utils/usePopup';

export interface sendI {
  senderId: number;
  roomId: number;
  message: string;
}
export interface recvI {
  senderId: number;
  sender: string;
  senderImage: string;
  roomId: number;
  message: string;
}

export interface messageProps {
  // type: string;
  sender: string;
  message: string;
}
let ws = Stomp.over(function () {
  return new SockJS(url + '/ws/chat');
});
// ws.debug = text => console.log(text);

// Object.assign(global, {WebSocket: require('websocket').w3cwebsocket});

// export const MemberList = () => {
//   return (
//     <View
//       style={{
//         justifyContent: 'center',
//         alignItems: 'center',
//         width: '20%',
//         paddingBottom: 15,
//       }}>
//       <Image
//         source={{
//           uri: 'https://k.kakaocdn.net/dn/dpk9l1/btqmGhA2lKL/Oz0wDuJn1YV2DIn92f6DVK/img_640x640.jpg',
//         }}
//         style={{
//           width: 45,
//           height: 45,
//           backgroundColor: '#ffffff',
//           borderRadius: 45 / 2,
//           marginBottom: 6,
//         }}
//       />
//       <View>
//         <Text>김예빈</Text>
//       </View>
//     </View>
//   );
// };

export const DetailChatRoom = props => {
  ws.configure({});
  const [recv, setRecv] = useState<recvI>();
  const [messageText, setMessageText] = useState<string>();
  const [detailChat, setDetailChat] = useState<eachDetailChatRoomI>();
  const [participantsInfo, setParticipantsInfo] =
    useState<recruitParticipantsI>();
  const getEachChatRoom = async () => {
    try {
      const JWTAccessToken = await getJWTToken();
      const chatRooms = await axios
        .get(eachChatRoomURL + props.route.params.id, {
          headers: {
            Authorization: 'Bearer ' + JWTAccessToken,
          },
        })
        .then(function (response) {
          if (response.status === 200) {
            setDetailChat(response.data);
            return response.data.recruitList;
          }
          return false;
        })
        .catch(function (error) {
          console.log(error);
          return false;
        });
      return chatRooms;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  const getParticipants = async id => {
    try {
      const JWTAccessToken = await getJWTToken();
      const result = await axios.get(chatRecruitURL + `${id}/participants`, {
        headers: {
          Authorization: 'Bearer ' + JWTAccessToken,
        },
      });
      if (result) {
        if (result.status === 200) {
          setParticipantsInfo(result.data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [userId, setUserId] = useState('');
  // const [myNickname, setMyNickname] = useState('');
  const [JWTAccessToken, setJWTAccessToken] = useState('');
  const getMyInfo = async () => {
    const JWTAccessToken = await getJWTToken();
    setJWTAccessToken(JWTAccessToken);
    // const myNickname = await AsyncStorage.getItem('@BaedalMate_UserName');
    const userId = await AsyncStorage.getItem('@BaedalMate_UserId');
    // myNickname !== null && setMyNickname(myNickname);
    userId !== null && setUserId(userId);
  };

  // console.log('----------------------------------\n', userId, detailChat);
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: {errors},
  } = useForm({
    defaultValues: {
      message: '',
    },
  });

  const [messages, setMessages] = useState<messageProps[]>([]);

  // const findRoom = () => {
  //   const roomData: any = axios
  //     .get(url + '/api/v1/room/' + props.route.params.id)
  //     .then(response => {
  //       // console.log(response.data);
  //       setMessages(response.data.messages);
  //     });
  // };
  const sendMessage = messageText => {
    ws.send(
      '/app/chat/message',
      {},
      JSON.stringify({
        roomId: props.route.params.id,
        senderId: userId,
        message: messageText,
      }),
    );
    addMessages(messageText);
    // setMessageText('');
    // setValue('message', '');
  };
  const recvMessage = ({recv}: {recv: recvI}) => {
    console.log({recv});
    recv && messages
      ? setMessages([
          ...messages,
          {
            sender: recv.sender,
            message: recv.message,
          },
        ])
      : recv &&
        setMessages([
          {
            sender: recv.sender,
            message: recv.message,
          },
        ]);
  };

  let reconnect = 0;
  function connect() {
    // pub/sub event
    ws.connect(
      {},
      function (frame) {
        ws.subscribe(
          '/topic/chat/room/' + props.route.params.id,
          function (message) {
            const recv = JSON.parse(message.body);
            // vm.recvMessage(recv);
            // console.log(recv);

            recvMessage(recv);
            setRecv(recv);
          },
        );
      },
      function (error) {
        if (reconnect++ <= 5) {
          setTimeout(function () {
            console.log('connection reconnect');
            // sock = new SockJS(url + '/ws/chat');
            ws = Stomp.over(function () {
              return new SockJS(url + '/ws/chat');
            });
            connect();
          }, 10 * 1000);
        }
      },
    );
  }

  // const onConnected = () => {
  //   console.log('onConnected');
  //   ws.subscribe(
  //     '/topic/chat/room/' + props.route.params.id,
  //     function (message) {
  //       const recv = JSON.parse(message.body);
  //       // vm.recvMessage(recv);
  //       recvMessage(recv);
  //       // setRecv(recv);
  //       console.log(recv);
  //     },
  //   );
  //   ws.send(
  //     '/app/chat/message',
  //     {},
  //     JSON.stringify({
  //       roomId: props.route.params.id,
  //       senderId: userId,
  //       message: messageText,
  //     }),
  //   );
  // };

  const MemberListModal = props => {
    return (
      <View style={{}}>
        <Modal
          isVisible={modal}
          style={{
            width: '100%',
            height: '100%',
            flex: 1,
            margin: 0,
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}>
          {props.children}

          <View
            style={{
              flexDirection: 'column',
              width: '100%',
              paddingHorizontal: 15,
              position: 'relative',
              bottom: 0,
              backgroundColor: WHITE_COLOR,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              paddingVertical: 43,
            }}>
            <View
              style={{
                marginBottom: 22,
              }}>
              <TextKRBold
                style={{
                  fontSize: 18,
                  lineHeight: 22,
                  color: PRIMARY_COLOR,
                }}>
                현재 참여자
              </TextKRBold>
            </View>
            <View
              style={{
                paddingBottom: 30,
                marginBottom: 10,
              }}>
              <View
                style={{
                  flexDirection: 'column',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-start',
                  }}>
                  {participantsInfo?.participants.map((v, i) => (
                    <MemberList
                      item={v}
                      key={v.userId}
                      handleModal={handleModal}
                      handleEachUserModal={handleEachUserModal}
                      setSelectedUser={setSelectedUser}
                    />
                  ))}
                </View>
              </View>
            </View>

            <BtnVerticalOrange
              onPress={() => {
                handleModal();
                props.navigation.navigate('주문 내역', {
                  id: detailChat?.recruit.recruitId,
                } as never);
              }}
              text={'전체 주문 확인'}
            />
          </View>
          {/* </View> */}
        </Modal>
      </View>
    );
  };
  const EachMemberModal = () => {
    const [blockModal, setBlockModal] = useState(false);
    const handleBlockModal = () => {
      blockModal ? setBlockModal(false) : setBlockModal(true);
    };
    const blockModalData = {
      title: '캡스톤님을 차단 하시겠습니까?',
      description:
        '차단하더라도, 해당 사용자가 주최자 역할이 아닌 참여하고 있는 모집글과 채팅방은 정상적으로 보여지게 됩니다.',
      modal: blockModal,
      handleModal: handleBlockModal,
    };

    return (
      <View>
        <Modal isVisible={eachUserModal} style={{margin: 0}}>
          <View
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.45)',
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}>
            <View
              onTouchStart={handleEachUserModal}
              style={{
                width: '100%',
                height: '100%',
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            />
            <View
              style={{
                flexDirection: 'column',
                width: '100%',
                padding: 15,
                position: 'relative',
                bottom: 0,
                backgroundColor: WHITE_COLOR,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}>
              <View
                style={{
                  paddingTop: 28,
                  marginBottom: 10,
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    borderColor: LINE_GRAY_COLOR,
                    paddingBottom: 18,
                  }}>
                  <Image
                    source={{
                      uri: url + '/images/' + selectedUser?.profileImage,
                    }}
                    style={{
                      width: 77,
                      height: 77,
                      backgroundColor: '#ffffff',
                      borderRadius: 77 / 2,
                      marginBottom: 17,
                    }}
                  />
                  <View>
                    <TextKRBold style={{fontSize: 14, lineHeight: 17}}>
                      {selectedUser?.nickname}
                    </TextKRBold>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    paddingTop: 32,
                    paddingBottom: 15,
                  }}>
                  <TouchableOpacity
                    style={{justifyContent: 'center', alignItems: 'center'}}
                    onPress={() => {
                      // handleModal();
                      // handleEachUserModal();
                      handleBlockModal();
                    }}>
                    <UsePopup
                      title={blockModalData.title}
                      description={blockModalData.description}
                      modal={blockModal}
                      handleModal={handleBlockModal}
                    />
                    <Image
                      source={BLOCK_ICON}
                      style={{width: 28, height: 28, marginBottom: 8}}
                    />
                    <TextKRReg style={{fontSize: 11, lineHeight: 13}}>
                      차단하기
                    </TextKRReg>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{justifyContent: 'center', alignItems: 'center'}}
                    onPress={() => {
                      handleEachUserModal();
                      handleModal();
                      props.navigation.navigate('사용자 신고하기', {
                        user: selectedUser,
                      } as never);
                    }}>
                    <Image
                      source={REPORT_ICON}
                      style={{width: 28, height: 28, marginBottom: 8}}
                    />
                    <TextKRReg style={{fontSize: 11, lineHeight: 13}}>
                      신고하기
                    </TextKRReg>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  };
  const addMessages = msg => {
    setMessages(prev => [...prev, msg]);
    connect();
  };

  useEffect(() => {
    // findRoom();
    getEachChatRoom();
    getMyInfo();
    connect();
  }, []);
  useEffect(() => {
    detailChat?.recruit.recruitId &&
      getParticipants(detailChat?.recruit.recruitId);
  }, [detailChat?.recruit.recruitId]);
  useEffect(() => {
    console.log(participantsInfo);
  }, [participantsInfo]);
  useEffect(() => {
    connect();
    getEachChatRoom();
  }, [messages, recv]);
  useEffect(() => {
    reset({
      message: '',
    });
  }, [messages]);
  // useEffect(() => {
  //   // let reconnect = 0;
  //   // ws.onConnect(
  //   //   {},
  //   // connect();
  //   if (messageText === '') return;

  //   // sendMessage(messageText);
  //   // );
  // }, [messageText]);
  const [statusBarHeight, setStatusBarHeight] = useState(0);
  const [reviewUserList, setReviewUserList] = useState<recruitParticipantsI>();
  const [selectedUser, setSelectedUser] = useState<participantI>();
  const scrollViewRef = useRef<any>(null);
  const [modal, setModal] = useState(false);
  const [eachUserModal, setEachUserModal] = useState(false);
  const handleModal = () => {
    modal
      ? (setModal(false), props.navigation.setParams({modal: false}))
      : (setModal(true), props.navigation.setParams({modal: true}));
  };
  const handleEachUserModal = () => {
    eachUserModal ? setEachUserModal(false) : setEachUserModal(true);
  };
  useEffect(() => {
    console.log(props.route.params.modal);
    props.route.params.modal && setModal(props.route.params.modal);
  }, [props.route.params]);
  const getUsers = async id => {
    try {
      const result = await getReviewParticipantsAPI(id);
      setReviewUserList(result.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    detailChat?.recruit.recruitId && getUsers(detailChat?.recruit.recruitId);
  }, [detailChat?.recruit.recruitId]);
  return (
    <>
      <MemberListModal>
        <EachMemberModal />
      </MemberListModal>
      <View style={{flex: 1}}>
        {detailChat && participantsInfo && reviewUserList && (
          <ChatHeader
            item={detailChat}
            participants={participantsInfo}
            reviewUserList={reviewUserList}
          />
        )}
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current &&
            scrollViewRef.current.scrollToEnd({animated: true})
          }
          style={{
            backgroundColor: WHITE_COLOR,
            width: '100%',
            height: `100%`,
          }}>
          <View style={{paddingBottom: 400}}>
            <View
              style={{
                paddingHorizontal: 15,
              }}>
              <View>
                {detailChat?.messages.map((v, i) => (
                  <View key={i}>
                    {i === 0 && <ChatDate item={v} key={i} />}
                    {i > 0 &&
                      (v.sendDate.split(' ')[0].split('-')[0] !==
                        detailChat.messages[i - 1].sendDate
                          .split(' ')[0]
                          .split('-')[0] ||
                        v.sendDate.split(' ')[0].split('-')[1] !==
                          detailChat.messages[i - 1].sendDate
                            .split(' ')[0]
                            .split('-')[1] ||
                        v.sendDate.split(' ')[0].split('-')[2] !==
                          detailChat.messages[i - 1].sendDate
                            .split(' ')[0]
                            .split('-')[2]) && <ChatDate item={v} key={i} />}
                    {v.message !== '' && (
                      <Text>
                        {v.senderId.toString() === userId ? (
                          <MyMessage message={v} />
                        ) : (
                          <>
                            <OpponentMessage message={v} />
                          </>
                        )}
                      </Text>
                    )}
                  </View>
                ))}
                {/* {recv && recv.sender !== myNickname ? (
      <>
        <Text>{recv.sender}</Text>
        <LiveOpponentMessage message={recv} />
      </>
    ) : (
      recv && (
        <>
          <LiveMyMessage message={recv} />
        </>
      )
    )} */}
                {/* {messages?.map((v, i) => {
      <Text>{(v.message, v.sender)}</Text>;
    })} */}
              </View>
            </View>
          </View>
        </ScrollView>
        <KeyboardAvoidingView
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
          }}
          behavior={'position'}
          keyboardVerticalOffset={statusBarHeight + 44}>
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              backgroundColor: LINE_GRAY_COLOR,
              width: '100%',
              paddingBottom: 44,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 15,
            }}>
            {/* <TouchableOpacity>
      <Image source={CAMERA_GRAY_FILLED_ICON} />
    </TouchableOpacity> */}
            <MessageTextInput
              error={errors}
              name={'message'}
              control={control}
              rules={{}}
            />
            <TouchableOpacity
              onPress={handleSubmit(d => {
                console.log(d.message);
                setMessageText(d.message);
                sendMessage(d.message);
                setValue('message', '');
              })}>
              <Image source={SEND_GRAY_FILLED_ICON} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </>
  );
};

export default DetailChatRoom;

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
    paddingBottom: 18,
  },
  avoidingView: {
    // flex: 1,
  },
});
