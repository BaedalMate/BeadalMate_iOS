import React from 'react';
import {
  ChatProfileImage,
  MessageGray,
  MessageOrange,
} from 'components/atoms/Chat/Message';
import {StyleSheet, Text, View} from 'react-native';
import {DARK_GRAY_COLOR, PRIMARY_COLOR} from 'themes/theme';
import {formTime, messageI} from 'components/utils/api/Chat';
import {messageProps} from 'components/pages/DetailChatRoom';

export const MAX_USERNAME_LIMIT = 5;
export const MyMessage = ({message}: {message: messageI}) => {
  const timeText =
    message?.sendDate.split(' ')[0] + 'T' + message?.sendDate.split(' ')[1];

  return (
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        paddingBottom: 20,
      }}>
      <Text
        style={{
          maxWidth: '80%',
          textAlign: 'center',
          textAlignVertical: 'bottom',
          marginRight: 15,
          color: DARK_GRAY_COLOR,
        }}>
        {formTime(timeText.toString())}
      </Text>
      <MessageOrange text={message.message} />
    </View>
  );
};

export const OpponentMessage = ({message}: {message: messageI}) => {
  const timeText =
    message?.sendDate.split(' ')[0] + 'T' + message?.sendDate.split(' ')[1];
  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'column',
        // paddingHorizontal: 15,
      }}>
      <View
        style={{
          flexDirection: 'row',
          // width: '100%',
          justifyContent: 'flex-start',
          // alignItems: 'stretch',
          paddingBottom: 20,
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginRight: 15,
            width: 30,
            // width: 30,
          }}>
          <ChatProfileImage image={message.senderImage} />
        </View>
        <View style={{maxWidth: '62%'}}>
          <Text
            style={{
              marginBottom: 5,
            }}>
            {message.sender.length > MAX_USERNAME_LIMIT
              ? message.sender.substring(0, MAX_USERNAME_LIMIT) + '...'
              : message.sender}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
            }}>
            <MessageGray text={message.message} />
            <View style={{}}>
              <Text
                style={{
                  textAlign: 'center',
                  textAlignVertical: 'bottom',
                  marginLeft: 15,
                  alignSelf: 'flex-end',
                  color: DARK_GRAY_COLOR,
                  flexShrink: 1,
                }}>
                {formTime(timeText)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export const LiveMyMessage = ({message}: {message: messageProps}) => {
  const currentTime = new Date();
  return (
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        paddingBottom: 10,
      }}>
      <Text
        style={{
          textAlign: 'center',
          textAlignVertical: 'bottom',
          marginRight: 15,
        }}>
        {formTime(currentTime.toString())}
      </Text>
      <MessageOrange text={message.message} />
    </View>
  );
};

// export const LiveOpponentMessage = ({message}: {message: recvI}) => {
//   const currentTime = new Date();
//   return (
//     <View
//       style={{
//         flexDirection: 'row',
//         width: '100%',
//         alignItems: 'baseline',
//         justifyContent: 'flex-start',
//       }}>
//       <ChatProfileImage image={message.senderImage} />
//       <Text
//         style={{
//           textAlign: 'center',
//           textAlignVertical: 'bottom',
//           marginLeft: 15,
//         }}>
//         {currentTime.toTimeString()}
//       </Text>
//       <MessageGray text={message.message} />
//     </View>
//   );
// };
// const Message = () => {
//   return (
//     <View>
//       <MyMessage text={'안녕하세요'} />
//       <OpponentMessage text={'반갑습니다ㄴ'} />
//       <MessageOrange text={'국민은행 1004-xxxxxxxxxxxxxxx 보내주세요~'} />
//     </View>
//   );
// };

const styles = StyleSheet.create({
  message: {},
  messageOrangeWrapper: {
    paddingHorizontal: 15,
    // paddingVertical: 10,
    backgroundColor: PRIMARY_COLOR,
    right: 15,
  },
  messgaeGrayWrapper: {
    paddingHorizontal: 15,
    // paddingVertical: 10,
    backgroundColor: '#F7F8FA',
    left: 15,
  },
});

// export {Message};
