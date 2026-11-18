import test from "node:test";import assert from "node:assert/strict";import {filterProducts,normalizeSearch} from "../app/productSearch.mjs";
const items=[{slug:"bakir",name:"Bakır",desc:"Lama, çubuk",description:"",forms:"",uses:""},{slug:"aluminyum",name:"Alüminyum",desc:"Levha",description:"",forms:"",uses:""},{slug:"bronz",name:"Bronz",desc:"Burç",description:"",forms:"",uses:""},{slug:"muhendislik-plastik",name:"Mühendislik Plastik",desc:"Delrin",description:"",forms:"",uses:""}];
test("Turkish normalization",()=>assert.equal(normalizeSearch("ÇİNKO İÇİN"),"cinko icin"));
test("search grade",()=>assert.deepEqual(filterProducts(items,{search:"7075"}).map(p=>p.slug),["aluminyum"]));
test("search grade alias",()=>assert.deepEqual(filterProducts(items,{search:"12 kalay"}).map(p=>p.slug),["bronz"]));
test("plastic group",()=>assert.deepEqual(filterProducts(items,{group:"plastik"}).map(p=>p.slug),["muhendislik-plastik"]));
test("form and grade combined",()=>assert.deepEqual(filterProducts(items,{form:"Levha",grade:"7075"}).map(p=>p.slug),["aluminyum"]));
test("no match",()=>assert.equal(filterProducts(items,{search:"xyz"}).length,0));
