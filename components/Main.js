import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useSelector } from "react-redux";

import { useRoute } from "../router"; 

const Main = () => {
  const { isAuth, stateChange } = useSelector((state) => state.auth);

  const routing = useRoute(isAuth);

  
  if (!stateChange) return null;

  return <NavigationContainer>{routing}</NavigationContainer>;
};

export default Main;