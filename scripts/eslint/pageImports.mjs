import path from "node:path";
const srcRoot = path.resolve(import.meta.dirname, "../../src");
export const pageImports = {
  meta: {
    type: "problem",
    schema: [],
    messages: { crossPage: "페이지 간 직접 참조 대신 공통 계층을 사용하세요." },
  },
  create(context) {
    const filename = context.filename.replaceAll("\\", "/");
    const currentPage = filename.match(/\/src\/pages\/([^/]+)\//)?.[1];
    if (!currentPage) return {};
    function check(node) {
      const source = node.source?.value;
      if (typeof source !== "string") return;
      let target;
      if (source.startsWith("@/")) target = path.resolve(srcRoot, source.slice(2));
      else if (source.startsWith("."))
        target = path.resolve(path.dirname(context.filename), source);
      else return;
      const targetPage = target.replaceAll("\\", "/").match(/\/src\/pages\/([^/]+)(?:\/|$)/)?.[1];
      if (targetPage && targetPage !== currentPage)
        context.report({ node, messageId: "crossPage" });
    }
    return { ImportDeclaration: check, ExportNamedDeclaration: check, ExportAllDeclaration: check };
  },
};
