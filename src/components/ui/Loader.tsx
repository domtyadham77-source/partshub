export default function Loader({ label = "Loading..." }: { label?: string }) {
  return <div className="ph-loader" role="status"><span className="ph-spinner"/><span>{label}</span></div>;
}
