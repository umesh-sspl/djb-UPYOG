export const commonReducer = (defaultData = {}) => (state, action) => {
  const currentState = state ?? defaultData;

  switch (action?.type) {
    case "LANGUAGE_SELECT":
      return {
        ...currentState,
        selectedLanguage: action.payload,
      };

    default:
      return currentState;
  }
};
