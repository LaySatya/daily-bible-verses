export default function DateSelect({ value, onChange }) {
  return (
    <label className="input bg-slate-600 text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-teal-300 focus-within:border-transparent">
      <span className="label">Dates</span>
      <input type="date" className="text-white" />
    </label>
  );
}
