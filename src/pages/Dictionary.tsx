import { useEffect, useMemo, useState } from "react";
import { defaultDictionary, wordDefault, type DictionaryType } from "../config/types";
//import dictionaryData from "../assets/curentFile.json";

const DictionaryPage = () => {

  const [dictionary, setDictionary] = useState<DictionaryType>({});
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [jsonText, setJsonText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);


  useEffect(() => {
    const dataStringify = localStorage.getItem("db");
    const data = dataStringify ? JSON.parse(dataStringify) : defaultDictionary;

    setDictionary(data);

    // définir catégorie par défaut
    const firstCategory = Object.keys(data)[0];
    if (firstCategory) {
      setSelectedCategory(firstCategory);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(dictionary).length > 0) {
      localStorage.setItem("db", JSON.stringify(dictionary));
    }
  }, [dictionary]);

  const categories = useMemo(() => Object.keys(dictionary) || {}, [dictionary]);
  //const words = dictionary[selectedCategory] || {};
  //const words = useMemo(() => dictionary[selectedCategory] || [], [dictionary, selectedCategory]);
  const words = useMemo(() => dictionary[selectedCategory] || {}, [dictionary, selectedCategory]);

  const addCategory = () => {
    if (!newCategory.trim()) {
      alert("Renseigne le champ");
      return;
    }

    if (dictionary.hasOwnProperty(newCategory)) {
      alert("La catégorie existe déjà");
      return;
    }

    const updatedDictionary = {
      ...dictionary,
      [newCategory]: {}
    };

    setDictionary(updatedDictionary);

    // optionnel : sélectionner la nouvelle catégorie
    setSelectedCategory(newCategory);

    setNewCategory("");
  };

  const openEditor = () => {
    setJsonText(JSON.stringify(wordDefault, null, 2)); // formaté
    setIsEditing(true);
  };

  const openUpdatingEditor = (word: string, data: any) => {
    setJsonText(JSON.stringify({ [word]: data }, null, 2)); // formaté
    setIsEditing(true);
    setIsUpdating(true);
  };


  const saveJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!isUpdating) {
        setDictionary((prev) => {
          prev[selectedCategory] = { ...prev[selectedCategory], ...parsed };
          localStorage.setItem("db", JSON.stringify(dictionary));
          return prev;
        })
      } else {
        const tempData = Object.entries(parsed);
        const [word, data] = tempData[0] ;
        setDictionary((prev) => {
          const newDictionary = {...prev};
          newDictionary[selectedCategory][word] = data;
          console.log({
            ...prev,
            [selectedCategory]: {
              ...prev[selectedCategory],
              [word]: data
            }
          });
          return newDictionary;
        })
       console.log([word, data])
        /* setDictionary((prev) => {
          return {
            ...prev,
            [selectedCategory]: {
              ...prev[selectedCategory],
              [word]: data
            }
          };
        }); */
      }


      setIsUpdating(false);
      setIsEditing(false);
    } catch (error) {
      alert("JSON invalide ❌");
    }
  };

  /* const changeWordsCategory = (word: string, categorie: string) => {

    setDictionary((prev) => {
      const wordObject = prev[selectedCategory][word]
      if(!wordObject){
        return prev
      }
      const newDictionary = { ...prev };
      delete newDictionary[selectedCategory][word]
      newDictionary[categorie] = {...newDictionary[categorie], [word]:wordObject}
      // console.log(word,categorie,prev);
      localStorage.setItem("db", JSON.stringify(newDictionary));
      return newDictionary
    })
  } */

  function removeKey(obj: any, keyToRemove: string) {
    return Object.fromEntries(
      Object.entries(obj).filter(([key]) => key !== keyToRemove)
    );
  }

  const changeWordsCategory = (word: string, categorie: string) => {
    setDictionary((prev) => {
      const wordObject = prev[selectedCategory][word];
      if (!wordObject) return prev;

      return {
        ...prev,
        [selectedCategory]: removeKey(prev[selectedCategory], word),
        [categorie]: {
          ...prev[categorie],
          [word]: wordObject
        }
      };
    });
  };


  return (
    <div className=" flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r p-6 h-screen sticky top-0 overflow-y-auto">
        <h2 className="text-lg font-bold mb-6">Categories</h2>
        <div className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat}
              draggable
              onClick={() => setSelectedCategory(cat)}
              onDrop={(e) => {
                const word = e.dataTransfer.getData("departWord")
                changeWordsCategory(word, cat);
              }}
              onDragOver={(e) => e.preventDefault()}
              className={`
                block w-full 
                text-left px-3 py-2 
                rounded-lg transition 
                ${selectedCategory === cat
                  ? "bg-gray-200 font-semibold"
                  : "hover:bg-gray-100"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="mt-7">

          <input
            type="text"
            name=""
            id=""
            placeholder="Categories"
            value={newCategory}
            onChange={(e) => {
              setNewCategory(e.target.value)
            }}
            className="border-2 border-gray-200 bg-gray-50 p-2 mb-4 rounded-xl flex justify-between items-center"
          />

          <button
            onClick={() => {
              addCategory()
            }}
            className={`block w-full text-center px-3 py-2 rounded-lg transition bg-gray-100`}
          >
            Ajouter +
          </button>
        </div>

      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto">
        <div className="flex mb-8">
          <h1 className="text-3xl font-bold  w-5/6">{selectedCategory}</h1>

          <div className="w-1/6" >
            <button
              onClick={() => {
                openEditor()
              }}
              className={`bg-gray-100 border-black block  text-center  rounded-lg transition  `}
            >
              Ajouter un mots +
            </button>
          </div>

        </div>


        <div className="grid grid-cols-2">
          {Object.entries(words).map(([word, data]) => (
            <div
              key={word}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("departWord", word)
              }}
              className="text-left  p-2 m-2 "
            >
              <div className="flex justify-between">
                <h2 className="text-2xl font-bold mb-1">{word}</h2>
                <button
                  onClick={() => {
                    openUpdatingEditor(word, data)
                  }}
                  className={`bg-gray-100 border-black block  text-center  rounded-lg transition  `}
                >
                  Modifier
                </button>
              </div>

              <p className="text-gray-500 mb-4">
                Translation: {data.translation}
              </p>

              <div className="">
                {data?.meanings?.map((meaning, index) => (
                  <div key={index}  >
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

        {isEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">

            <div className="bg-white w-3/4 h-3/4 p-6 rounded-xl flex flex-col">

              <h2 className="text-xl font-bold mb-4">
                JSON Editor
              </h2>

              <textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                className="flex-1 border p-4 font-mono text-sm rounded-lg"
              />



              <div className="flex gap-4 mt-4">
                <button
                  onClick={saveJson}
                  className="bg-black text-white px-4 py-2 rounded-lg"
                >
                  Sauvegarder
                </button>

                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-300 px-4 py-2 rounded-lg"
                >
                  Annuler
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DictionaryPage;