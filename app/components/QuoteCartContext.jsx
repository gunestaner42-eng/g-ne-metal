"use client";
import {createContext,useContext,useEffect,useState} from "react";
const Context=createContext(null);
const KEY="gunes-metal-quote-cart-v1";
export function QuoteCartProvider({children}){
 const [items,setItems]=useState([]);
 const [ready,setReady]=useState(false);
 useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem(KEY)||"[]");if(Array.isArray(saved))setItems(saved.filter(x=>x&&typeof x.name==="string"&&Number.isSafeInteger(x.quantity)&&x.quantity>0).slice(0,50));}catch{}setReady(true);},[]);
 useEffect(()=>{if(ready)try{localStorage.setItem(KEY,JSON.stringify(items));}catch{}},[items,ready]);
 const add=item=>{setItems(old=>[...old,{...item,id:crypto.randomUUID()}].slice(-50));};
 const remove=id=>setItems(old=>old.filter(x=>x.id!==id));
 const clear=()=>setItems([]);
 return <Context.Provider value={{items,add,remove,clear,ready}}>{children}</Context.Provider>;
}
export function useQuoteCart(){const value=useContext(Context);if(!value)throw Error("QuoteCartProvider missing");return value;}
