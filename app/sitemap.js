import {products} from "./products";
import {subcategories} from "./subcategories";
export default function sitemap(){const base="https://gunes-metal.vercel.app";const paths=["",...products.map(p=>"/urunler/"+p.slug),...["6082","6013","6061","5083","7075"].map(g=>"/urunler/aluminyum/"+g),...Object.entries(subcategories).flatMap(([slug,items])=>items.map(item=>"/urunler/"+slug+"/"+item.slug))];return paths.map(path=>({url:base+path}));}
