import React, { useCallback, useState } from 'react';

import { useData, useTheme, useTranslation } from '../hooks/';
import { Block, Button, Image, Input, Product, Text } from '../components/';

const Dictlist = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<number>(0);
  const { dictlist, wordlist } = useData();
  const [grouplist, setGrouplist] = useState(dictlist);
  const { assets, colors, fonts, gradients, sizes } = useTheme();

  const handleProducts = useCallback(
    (tab: number) => {
      setTab(tab);
      setGrouplist(tab === 0 ? dictlist : wordlist);
    },
    [dictlist, wordlist, setTab, setGrouplist],
  );

  return (
    <Block>
      {/* products list */}
      <Block
        scroll
        paddingHorizontal={sizes.padding}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: sizes.l }}>
        <Block row wrap="wrap" justify="space-between" marginTop={sizes.sm}>
          {grouplist?.map((group) => (
            <Product {...group} key={`card-${group?.id}`} />
          ))}
        </Block>
      </Block>
    </Block>
  );
};

export default Dictlist;
