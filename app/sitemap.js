import {products} from "./products";
export default function sitemap(){const base="https://gunes-metal.vercel.app";return ["",...products.map(p=>"/urunler/"+p.slug),...["6082","6013","6061","5083","7075"].map(g=>"/urunler/aluminyum/"+g)].map(path=>({url:base+path}));}
