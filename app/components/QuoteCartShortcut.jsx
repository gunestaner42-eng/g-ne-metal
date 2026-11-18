"use client";
import Link from "next/link";
import {useQuoteCart} from "./QuoteCartContext";
export default function QuoteCartShortcut(){
 const {items,ready}=useQuoteCart();
 return <Link className="quote-shortcut" href="/teklif-sepeti" aria-label={"Teklif sepetini aç, "+(ready?items.length:0)+" ürün"}>Teklif Sepeti <span>{ready?items.length:0}</span></Link>;
}
