import React from 'react';
import { TouchableOpacity } from 'react-native';
import Block from './Block';
import Image from './Image';
import Text from './Text';
import { useTheme, useTranslation } from '../hooks/';
import * as DictTypes from '../constants/types/dict';


const DictGroup = (data: DictTypes.GroupItem) => {
  const { t } = useTranslation();
  const { assets, colors, sizes } = useTheme();

  const { attributes, id } = data;
  const { name, namespace, publishedAt, wcount } = attributes;

//   const isHorizontal = type !== 'vertical';
//   const CARD_WIDTH = (sizes.width - sizes.padding * 2 - sizes.sm) / 2;


  return (
    <Block
      card
      flex={0}
      marginBottom={sizes.sm}
      width={sizes.width - sizes.padding * 2}>
              {/* <Image
        resizeMode="cover"
        source={{uri: image}}
        style={{
          height: isHorizontal ? 114 : 110,
          width: !isHorizontal ? '100%' : sizes.width / 2.435,
        }}
      /> */}
      <Block
        paddingTop={sizes.s}
        justify="space-between"
        paddingLeft={sizes.sm}
        paddingBottom={sizes.s}>
        <Text h3 marginBottom={sizes.s}>
          {name}
        </Text>
        <Text p color={colors.link} marginBottom={sizes.s}>
          Namespace: {namespace}
        </Text>
        <Text p color={colors.link} marginBottom={sizes.s}>
          Published at: {publishedAt}
        </Text>
        <Text p color={colors.link} marginBottom={sizes.s}>
          Word count: {wcount}
        </Text>
        <TouchableOpacity>
          <Block row flex={0} align="center">
            <Text
              p
              color={colors.link}
              semibold
              size={sizes.linkSize}
              marginRight={sizes.s}>
              {t('common.viewDetails')}
            </Text>
            <Image source={assets.arrow} color={colors.link} />
          </Block>
        </TouchableOpacity>
      </Block>
    </Block>
  );
};

export default DictGroup;
