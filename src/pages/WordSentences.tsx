import { useEffect, useState } from "react";
import type { DictionaryType } from "../config/types";
import { Info } from "lucide-react";


function getAllExamples(data: DictionaryType): string[] {
    const allExamples: string[] = [];
    const latestPosition = localStorage.getItem("latestPosition")


    // Parcours des catégories
    Object.values(data).forEach(category => {

        // Parcours des mots
        Object.values(category).forEach(word => {
            const position = word.position
            if(latestPosition && position !== parseInt(latestPosition) ) return
            // Parcours des meanings
            word.meanings.forEach(meaning => {

                // Ajouter tous les examples
                if (meaning.examples && meaning.examples.length > 0) {
                    allExamples.push(...meaning.examples);
                }

            });

        });

    });

    return allExamples;
}

function getAllWords(data: DictionaryType): string[] {
    const allWords: string[] = [];
    // Parcours des catégories
    Object.values(data).forEach(category => {
        // Parcours des mots
        allWords.push(...Object.keys(category));
    });
    return allWords;
}

function shuffleWords(wordList: string[]): string[] {
    // On copie le tableau pour ne pas modifier l'original
    const shuffled = [...wordList];

    // Algorithme de Fisher-Yates pour mélanger
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

type InputValuesType = {
    value: string;
    word: string;
}


const WordSentences = () => {
    const [BaseSentenceList, setBaseSentenceList] = useState<string[]>([]);
    const [sentenceList, setSentenceList] = useState<string[]>([]);
    const [wordList, setWordList] = useState<string[]>([]);
    const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
    const [score, setScore] = useState(0);
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const dataStringify = localStorage.getItem("db");
        const data: DictionaryType = dataStringify ? JSON.parse(dataStringify) : {};
        let tempSentenceList = getAllExamples(data);
        const tempWordList = getAllWords(data);
        tempSentenceList = shuffleWords(tempSentenceList)
        setBaseSentenceList(tempSentenceList);
        setSentenceList(tempSentenceList.slice(0, itemsPerPage))
        setWordList(tempWordList);
    }, []);

    useEffect(() => {
        const startIndex = (page - 1) * itemsPerPage;
        const newWordList = BaseSentenceList.slice(startIndex, startIndex + itemsPerPage);
        setSentenceList(newWordList);
        //const shuffledDefinitions = shuffleWords(newWordList).map(item => item.definition);
    }, [page, BaseSentenceList]);


    useEffect(()=>{
        console.log(inputValues);
    },[inputValues])

   

    const nextPage = () => {
        if (page * itemsPerPage >= BaseSentenceList.length) return;
        setPage((prev) => prev + 1);
    }

    const previousPage = () => {
        setPage((prev) => Math.max(prev - 1, 1));
    }

    const getClass = (word: string,i: number) => {

        if (word[0] === "*") {
            word = word.replaceAll("*", "")?.toLocaleLowerCase();
        }

        if (inputValues[word+i] === word?.toLowerCase()) {
            return "border-2 border-green-500 bg-green-50 pt-3 pb-2 rounded-xl  items-center";
        }

        const Findvalue = inputValues[word+i]?.toLowerCase() || "";


        if ((Findvalue !== "") && (Findvalue !== word)) {
            return "border-2 border-red-500 bg-red-50 pt-3 pb-2 rounded-xl  items-center";
        }


        return "border-2 border-gray-200 bg-gray-50 pt-3 pb-2 rounded-xl  items-center";


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
                        <p className="text-blue-600">{Math.round((score / BaseSentenceList.length) * 100)}%</p>
                    </div>
                    <p className="mb-2 font-semibold">{score} of {BaseSentenceList.length} matched</p>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${Math.round((score / BaseSentenceList.length) * 100)}%` }}></div>
                    </div>
                </div>

                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold mb-2"> Find the matching word and definition </h2>
                </div>


                <div>
                    {sentenceList.map((sentence, index) => (
                        <div key={index} className="mb-10">
                            <div key={index} className="mb-4 text-lg text-gray-700">
                                {sentence.split(" ").map((part, i) => (
                                    ((!wordList.includes(part?.toLowerCase()))) && !(part[0] === "*") ? (
                                        <span key={i} className="bg-yellow-200 px-1 rounded mr-2 p-3 ">
                                            {part}
                                        </span>) : (
                                        <>
                                            <Tooltip text={`${part}`}>
                                                <Info className="cursor-pointer" size={15} />
                                            </Tooltip>
                                            <span key={i} className="mr-2">
                                                <input
                                                    key={i}
                                                    type="text"
                                                    onChange={(e) => {
                                                        setInputValues(prev => ({ ...prev, [part.replaceAll("*", "")?.toLowerCase()+i.toString()+index.toString()]: e.target.value }));
                                                    }}
                                                    onBlur={(e) => {
                                                        setInputValues(prev => ({ ...prev, [part.replaceAll("*", "")?.toLowerCase()+i.toString()+index.toString()]: e.target.value }));
                                                    }}
                                                    value={inputValues[part.replaceAll("*", "")?.toLowerCase()+i.toString()+index.toString()]||""}
                                                    className={getClass(part.replaceAll("*", "")?.toLowerCase(),parseInt(i.toString()+index.toString())) + " text-center"}
                                                />
                                            </span>
                                        </>
                                    )
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center mt-7">
                    <div className="flex gap-4 items-center">
                        <button className="border border-gray-300 px-6 py-3 rounded-xl  hover:bg-gray-200" onClick={previousPage}>
                            Previous
                        </button>
                        {
                            Array.from({ length: Math.ceil(BaseSentenceList.length / itemsPerPage) }, (_, i) => i + 1).map((pageNum) => (
                                <button key={pageNum} className={`${page === pageNum ? 'bg-blue-500 text-red-500' : 'bg-gray-300 text-white'} px-6 py-3 rounded-xl `} onClick={() => setPage(pageNum)}>
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

export default WordSentences;


/* return (
        
        <div>
            {sentenceList.map((sentence, index) => (
                <div key={index} className="mb-10">
                    <p key={index} className="mb-4 text-lg text-gray-700">
                        {sentence.split(" ").map((part, i) => (
                            ((!wordList.includes(part))) && !( part[0]  === "*" )  ? (
                                <span key={i} className="bg-yellow-200 px-1 rounded mr-2 p-3">
                                    {part}  
                                </span>) : (
                                <span key={i} className="mr-2">
                                    <input 
                                    key={i}
                                    type="text"
                                    onBlur={(e)=>{
                                        setInputValues(prev => ({...prev, [part.replaceAll("*", "")]: e.target.value}));
                                    }}   
                                    name={part.replaceAll("*", "")} 
                                    id={part.replaceAll("*", "")} 
                                    value={inputValues[part.replaceAll("*", "")] || ""}
                                    className={getClass(part)} />
                                </span>
                            )
                        ))}
                    </p>
                </div>
            ))}
        </div>
    ) */

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