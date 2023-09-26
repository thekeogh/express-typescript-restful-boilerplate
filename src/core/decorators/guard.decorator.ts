export function guard() {
  return function <T extends GenericClass>(target: T) {
    return class extends target {
      guard = true;
    };
  };
}
