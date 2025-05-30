export default function Diff({ oldText, newText }) {
    return (
        <figure className="diff aspect-16/8" tabIndex={0}>
  <div className="diff-item-1" role="img" tabIndex={0}>
    <div className="bg-primary text-primary-content grid place-content-center text-5xl font-black">
      Jesus Love You
    </div>
  </div>
  <div className="diff-item-2" role="img">
    <div className="bg-base-200 grid place-content-center text-5xl font-black">ព្រះយេស៊ូវស្រឡាញ់អ្នក</div>
  </div>
  <div className="diff-resizer"></div>
</figure>
    );
}