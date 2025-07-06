export default function Header() {
  return (
    <header className="flex items-center justify-between gap-4 p-4">
      <h1 className="font-medium">
        Lingua<span className="text-pink-700 font-bold">flow</span>
      </h1>
      <button className="flex items-center gap-2 specialBtn px-5 py-3 rounded-lg text-pink-500">
        <p>New</p>
        <i className="fa-solid fa-plus"></i>
      </button>
    </header>
  );
}
