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
    }, 3000);
  });
};

export default () => {
  const [dataList, setDataList] = React.useState([]);
  useNativeEffect(() => {
    fakeAPI().then((res) => setDataList(res));
  }, []);

  return (
    <View className="container">
      <View className="header"></View>
      <ScrollView scrollY>
        <View className="main">
          {dataList.map((v) => (
            <View className="card">Card {v}</View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
