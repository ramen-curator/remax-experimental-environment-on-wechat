import * as React from "react";
import { View, ScrollView, GenericEvent } from "remax/wechat";
import { useNativeEffect } from "remax";
import { usePageEvent } from "remax/macro";

import "./index.css";

const data = new Array(10).fill(null).map((v, i, a) => (a[i] = i));

const fakeAPI = () => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res(data);
    }, 1000);
  });
};

export default () => {
  const [dataList, setDataList] = React.useState([]);
  useNativeEffect(() => {
    fakeAPI().then((res) => setDataList(res));
  }, []);

  const [enabled, setEnabled] = React.useState(false);
  // 不这么做，loading只能拉到Ad.的范围。
    //  第一次enable后，setEnabled的权力应该转移给onPageScroll
  const [isFirstRender, setIsFirstRender] = React.useState(true); 
  useNativeEffect(() => {
    if (dataList.length > 0 && isFirstRender) {
      setIsFirstRender(false)
      setEnabled(true);
    }
  }, [dataList]);
  // 不这么做，划下去后，想划上来就会触发下拉加载。
  usePageEvent("onPageScroll", (e) => {
    setEnabled(e.scrollTop <= 0);
  });

  const [triggered, setTriggered] = React.useState(true);

  return (
    <View className="container">
      <View className="header"></View>
      <ScrollView
        scrollY
        refresherEnabled={enabled}
        refresherTriggered={triggered}
        onRefresherRefresh={() => {
          setTriggered(true);
          fakeAPI().finally(() => {
            setTriggered(false);
          });
        }}
      >
        <View className="main">
          <View className="ad">Ad.</View>
          {dataList.map((v, i) => (
            <View className="card" key={i.toString()}>
              Card {v}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
