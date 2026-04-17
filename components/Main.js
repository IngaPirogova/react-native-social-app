import { useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { useRoute } from "../router";


const Main = () => {
  const { stateChange, loading } = useSelector((state) => state.auth);

  if (loading) return null; 

  const routing = useRoute(stateChange);

  return <NavigationContainer>{routing}</NavigationContainer>;
};

export default Main;