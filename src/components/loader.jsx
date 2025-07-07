import { ScaleLoader } from 'react-spinners';

export default function Loader({loading}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
      <h2 className="text-4xl sm:text-5xl font-extrabold text-pink-600 mb-8 text-center drop-shadow-lg tracking-tight">Translating<span className='text-4xl sm:text-5xl font-extrabold text-black'>...</span></h2>
      <ScaleLoader color="#212121" height={90} width={10} radius={24} margin={2} loading={loading} />
    </div>
  )
}
