export type StyleMap = Readonly<Record<string, string>>;
export function createClasses(...modules: StyleMap[]): (classNames?: string) => string {
  const styles: Record<string, string> = {};
  for (const module of modules) {
    for (const [name, className] of Object.entries(module)) styles[name] = className;
  }
  return (classNames = "") =>
    classNames
      .split(/\s+/)
      .filter(Boolean)
      .flatMap((name) => (styles[name] ? [name, styles[name]] : [name]))
      .join(" ");
}
export function joinClasses(...classNames: (string | undefined | false)[]): string {
  return classNames.filter(Boolean).join(" ");
}
