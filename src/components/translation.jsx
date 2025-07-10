import { LANGUAGES } from "../presets";

export default function Translation({
  loading,
  lang,
  text,
  setLang,
  setLoading,
  setTranslation,
  generateTranslation,
  translation,
}) {
  return (
    <>
      {loading ? (
        "loading..."
      ) : (
        <div className="flex flex-col gap-8 items-center mt-6">
          <h2 className="text-3xl font-bold text-slate-800">Choose Language</h2>

          <div className="flex flex-row w-full max-w-xs gap-4">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="w-full p-3 text-lg rounded-md hover:text-pink-300 duration-400 border-2 border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-500 specialBtn"
            >
              <option value="select language" disabled>
                Select language
              </option>
              {Object.entries(LANGUAGES).map(([key, value]) => (
                <option key={key} value={value}>
                  {key}
                </option>
              ))}
            </select>
            <button
              className="specialBtn rounded-lg p-4 hover:text-pink-300 duration-400"
              onClick={generateTranslation}
            >
              Translate
            </button>
          </div>

          {translation && !loading && (
            <p className="text-lg text-center text-slate-600 whitespace-pre-wrap">
              {translation}
            </p>
          )}
        </div>
      )}
    </>
  );
}
