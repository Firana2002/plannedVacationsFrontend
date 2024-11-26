import { createStore } from 'redux';

// Начальное состояние
const initialState = {
  user: null, // Здесь будет храниться информация о пользователе
};

// Редюсер
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    default:
      return state;
  }
};

// Создание Redux store
const store = createStore(userReducer);

export default store;
