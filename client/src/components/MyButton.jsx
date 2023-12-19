function MyButton({ text, ...props }) {
  return (
    <>
      <button
        {...props}
        className="bg-yellow-500 text-gray-900 py-2 px-6 rounded-full hover:bg-yellow-400 focus:outline-none focus:ring focus:border-blue-300 mr-4"
      >
        <b>{text}</b>
      </button>
    </>
  );
}

export default MyButton;
