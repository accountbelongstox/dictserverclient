import React, { useCallback, useState, useEffect } from 'react';

import { useData, useTheme, useTranslation } from '../hooks/';
import { Block, Button, Image, Input, Product, Text } from '../components/';
// 你需要一个方法来从API获取数据，例如:
// import { fetchAdditionalData } from '../api';

const Dictlist = () => {
    const { t } = useTranslation();
    const [tab, setTab] = useState<number>(0);
    const { dictlist, wordlist, setDictlist } = useData();
    const [grouplist, setGrouplist] = useState(dictlist);
    const [preloadGroup, setPreloadGroup] = useState([]);
    const [imageLoadStatus, setImageLoadStatus] = useState({}); // 用于跟踪图片加载状态
    const { assets, colors, fonts, gradients, sizes } = useTheme();

    const handleProducts = useCallback(
        (tab: number) => {
            setTab(tab);
            setGrouplist(tab === 0 ? dictlist : wordlist);
        },
        [dictlist, wordlist, setTab, setGrouplist],
    );

    const checkDictlist = useCallback(async () => {
        if (dictlist.length < SOME_VALUE) {  // 你需要定义 SOME_VALUE
            // 假设 fetchAdditionalData 是一个函数，它从API获取额外的数据
            const additionalData = await fetchAdditionalData();
            setPreloadGroup(additionalData);
        }
    }, [dictlist]);

    const handleImageLoad = (id, status) => {
        setImageLoadStatus(prevStatus => ({
            ...prevStatus,
            [id]: status,
        }));
    };

    useEffect(() => {
        checkDictlist();
    }, [checkDictlist]);

    useEffect(() => {
        const allImagesLoaded = preloadGroup.every(item => imageLoadStatus[item.id]);
        if (allImagesLoaded) {
            setDictlist(prevDictlist => [...prevDictlist, ...preloadGroup]);
            setPreloadGroup([]);
        }
    }, [imageLoadStatus, preloadGroup, setDictlist]);

    return (

        <Block>

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

            {/* 预加载组，使用visibility属性来隐藏 */}
            <Block
                style={{ visibility: 'hidden' }}
                scroll
                paddingHorizontal={sizes.padding}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: sizes.l }}>
                <Block row wrap="wrap" justify="space-between" marginTop={sizes.sm}>
                    {preloadGroup.map((item) => (
                        <Image
                            source={{ uri: item.image }}
                            onLoad={() => handleImageLoad(item.id, true)}
                            onError={() => handleImageLoad(item.id, false)}
                            key={item.id}
                        />
                    ))}
                </Block>
            </Block>
            {/* 产品列表 */}
            <Block
                scroll
                paddingHorizontal={sizes.padding}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: sizes.l }}>
                <Block row wrap="wrap" justify="space-between" marginTop={sizes.sm}>
                    {grouplist.map((group) => (
                        <Product {...group} key={`card-${group.id}`} />
                    ))}
                </Block>
            </Block>
        </Block>
    );
};

export default Dictlist;
