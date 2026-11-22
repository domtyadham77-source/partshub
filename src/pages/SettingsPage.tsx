import MainLayout from "../components/layout/MainLayout";
import {useLanguage} from "../contexts/LanguageContext";
import Badge from "../components/ui/Badge";
export default function SettingsPage(){
 const {language,setLanguage,t}=useLanguage();
 return <MainLayout><section className="route-panel"><Badge>{t("Settings")}</Badge><h1>{t("Settings")}</h1><p>{t("Manage your Parts Hub display preferences.")}</p><div className="settings-option"><div><strong>{t("Website language")}</strong><p>{t("Choose the language used across the marketplace.")}</p></div><button className="language-toggle language-toggle-compact" type="button" onClick={()=>setLanguage(language==="en"?"ar":"en")}>{language==="en"?"AR":"EN"}</button></div></section></MainLayout>;
}
