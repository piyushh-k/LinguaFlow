export default function Header() {
  return (
    <header className="flex flex-col items-center justify-center gap-4 p-6 w-full">
      <a href="/">
        <h1 className="font-medium text-3xl sm:text-4xl md:text-5xl tracking-tight">
          Lingua<span className="text-pink-700 font-bold">flow</span>
        </h1>
      </a>

      <a href="/" className="flex items-center gap-3 specialBtn px-7 py-4 rounded-xl text-pink-500 text-lg sm:text-xl shadow-md hover:bg-pink-50 transition-all duration-200">
        <p>New</p>
        <i className="fa-solid fa-plus"></i>
      </a>
    </header>
  );
}
