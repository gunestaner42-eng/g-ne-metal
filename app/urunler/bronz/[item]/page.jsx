import SubcategoryPage,{getSubcategoryMetadata} from "../../../components/SubcategoryPage";
import {subcategories} from "../../../subcategories";
export function generateStaticParams(){return subcategories["bronz"].map(x=>({item:x.slug}));}
export async function generateMetadata({params}){const {item}=await params;return getSubcategoryMetadata("bronz",item);}
export default async function Page({params}){const {item}=await params;return <SubcategoryPage slug="bronz" item={item}/>;}
