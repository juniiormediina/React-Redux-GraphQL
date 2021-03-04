import axios from "axios";
import { updateDB, getFavs } from "../firebase";

/* Constants */
let initialData = {
  fetching: false,
  array: [],
  current: {},
  favorites: [],
};

let URL = "https://rickandmortyapi.com/api/character";

let GET_CHARACTER = "GET_CHARACTER";
let GET_CHARACTER_SUCCESS = "GET_CHARACTER_SUCCESS";
let GET_CHARACTER_ERROR = "GET_CHARACTER_ERROR";

let REMOVE_CHARACTER = "REMOVE_CHARACTER";
let ADD_TO_FAVORITES = "ADD_TO_FAVORITES";

let GET_FAVS = "GET_FAVS";
let GET_FAVS_SUCCESS = "GET_FAVS_SUCCESS";
let GET_FAVS_ERROR = "GET_FAVS_ERROR";

/* Reducer */
export default function reducer(state = initialData, action) {
  switch (action.type) {
    case GET_FAVS_SUCCESS:
      return { ...state, favorites: action.payload, fetching: false };
    case GET_FAVS_ERROR:
      return { ...state, fetching: false, error: action.payload };
    case GET_FAVS:
      return { ...state, fetching: true };
    case ADD_TO_FAVORITES:
      return { ...state, ...action.payload };
    case REMOVE_CHARACTER:
      return { ...state, array: action.payload };
    case GET_CHARACTER:
      return { ...state, fetching: true };
    case GET_CHARACTER_ERROR:
      return { ...state, fetching: false, error: action.payload };
    case GET_CHARACTER_SUCCESS:
      return { ...state, array: action.payload, fetching: false };
    default:
      return state;
  }
}

/* Actions (Thunks)*/
export let retreiveFavs = () => (dispatch, getState) => {
  dispatch({
    type: GET_FAVS,
  });
  let { uid } = getState().user;

  return getFavs(uid)
    .then((array) => {
      dispatch({
        type: GET_FAVS_SUCCESS,
        payload: [...array],
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({ type: GET_FAVS_ERROR, payload: err.message });
    });
};

export let addFavoritesAction = () => (dispatch, getState) => {
  let { array, favorites } = getState().characters;
  let { uid } = getState().user;
  let char = array.shift();

  favorites.push(char);
  updateDB(favorites, uid);

  dispatch({
    type: ADD_TO_FAVORITES,
    payload: { array: [...array], favorites: [...favorites] },
  });
};

export let removeCharacterAction = () => (dispatch, getState) => {
  let { array } = getState().characters;

  array.shift();

  dispatch({
    type: REMOVE_CHARACTER,
    payload: [...array],
  });
};

// function that returns another function
export let getCharactersAction = () => (dispatch, getState) => {
  dispatch({
    type: GET_CHARACTER,
  });
  return axios
    .get(URL)
    .then((res) => {
      dispatch({
        type: GET_CHARACTER_SUCCESS,
        payload: res.data.results,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: GET_CHARACTER_ERROR,
        payload: err.response.message,
      });
    });
};
