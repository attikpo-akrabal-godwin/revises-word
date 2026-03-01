import { useEffect, useState } from "react";
import { defaultDictionary, type DictionaryType } from "../config/types";
//import dictionaryData from "../assets/format2.json";

const DictionaryPage = () => {
  
  // const [dictionary, setDictionary] = useState<DictionaryType>({});
  useEffect(() => {
    const dataStringify = localStorage.getItem("db");
    const dictionaryData: DictionaryType = dataStringify ? JSON.parse(dataStringify) : {};
   // setDictionary(dictionaryData);
  }, []);

   const dataStringify = localStorage.getItem("db");
    const dictionary: DictionaryType = dataStringify ? JSON.parse(dataStringify) : defaultDictionary;

  const categories: string[] = Object.keys(dictionary ? dictionary : defaultDictionary);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const words = dictionary[selectedCategory];
  //const [selectedWord, setSelectedWord] = useState(words[0]);
  return (
    <div className=" flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r p-6 overflow-y-auto">
        <h2 className="text-lg font-bold mb-6">Categories</h2>
        <div className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`block w-full text-left px-3 py-2 rounded-lg transition ${selectedCategory === cat
                  ? "bg-gray-200 font-semibold"
                  : "hover:bg-gray-100"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-8">{selectedCategory}</h1>

        <div className="grid grid-cols-2">
          {Object.entries(words).map(([word, data]) => (
            <div key={word} className="text-left  p-2 m-2   ">
              <h2 className="text-2xl font-bold mb-1">{word}</h2>
              <p className="text-gray-500 mb-4">
                Translation: {data.translation}
              </p>

              <div className="">
                {data?.meanings?.map((meaning, index) => (
                  <div key={index}>
                    <p className="font-medium">
                      {index + 1}. {meaning.definition}
                    </p>
                    <div className="pl-4 mt-2 border-l-2 border-gray-200 space-y-1">
                      {meaning.examples.map((example, i) => (
                        <p key={i} className="text-gray-600 italic">
                          {example}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DictionaryPage;