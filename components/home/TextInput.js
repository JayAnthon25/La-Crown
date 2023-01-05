export default function TextInput({ label, type, id, value, onChange }) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="block text-gray-700">
        {label}
      </label>
      <div className="mt-1 relative rounded-md">
        <input
          type={type}
          name={id}
          id={id}
          className="focus:outline-none block w-full px-5 py-3 border-black-300 rounded-md text-lg text-center"
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
