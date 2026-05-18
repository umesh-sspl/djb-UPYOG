/**
 * @file filterSerializer.js
 * @description Translates dashboard state criteria into encoded URL search parameters and deserializes query params back to state objects.
 */

export const FilterSerializer = {
  /**
   * Serializes a plain filter state object into a URL query parameter string
   */
  serialize: (filters) => {
    if (!filters || typeof filters !== "object") return "";
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "" && value !== "ALL") {
        params.append(key, String(value));
      }
    });

    const queryString = params.toString();
    return queryString ? `?${queryString}` : "";
  },

  /**
   * Deserializes current window search string parameters back into a flat state object
   */
  deserialize: (searchString, defaultFilters = {}) => {
    if (!searchString) return { ...defaultFilters };
    const params = new URLSearchParams(searchString);
    const filters = { ...defaultFilters };

    params.forEach((value, key) => {
      filters[key] = value;
    });

    return filters;
  },

  /**
   * Updates browser history state smoothly without triggering full reload navigations
   */
  persistToUrl: (filters) => {
    if (typeof window === "undefined") return;
    const serialized = FilterSerializer.serialize(filters);
    const newUrl = `${window.location.pathname}${serialized}`;
    window.history.replaceState({ path: newUrl }, "", newUrl);
  }
};

export default FilterSerializer;
