import { loginWithGoogle, signOutGoogle } from "../firebase";
import { retreiveFavs } from "./charsDuck";

/* Constant */
let initialData = {
  loggedIn: false,
  fetching: false,
};

let LOGIN = "LOGIN";
let LOGIN_SUCCESS = "LOGIN_SUCCESS";
let LOGIN_ERROR = "LOGIN_SUCCESS";

let LOG_OUT = "LOG_OUT";

/* Reducer */
export default function reducer(state = initialData, action) {
  switch (action.type) {
    case LOG_OUT:
      return { ...initialData };
    case LOGIN_SUCCESS:
      return { ...state, fetching: false, ...action.payload, loggedIn: true };
    case LOGIN_ERROR:
      return { ...state, fetching: false, error: action.payload };
    case LOGIN:
      return { ...state, fetching: true };
    default:
      return state;
  }
}

/* Aux Function */
function saveStorage(storage) {
  localStorage.storage = JSON.stringify(storage);
}

/* Action (action creator) */
export let logOutAction = () => (dispatch, getState) => {
  signOutGoogle();
  dispatch({
    type: LOG_OUT,
  });
  localStorage.removeItem("storage");
};

export let restoreSessionAction = () => (dispatch) => {
  let storage = localStorage.getItem("storage");
  storage = JSON.parse(storage);
  if (storage && storage.user) {
    dispatch({
      type: LOGIN_SUCCESS,
      payload: storage.user,
    });
  }
};

export let doGoogleLoginAction = () => (dispatch, getState) => {
  dispatch({
    type: LOGIN,
  });
  return loginWithGoogle()
    .then((user) => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        },
      });
      saveStorage(getState());
      retreiveFavs()(dispatch, getState);
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: LOGIN_ERROR,
        payload: err.message,
      });
    });
};
