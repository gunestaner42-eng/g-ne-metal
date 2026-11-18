import test from "node:test";
import assert from "node:assert/strict";
import {calculateWeight,parsePositive} from "../app/components/weightMath.mjs";
const kg=(x)=>calculateWeight(x).kg;
const base={length:"1000",quantity:"1",density:"8.96",unit:"mm"};
const close=(actual,expected)=>assert.ok(Math.abs(actual-expected)<1e-9,`${actual} != ${expected}`);
test("round copper Ø50 × 1000 mm",()=>close(kg({...base,shape:"round",diameter:"50"}),Math.PI*50**2/4*8.96/1000));
test("tube Ø45 × 2 mm wall",()=>close(kg({...base,shape:"tube",diameter:"45",inner:"41"}),Math.PI*(45**2-41**2)/4*8.96/1000));
test("coil copper Ø10 × 1 mm × 3 m",()=>close(kg({...base,shape:"tube",copperMode:"coil",diameter:"10",thickness:"1",length:"3",unit:"m"}),Math.PI*(10**2-8**2)/4*3*8.96/1000));
test("flat aluminum 25 × 245 × 345 mm",()=>close(kg({...base,shape:"flat",width:"245",thickness:"25",length:"345",density:"2.81"}),25*245*345*2.81/1e6));
test("hex brass AF36 × 35 mm × 14",()=>close(kg({...base,shape:"hex",diameter:"36",length:"35",quantity:"14",density:"8.5"}),Math.sqrt(3)*36**2/2*35*14*8.5/1e6));
test("unit conversion and quantity",()=>close(kg({...base,shape:"round",diameter:"50",length:"1",unit:"m",quantity:"2"}),2*kg({...base,shape:"round",diameter:"50"})));
test("comma decimal",()=>assert.equal(parsePositive("2,81"),2.81));
for(const [name,changes] of Object.entries({"empty length":{length:""},"zero length":{length:"0"},"negative diameter":{diameter:"-5"},"zero density":{density:"0"},"fractional quantity":{quantity:"1.5"},"negative quantity":{quantity:"-1"},"infinite quantity":{quantity:"Infinity"},"huge quantity":{quantity:"99999999999999999999"},"text diameter":{diameter:"abc"}})){
 test("reject "+name,()=>assert.equal(kg({...base,shape:"round",diameter:"50",...changes}),null));
}
test("reject tube inner >= outer",()=>assert.equal(kg({...base,shape:"tube",diameter:"40",inner:"40"}),null));
test("reject coil wall >= radius",()=>assert.equal(kg({...base,shape:"tube",copperMode:"coil",diameter:"10",thickness:"5"}),null));
test("reject zero tube inner diameter",()=>assert.equal(kg({...base,shape:"tube",diameter:"40",inner:"0"}),null));
test("reject invalid shape",()=>assert.equal(kg({...base,shape:"square"}),null));
