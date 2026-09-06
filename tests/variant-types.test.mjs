import { test } from 'node:test';
import assert from 'node:assert/strict';
import ts from '../scripts/typescript.mjs';
import { variantTypes } from '../scripts/variant-types.mjs';

function declaration(code) {
  const source=ts.createSourceFile('fixture.ts',code,ts.ScriptTarget.Latest,true);
  const transformed=ts.transform(source,[variantTypes]);
  const printed=ts.createPrinter().printFile(transformed.transformed[0]);
  transformed.dispose();
  return ts.transpileDeclaration(printed,{fileName:'fixture.ts'}).outputText;
}
test('isolated declarations retain CVA variant names and boolean variants',()=>{
  const result=declaration('import {cva as variants} from "class-variance-authority"; export const button = variants("", {variants:{size:{small:"",large:""},active:{true:"",false:""}}});');
  assert.match(result,/"size"\?: "small" \| "large" \| null \| undefined/);
  assert.match(result,/"active"\?: boolean \| null \| undefined/);
  assert.match(result,/import\("class-variance-authority\/types"\).ClassProp/);
  assert.doesNotMatch(result,/button: any/);
});
test('dynamic variant schemas and unrelated functions are not guessed',()=>{
  assert.match(declaration('import {cva} from "class-variance-authority"; export const button=cva("",{variants:{...dynamic}});'),/button: any/);
  assert.match(declaration('declare function cva(...args: any[]): any; export const button=cva("",{variants:{size:{sm:""}}});'),/button: any/);
});
