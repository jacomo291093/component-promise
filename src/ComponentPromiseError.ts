class ComponentPromiseError extends Error {
  public code: string;
  constructor(message?: string, code?: string) {
    super(message || "Component Promise rejected");
    this.code = code || "component-promise-reject";
  }
}

export type IComponentPromiseError = ComponentPromiseError;

export default ComponentPromiseError;
