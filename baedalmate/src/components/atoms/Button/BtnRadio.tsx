import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {LINE_ORANGE_COLOR, WHITE_COLOR} from 'themes/theme';
export type TagProps = {
  text: string;
  active: boolean;
};

const BtnRadio = ({data, onSelect}) => {
  const [userOption, setUserOption] = useState(data[0].value);

  const selectHandler = value => {
    onSelect(value);
    setUserOption(value);
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        marginVertical: 15,
      }}>
      {data.map((item, i) => {
        return (
          <Pressable
            key={i}
            onPress={() => selectHandler(item.value)}
            style={[
              item.value === userOption ? styles.selected : styles.unselected,
              {
                marginRight: 15,
              },
            ]}>
            <Text
              style={[
                styles.option,
                {
                  color:
                    item.value === userOption ? WHITE_COLOR : LINE_ORANGE_COLOR,
                },
              ]}>
              {item.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  option: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 24,
    borderRadius: 10,
    borderColor: LINE_ORANGE_COLOR,
  },
  selected: {
    width: 55,
    height: 28,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: LINE_ORANGE_COLOR,
    backgroundColor: LINE_ORANGE_COLOR,
  },
  unselected: {
    width: 55,
    height: 28,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: LINE_ORANGE_COLOR,
  },
  tagWrapper: {},
  tagText: {},
});

export default BtnRadio;
