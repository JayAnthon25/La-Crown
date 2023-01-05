export default function Button({ btText, onClick }) {
  return (
    <button
      className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-2 rounded"
      onClick={onClick}>
      {btText}
    </button>
  );
}
