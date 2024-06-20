import React, { useCallback, useState,useEffect } from 'react';
import { useData, useTheme, useTranslation } from '../hooks/';
import { getGroups } from '../api/dict';
import { Block, Button, Image, Input, DictGroup, Text } from '../components/';
import { deepPrinter } from '../utils/tools';

const Dictlist = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<number>(0);
  const { grouplist, wordlist, setGrouplist } = useData();
  const { assets, colors, fonts, gradients, sizes } = useTheme();

  useEffect(() => {
    const fetchGroups = async () => {
      const result = await getGroups();
      if(result.success){
        setGrouplist ? setGrouplist(result.data) : setGList(result.data);
      }
    };

    fetchGroups();
  }, [setGrouplist]); 

  const handleProducts = useCallback(
    (tab: number) => {
      setTab(tab);
    },
    [grouplist, wordlist],
  );

  return (
    <Block>
      {/* search input */}
      <Block color={colors.card} flex={0} padding={sizes.padding}>
        <Input search placeholder={t('common.search')} />
      </Block>

      {/* toggle products list */}
      {<Block
        row
        flex={0}
        align="center"
        justify="center"
        color={colors.card}
        paddingBottom={sizes.sm}>
        <Button onPress={() => handleProducts(1)}>
          <Block row align="center">
            <Block
              flex={0}
              radius={6}
              align="center"
              justify="center"
              marginRight={sizes.s}
              width={sizes.socialIconSize}
              height={sizes.socialIconSize}
              gradient={gradients?.[tab === 1 ? 'primary' : 'secondary']}>
              <Image
                radius={0}
                color={colors.white}
                source={assets.documentation}
              />
            </Block>
          </Block>
        </Button>
        <Block
          gray
          flex={0}
          width={1}
          marginHorizontal={sizes.sm}
          height={sizes.socialIconSize}
        />
        <Button onPress={() => handleProducts(1)}>
          <Block row align="center">
            <Block
              flex={0}
              radius={6}
              align="center"
              justify="center"
              marginRight={sizes.s}
              width={sizes.socialIconSize}
              height={sizes.socialIconSize}
              gradient={gradients?.[tab === 1 ? 'primary' : 'secondary']}>
              <Image
                radius={0}
                color={colors.white}
                source={assets.documentation}
              />
            </Block>
          </Block>
        </Button>
      </Block>}

      {/* products list */}
      <Block
        scroll
        paddingHorizontal={sizes.padding}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: sizes.l }}>
        <Block row wrap="wrap" justify="space-between" marginTop={sizes.sm}>
          {grouplist?.map((gItem) => (
            <DictGroup {...gItem} key={`card-${gItem?.id}`} />
          ))}
        </Block>
      </Block>
    </Block>
  );
};

export default Dictlist;

// 数据一·：``` [{"__typename": "DictiongroupEntity", "attributes": {"__typename": "Dictiongroup", "name": "公共词汇：《Bible》", "namespace": "public", "publishedAt": "2023-05-21T04:10:47.000Z", "wcount": 13796, "wlink": [Array]}, "id": "1"}, {"__typename": "DictiongroupEntity", "attributes": {"__typename": "Dictiongroup", "name": "公共词汇：《game.of.thrones.s08e03.1080p.bluray.x264-turmoil》", "namespace": "public", "publishedAt": "2023-05-21T04:11:41.000Z", "wcount": 276, "wlink": [Array]}, "id": "2"}, {"__typename": "DictiongroupEntity", "attributes": {"__typename": "Dictiongroup", "name": "公共词汇：《game.of.thrones.s08e02.1080p.bluray.x264-turmoil》", "namespace": "public", "publishedAt": ```
// 类型：```

// export interface GroupItem {
//   __typename: string;
//   name: string;
//   namespace: string;
//   publishedAt: string;
//   wcount: number;
//   wlink: any[];
// }

// export interface GroupList {
//   __typename: string;
//   attributes: GroupItem;
//   id: string;
// }

// ```
// 代码一：```import React from 'react';
// import {TouchableOpacity} from 'react-native';

// import Block from './Block';
// import Image from './Image';
// import Text from './Text';
// import {IProduct} from '../constants/types';
// import {useTheme, useTranslation} from '../hooks/';

// const Product = ({image, title, type, linkLabel}: IProduct) => {
//   const {t} = useTranslation();
//   const {assets, colors, sizes} = useTheme();

//   const isHorizontal = type !== 'vertical';
//   const CARD_WIDTH = (sizes.width - sizes.padding * 2 - sizes.sm) / 2;

//   return (
//     <Block
//       card
//       flex={0}
//       row={isHorizontal}
//       marginBottom={sizes.sm}
//       width={isHorizontal ? CARD_WIDTH * 2 + sizes.sm : CARD_WIDTH}>
//       <Image
//         resizeMode="cover"
//         source={{uri: image}}
//         style={{
//           height: isHorizontal ? 114 : 110,
//           width: !isHorizontal ? '100%' : sizes.width / 2.435,
//         }}
//       />
//       <Block
//         paddingTop={sizes.s}
//         justify="space-between"
//         paddingLeft={isHorizontal ? sizes.sm : 0}
//         paddingBottom={isHorizontal ? sizes.s : 0}>
//         <Text p marginBottom={sizes.s}>
//           {title}
//         </Text>
//         <TouchableOpacity>
//           <Block row flex={0} align="center">
//             <Text
//               p
//               color={colors.link}
//               semibold
//               size={sizes.linkSize}
//               marginRight={sizes.s}>
//               {linkLabel || t('common.readArticle')}
//             </Text>
//             <Image source={assets.arrow} color={colors.link} />
//           </Block>
//         </TouchableOpacity>
//       </Block>
//     </Block>
//   );
// };

// export default Product;

// ```
// 代码二:```

// import React, { useCallback, useState,useEffect } from 'react';
// import { useData, useTheme, useTranslation } from '../hooks/';
// import { getGroups } from '../api/dict';
// import { Block, Button, Image, Input, Product, Text } from '../components/';
// import { deepPrinter } from '../utils/tools';

// const Dictlist = () => {
//   const { t } = useTranslation();
//   const [tab, setTab] = useState<number>(0);
//   const { grouplist, wordlist, setGrouplist } = useData();
//   const { assets, colors, fonts, gradients, sizes } = useTheme();

//   useEffect(() => {
//     const fetchGroups = async () => {
//       const result = await getGroups();
//       if(result.success){
//         console.log(result.data)
//         setGrouplist ? setGrouplist(result.data) : setGList(result.data);
//       }
//     };

//     fetchGroups();
//   }, [setGrouplist]); 

//   const handleProducts = useCallback(
//     (tab: number) => {
//       setTab(tab);
//     },
//     [grouplist, wordlist],
//   );

//   return (
//     <Block>
//       {/* search input */}
//       <Block color={colors.card} flex={0} padding={sizes.padding}>
//         <Input search placeholder={t('common.search')} />
//       </Block>

//       {/* toggle products list */}
//       {<Block
//         row
//         flex={0}
//         align="center"
//         justify="center"
//         color={colors.card}
//         paddingBottom={sizes.sm}>
//         <Button onPress={() => handleProducts(1)}>
//           <Block row align="center">
//             <Block
//               flex={0}
//               radius={6}
//               align="center"
//               justify="center"
//               marginRight={sizes.s}
//               width={sizes.socialIconSize}
//               height={sizes.socialIconSize}
//               gradient={gradients?.[tab === 1 ? 'primary' : 'secondary']}>
//               <Image
//                 radius={0}
//                 color={colors.white}
//                 source={assets.documentation}
//               />
//             </Block>
//           </Block>
//         </Button>
//         <Block
//           gray
//           flex={0}
//           width={1}
//           marginHorizontal={sizes.sm}
//           height={sizes.socialIconSize}
//         />
//         <Button onPress={() => handleProducts(1)}>
//           <Block row align="center">
//             <Block
//               flex={0}
//               radius={6}
//               align="center"
//               justify="center"
//               marginRight={sizes.s}
//               width={sizes.socialIconSize}
//               height={sizes.socialIconSize}
//               gradient={gradients?.[tab === 1 ? 'primary' : 'secondary']}>
//               <Image
//                 radius={0}
//                 color={colors.white}
//                 source={assets.documentation}
//               />
//             </Block>
//           </Block>
//         </Button>
//       </Block>}

//       {/* products list */}
//       <Block
//         scroll
//         paddingHorizontal={sizes.padding}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: sizes.l }}>
//         <Block row wrap="wrap" justify="space-between" marginTop={sizes.sm}>
//           {grouplist?.map((gItem) => (
//             <Product {...gItem} key={`card-${gItem?.id}`} />
//           ))}
//         </Block>
//       </Block>
//     </Block>
//   );
// };

// export default Dictlist;
// ```

// 根据数据 一，看看类型，我要将代码二中的<Product {...gItem} 修改为 DictGroup.tsx，现在请根据代码一完成DictGroup