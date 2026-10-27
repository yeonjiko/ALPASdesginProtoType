import { RuleTester } from "eslint";
import path from "node:path";
import { pageImports } from "./eslint/pageImports.mjs";
const filename = path.resolve("src/pages/loans/LoanPage.tsx");
new RuleTester().run("alpas/page-imports", pageImports, {
  valid: [
    { filename, code: 'import { form } from "@/pages/loans/form";' },
    { filename, code: 'import { Button } from "@/components/ui";' },
    {
      filename: path.resolve("src/App.tsx"),
      code: 'import { LoanPage } from "@/pages/loans/LoanPage";',
    },
  ],
  invalid: [
    {
      filename,
      code: 'import { member } from "@/pages/members/member";',
      errors: [{ messageId: "crossPage" }],
    },
    {
      filename,
      code: 'export { member } from "../members/member";',
      errors: [{ messageId: "crossPage" }],
    },
  ],
});
