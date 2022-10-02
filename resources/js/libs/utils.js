export function extractUuidFromUrl(url) {
  return /((\w{4,12}-?)){5}/.exec(url)[0];
}

export function extractRouteParams(search, asFormData = false) {
  if (asFormData) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(params)) {
      formData.append(key, value);
    }
    return formData;
  } else {
    const params = {};
    const searchParams = new URLSearchParams(search);
    for (const [key, value] of searchParams) {
      if (key.endsWith("[]")) {
        const keyName = key.replace("[]", "");
        if (params[keyName]) {
          params[keyName].push(value);
        } else {
          params[keyName] = [value];
        }
      } else {
        params[key] = value;
      }
    }

    return params;
  }
}
