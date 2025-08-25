import axios from "axios";

async function abc(){
const response=await axios.get("http://localhost:5000/api");
console.log(response.data)
}
abc()
function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white">
      <div className="text-center p-8 bg-white/10 backdrop-blur rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Hello Tailwind + React + TypeScript!</h1>
        <p className="text-lg">
          Your setup is <span className="font-semibold text-green-300">working perfectly</span>.
        </p>
        <button className="mt-6 px-4 py-2 bg-white text-blue-600 font-semibold rounded hover:bg-blue-100 transition">
          Click Me
        </button>
      </div>
    </div>
  );
}

export default App;
