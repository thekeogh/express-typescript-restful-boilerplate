export function response(statusCode = 200) {
  return function <T extends GenericClass>(target: T) {
    return class extends target {
      status = statusCode;
    };
  };
}
