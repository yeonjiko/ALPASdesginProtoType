export const disableReason = {
  meta: {
    type: "problem",
    schema: [],
    messages: { missing: "ESLint 예외에는 대상 규칙과 -- 사유를 작성하세요." },
  },
  create(context) {
    return {
      Program() {
        for (const comment of context.sourceCode.getAllComments()) {
          const match = comment.value
            .trim()
            .match(/^eslint-disable(?:-next-line|-line)?\b([\s\S]*)$/u);
          if (!match) continue;
          const [names, ...reasons] = match[1].split("--");
          if (!names.trim() || !reasons.join("--").trim()) {
            context.report({ loc: comment.loc, messageId: "missing" });
          }
        }
      },
    };
  },
};
