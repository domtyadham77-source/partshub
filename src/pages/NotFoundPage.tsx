import { Link } from "react-router-dom";
export default function NotFoundPage() {
  return <section className="route-panel"><span className="eyebrow">404 / PAGE NOT FOUND</span><h1>This road ends here.</h1><p>The page may have moved, or the link may be incorrect.</p><Link className="ph-link-button" to="/">Back to marketplace</Link></section>;
}
