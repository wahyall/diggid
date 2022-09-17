export function extractUuidFromUrl(url) {
  return /((\w{4,12}-?)){5}/.exec(url)[0];
}
