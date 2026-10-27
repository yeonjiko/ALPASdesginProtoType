import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
async function files(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((e) =>
        e.isDirectory() ? files(path.join(dir, e.name)) : [path.join(dir, e.name)],
      ),
    )
  ).flat();
}
const styles = (await files("src")).filter((f) => f.endsWith(".css"));
const css = (await Promise.all(styles.map((f) => readFile(f, "utf8")))).join("\n");
console.log(
  JSON.stringify(
    {
      files: styles.length,
      modules: styles.filter((f) => f.endsWith(".module.css")).length,
      cssRules: (css.match(/\{[^{}]*\}/g) || []).length,
      muiClassReferences: (css.match(/\.Mui[A-Za-z-]+/g) || []).length,
      measurement: "local source CSS; vendor source excluded",
    },
    null,
    2,
  ),
);
