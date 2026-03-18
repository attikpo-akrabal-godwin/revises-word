
import { useEffect, useState } from 'react';
import '../App.css'
//import data from "../assets/initWords.json";
// data from "../assets/curentFile.json";
import type { DictionaryType } from '../config/types';
import { Info } from 'lucide-react';

type WordItem = { word: string, definition: string , value?: string};

function shuffleWords(wordList: WordItem[]): WordItem[] {
  // On copie le tableau pour ne pas modifier l'original
  const shuffled = [...wordList];

  // Algorithme de Fisher-Yates pour mélanger
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

/* function transformDataFormat1(data: any): WordItem[] {
  const tempTab: any = Object.entries(data);
  const tempWorList = tempTab.map((item: any) => {
    const randomIndex = Math.floor(Math.random() * item[1].length);
    return { word: item[0], definition: item[1][randomIndex] };
  });
  return tempWorList;
} */


function transformDataFormat2(data: DictionaryType): WordItem[] {
  const result: WordItem[] = [];
  const latestPosition = localStorage.getItem("latestPosition")

  Object.values(data).forEach((category: any) => {
    Object.entries(category).forEach(([word, wordData]: any) => {
      const meanings = wordData.meanings;
      const position = wordData.position

      if(latestPosition && position !== parseInt(latestPosition) ) return




      if (!meanings || meanings.length === 0) return;

      // choisir un meaning aléatoire
      const randomMeaningIndex = Math.floor(Math.random() * meanings.length);
      const selectedMeaning = meanings[randomMeaningIndex];

      // tu peux choisir soit la définition
      // soit un exemple aléatoire si tu préfères

      const definition = selectedMeaning.definition;

      // OPTION : prendre un exemple aléatoire au lieu de la définition
      // if (selectedMeaning.examples?.length) {
      //   const randomExampleIndex = Math.floor(Math.random() * selectedMeaning.examples.length);
      //   definition = selectedMeaning.examples[randomExampleIndex];
      // }

      result.push({
        word,
        definition,
        value: "" 
      });
    });
  });

  return result;
}


function Match() {
  const [rerankedDefinitions, setRerankedDefinitions] = useState<string[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [resolvedPairs, setResolvedPairs] = useState<WordItem[]>([]);
  const [worldList, setWordList] = useState<WordItem[]>([]);
  const [baseWordList, setBaseWordList] = useState<WordItem[]>([]);
  const [score, setScore] = useState(0);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const dataStringify = localStorage.getItem("db");
    const data: DictionaryType = dataStringify ? JSON.parse(dataStringify) : {};
    const tempWorList = transformDataFormat2(data);
    //console.log(tempWorList);
    setBaseWordList(tempWorList);
    setWordList(tempWorList.slice(0, itemsPerPage));
    const shuffledDefinitions = shuffleWords(tempWorList.slice(0, itemsPerPage)).map(item => item.definition);
    setRerankedDefinitions(shuffledDefinitions);
  }, []);

  useEffect(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const newWordList = baseWordList.slice(startIndex, startIndex + itemsPerPage);
    setWordList(newWordList);
    //const shuffledDefinitions = shuffleWords(newWordList).map(item => item.definition);
    const shuffledDefinitions = newWordList.map(item => item.definition);
    setRerankedDefinitions(shuffledDefinitions);
  }, [page, baseWordList]);




  const nextPage = () => {
    if (page * itemsPerPage >= baseWordList.length) return;
    setPage((prev) => prev + 1);
  }

  const previousPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  }


  const isAlreadyResolved = (word: string): boolean => {
    if (word.toLocaleLowerCase()) {
      return resolvedPairs.some(item => item.word === word);
    }
    return false;
  }

  const matchWordWithDefinition = (word: string, item: WordItem) => {
    if (word.toLocaleLowerCase() === item.word.toLocaleLowerCase()) {
      setResolvedPairs((prev) => [...prev, { ...item }]);
      setScore((prev) => prev + 1);
    }
  }

  const getClass = (word: string) => {
    if (isAlreadyResolved(word)) {
      return "w-full border-2 border-green-500 bg-green-50 p-4 rounded-xl flex justify-between items-center";
    }

    const Findvalue = worldList.find((i) => i.word === word)?.value || "";

    console.log( Findvalue);


    if ((Findvalue!=="")&&(Findvalue !== word)) {
      return "w-full border-2 border-red-500 bg-red-50 p-4 rounded-xl flex justify-between items-center";
    }

    return "w-full border-2 border-gray-200 bg-gray-50 p-4 rounded-xl flex justify-between items-center";
    

  }

  return (
    <>
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-500 text-white p-3 rounded-xl">
              📘
            </div>
            <div>
              <h1 className="text-2xl font-bold"> Word finding  </h1>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between text-sm font-medium mb-2">
            <p>Progress</p>
            <p className="text-blue-600">{Math.round((score / baseWordList.length) * 100)}%</p>
          </div>
          <p className="mb-2 font-semibold">{score} of {baseWordList.length} matched</p>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${Math.round((score / baseWordList.length) * 100)}%` }}></div>
          </div>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2"> Find the matching word and definition </h2>
        </div>


        <div className="grid grid-cols-2 gap-10">
          <div>
            <p className="text-gray-400 font-semibold mb-4 tracking-widest text-sm">DEFINITIONS</p>

            <div className="space-y-4">
              {
                rerankedDefinitions.map((item, index) => (
                  <Definition key={index} text={item} state={0} />
                ))
              }
            </div>
          </div>

          <div>
            <p className="text-gray-400 font-semibold mb-4 tracking-widest text-sm">TERMS</p>

            <div className="space-y-4">

              {
                worldList.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input key={index}
                      type="text"
                      onChange={(e) => {
                        setWordList((prev) => {
                          let newList = [...prev];
                           newList = newList.map((i) => {
                            if (i.word === item.word) {
                              return { ...i, value: e.target.value };
                            }
                            return i;
                          });
                          return newList;
                        });

                        setBaseWordList((prev) => {
                          let newList = [...prev];
                           newList = newList.map((i) => {
                            if (i.word === item.word) {
                              return { ...i, value: e.target.value };
                            }
                            return i;
                          });
                          return newList;
                        });
                      }}

                      onBlur={()=>{
                        const findValue = worldList.find((i) =>i.value === item.value)?.value || "";
                        matchWordWithDefinition(findValue, item);
                      }}
                      
                      
                      className={getClass(item.word)}
                      value={item?.value}
                      onClick={() => {
                        setSelectedWord((prev) => prev === item.word ? null : item.word);
                      }}
                    />
                    <Tooltip text={`${item.word}`}>
                      <Info className="cursor-pointer" />
                    </Tooltip>
                  </div>
                ))
              }


            </div>
          </div>

        </div>

        <div className="flex justify-center mt-7">
          <div className="flex gap-4 items-center">
            <button className="border border-gray-300 px-6 py-3 rounded-xl  hover:bg-gray-200" onClick={previousPage}>
              Previous
            </button>
            {
              Array.from({ length: Math.ceil(baseWordList.length / itemsPerPage) }, (_, i) => i + 1).map((pageNum) => (
                <button key={pageNum} className={`${page === pageNum ? 'bg-blue-500 text-red-500' : 'bg-gray-900 text-black '} px-6 py-3 rounded-xl `} onClick={() => setPage(pageNum)}>
                  {pageNum}
                </button>
              ))
            }
            <button className="border border-gray-300 px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200" onClick={nextPage}>
              Next
            </button>
          </div>
        </div>




      </div>
    </>
  )
}

export default Match

/* const Word = ({ label, state, onClick }: { label: string, state: number, onClick: (label: string) => void }) => {

  const getClass = (state: number) => {
    switch (state) {
      case 0: return "border-2 border-gray-200 bg-gray-50 p-4 rounded-xl flex justify-between items-center"; // default
      case 1: return "border-2 border-green-500 bg-green-50 p-4 rounded-xl flex justify-between items-center"; // correct
      case 2: return "border-2 border-red-500 bg-red-50 p-4 rounded-xl flex justify-between items-center"; // incorrect
      case 3: return "border-2 border-blue-500 bg-blue-50 p-4 rounded-xl flex justify-between items-center"; // selectioner 
      default: return "";
    }
  }

  const getIcone = (state: number) => {
    switch (state) {
      case 0: return <span className="w-4 h-4 border-2 border-gray-300 rounded-full"></span>;
      case 1: return <span className="text-green-600 font-bold">✔</span>;
      case 2: return <span className="text-red-600 font-bold">!</span>;
      case 3: return <span className="w-4 h-4 border-2 border-blue-500 rounded-full"></span>;
      default: return "";
    }
  }

  return (
    <>
      <div className={getClass(state)} onClick={() => onClick(label)}>
        <span className="font-semibold text-gray-700">{label}</span>
        {getIcone(state)}
      </div>
    </>
  );
} */

const Definition = ({ text, state, onClick }: { text: string, state: number, onClick?: (text: string) => void }) => {
  const getClass = (state: number) => {
    switch (state) {
      case 0: return "border border-gray-200 bg-gray-50 p-4 rounded-xl";
      case 1: return "border-2 border-green-500 bg-green-50 p-4 rounded-xl text-green-700";
      case 2: return "border-2 border-red-500 bg-red-50 p-4 rounded-xl text-red-700";
      case 3: return "border-2 border-blue-500 bg-blue-50 p-4 rounded-xl text-blue-700"; // selectioner
      default: return "";
    }
  }

  return (
    <>
      <div className={getClass(state)} onClick={() => onClick && onClick(text)}>
        {text}
      </div>
    </>
  );
};

const Tooltip = ({ text, children }) => {
  return (
    <div className="relative group inline-block">
      {children}
      <div className="absolute left-1/2 -translate-x-1/2 mt-2
                      hidden group-hover:block
                      bg-gray-900 text-white text-sm
                      px-3 py-1 rounded-lg shadow-lg
                      whitespace-nowrap z-10">
        {text}
      </div>
    </div>
  );
};



