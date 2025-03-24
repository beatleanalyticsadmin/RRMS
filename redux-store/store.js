import { createStore } from "redux";
const defaultState = {
  isLoggedIn: false,
  userId: "",
  userType: "",
};

const storeReducer = (state = defaultState, action) => {
  if (action.type === "logIn") {
    const data = action.data;

    return {
      ...state,
      isLoggedIn: true,
      userId: data.user_id,
      userType: data.type,
    };
  }

  if (action.type === "logout") {
    return { ...defaultState };
  }

  // if (action.type === "reload") {
  //   return {
  //     ...action.data,
  //   };
  // }

  return state;
};
const store = createStore(storeReducer);

export default store;
