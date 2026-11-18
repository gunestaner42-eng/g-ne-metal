import SubcategoryPage,{getSubcategoryMetadata} from "../../../components/SubcategoryPage";
import {subcategories} from "../../../subcategories";
export function generateStaticParams(){return subcategories["bakir"].map(x=>({item:x.slug}));}
export async function generateMetadata({params}){const {item}=await params;return getSubcategoryMetadata("bakir",item);}
export default async function Page({params}){const {item}=await params;return <SubcategoryPage slug="bakir" item={item}/>;}
