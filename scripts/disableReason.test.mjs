import { RuleTester } from "eslint";
import { disableReason } from "./eslint/disableReason.mjs";

new RuleTester().run("alpas/disable-reason", disableReason, {
  valid: [
    "// eslint-disable-next-line no-console -- 외부 SDK 진단 로그\nconsole.log('test');",
    "/* eslint-disable no-console -- 외부 SDK 진단 로그 */\nconsole.log('test');",
    "const count = 1;",
  ],
  invalid: [
    { code: "// eslint-disable-next-line\nconst count = 1;", errors: [{ messageId: "missing" }] },
    {
      code: "// eslint-disable-next-line no-console\nconsole.log('test');",
      errors: [{ messageId: "missing" }],
    },
    {
      code: "// eslint-disable-next-line -- 사유만 있고 대상 규칙 없음\nconst count = 1;",
      errors: [{ messageId: "missing" }],
    },
  ],
});
